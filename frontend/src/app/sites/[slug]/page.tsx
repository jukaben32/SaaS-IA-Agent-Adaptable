import { notFound } from "next/navigation";
import { CallWidget } from "@/components/widget/CallWidget";
import { Website } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function getSite(slug: string): Promise<Website | null> {
  const res = await fetch(`${API_URL}/website/public/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const body = await res.json();
  return body.data;
}

export default async function PublicSitePage({ params }: { params: { slug: string } }) {
  const site = await getSite(params.slug);
  if (!site) notFound();

  return (
    <main className="min-h-screen bg-sand">
      <section
        className="px-6 py-24 text-center text-white"
        style={{ backgroundColor: site.themeColor }}
      >
        <h1 className="font-display text-4xl md:text-5xl max-w-2xl mx-auto leading-tight">
          {site.heroText || "Find your next home with a call, not a search."}
        </h1>
        <p className="mt-4 text-white/70">Tap the call button in the corner — our AI agent is live.</p>
      </section>

      <CallWidget themeColor={site.themeColor} />
    </main>
  );
}
