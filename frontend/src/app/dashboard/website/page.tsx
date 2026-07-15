"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Website } from "@/types";
import { ExternalLink, Globe } from "lucide-react";

export default function WebsitePage() {
  const queryClient = useQueryClient();
  const { data: site } = useQuery({
    queryKey: ["website"],
    queryFn: () => api.get<Website | null>("/website"),
  });

  const [slug, setSlug] = useState("");
  const [themeColor, setThemeColor] = useState("#0B3D2E");
  const [heroText, setHeroText] = useState("");

  useEffect(() => {
    if (site) {
      setSlug(site.slug);
      setThemeColor(site.themeColor);
      setHeroText(site.heroText ?? "");
    }
  }, [site]);

  const save = useMutation({
    mutationFn: () => api.put<Website>("/website", { slug, themeColor, heroText }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["website"] }),
  });

  const publish = useMutation({
    mutationFn: (published: boolean) => api.patch<Website>("/website/publish", { published }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["website"] }),
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-accent text-sm font-medium mb-1">Website</p>
        <h1 className="font-display text-3xl text-ink">Your embeddable micro-site</h1>
        <p className="text-sm text-muted mt-1">Requires an active website builder subscription ($29/mo).</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="card p-6 space-y-4 max-w-xl"
      >
        <div>
          <label className="label">Subdomain slug</label>
          <div className="flex items-center gap-2">
            <input className="input" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="your-agency" />
            <span className="text-sm text-muted whitespace-nowrap">.estatecall.com</span>
          </div>
        </div>
        <div>
          <label className="label">Theme color</label>
          <input type="color" className="h-10 w-20 rounded-lg border border-line" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
        </div>
        <div>
          <label className="label">Hero text</label>
          <textarea className="input min-h-20" value={heroText} onChange={(e) => setHeroText(e.target.value)} placeholder="Find your next home with a call, not a search." />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={save.isPending} className="btn-primary">
            Save changes
          </button>
          {site && (
            <button type="button" onClick={() => publish.mutate(!site.published)} className="btn-secondary">
              <Globe size={16} />
              {site.published ? "Unpublish" : "Publish"}
            </button>
          )}
          {site?.published && (
            <a href={`/sites/${site.slug}`} target="_blank" className="text-sm text-forest hover:underline flex items-center gap-1">
              View live <ExternalLink size={14} />
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
