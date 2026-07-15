"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PropertyListResult } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { clsx } from "clsx";
import { Plus, BedDouble, Bath, Ruler } from "lucide-react";

const FILTERS = [
  { key: undefined, label: "All" },
  { key: "AVAILABLE", label: "Available" },
  { key: "PENDING", label: "Pending" },
  { key: "SOLD", label: "Sold" },
  { key: "RENTED", label: "Rented" },
] as const;

export default function ListingsPage() {
  const [status, setStatus] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ["properties", status],
    queryFn: () => api.get<PropertyListResult>(`/properties${status ? `?status=${status}` : ""}`),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-accent text-sm font-medium mb-1">Listings</p>
          <h1 className="font-display text-3xl text-ink">Your properties</h1>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Add listing
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setStatus(f.key)}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm border transition-colors",
              status === f.key ? "bg-forest text-sand border-forest" : "bg-white text-muted border-line hover:border-forest/30"
            )}
          >
            {f.label}
            {f.key && data?.counters[f.key] !== undefined && (
              <span className="ml-1.5 opacity-70">{data.counters[f.key]}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted">Loading listings…</p>}
      {!isLoading && !data?.items.length && (
        <div className="card p-10 text-center">
          <p className="text-ink font-medium mb-1">No listings yet</p>
          <p className="text-sm text-muted">Add your first property to start taking AI-qualified calls about it.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.items.map((p) => (
          <div key={p.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="badge bg-sand text-muted border border-line">{p.listingType === "SALE" ? "For sale" : "For rent"}</span>
              <StatusBadge status={p.status} />
            </div>
            <h3 className="font-display text-lg text-ink leading-snug mb-1">{p.title}</h3>
            <p className="text-xs text-muted mb-4">{p.addressLine}</p>
            <p className="font-display text-2xl text-forest mb-4">
              ${Number(p.price).toLocaleString()}
              {p.priceType === "MONTHLY" && <span className="text-sm text-muted font-sans">/mo</span>}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted border-t border-line pt-4">
              <span className="flex items-center gap-1">
                <BedDouble size={14} /> {p.bedrooms}
              </span>
              <span className="flex items-center gap-1">
                <Bath size={14} /> {p.bathrooms}
              </span>
              {p.areaSqft && (
                <span className="flex items-center gap-1">
                  <Ruler size={14} /> {Number(p.areaSqft).toLocaleString()} sqft
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
