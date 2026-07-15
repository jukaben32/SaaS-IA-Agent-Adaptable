"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function PortalHeader() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/portal" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-display text-lg tracking-tight text-forest">EstateCall</span>
        </Link>
        <button onClick={handleSignOut} className="text-sm text-muted hover:text-ink flex items-center gap-1.5">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </header>
  );
}
