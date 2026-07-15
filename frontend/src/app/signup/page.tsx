"use client";

// Forzamos render dinámico: esta página usa useSearchParams() y no debe
// prerenderizarse en build (evita el error "missing suspense boundary").
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { api, ApiClientError } from "@/lib/api";
import { AuthCard } from "@/components/auth/AuthCard";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Matches the walkthrough: clients arrive here via the "special link" emailed
  // after booking (?role=client&email=...), agents sign up directly.
  const role = searchParams.get("role") === "client" ? "client" : "agent";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    // Supabase returns a session immediately when email confirmation is disabled;
    // otherwise this profile-completion step happens after the user confirms and logs in.
    try {
      if (role === "agent") {
        await api.post("/auth/agent/complete-profile", { fullName, companyName });
      } else {
        await api.post("/auth/client/complete-profile", { fullName });
      }
      router.replace(role === "agent" ? "/dashboard" : "/portal");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Check your email to confirm your account, then log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title={role === "client" ? "Create your client portal" : "Create your agency account"}
      subtitle={
        role === "client"
          ? "Use the same email you booked your viewing with"
          : "Start taking AI-qualified calls in minutes"
      }
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-forest font-medium hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="fullName">
            Full name
          </label>
          <input id="fullName" required className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
        </div>
        {role === "agent" && (
          <div>
            <label className="label" htmlFor="companyName">
              Agency name
            </label>
            <input id="companyName" className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Optional" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@agency.com" />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input id="password" type="password" required minLength={8} className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
        </div>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 size={16} className="animate-spin" />}
          Create account
        </button>
      </form>
    </AuthCard>
  );
}
