"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Client } from "@/types";
import { Mail, Phone } from "lucide-react";

export default function ClientsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: () => api.get<Client[]>("/clients"),
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-accent text-sm font-medium mb-1">Clients</p>
        <h1 className="font-display text-3xl text-ink">Everyone who's called or booked</h1>
      </div>

      {isLoading && <p className="text-sm text-muted">Loading clients…</p>}
      {!isLoading && !data?.length && <p className="text-sm text-muted">No clients yet.</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {data?.map((client) => (
          <div key={client.id} className="card p-5">
            <p className="font-display text-lg text-ink mb-2">{client.fullName}</p>
            <div className="space-y-1 text-sm text-muted mb-3">
              <p className="flex items-center gap-2">
                <Mail size={14} /> {client.email}
              </p>
              {client.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={14} /> {client.phone}
                </p>
              )}
            </div>
            <p className="text-xs text-muted border-t border-line pt-3">
              {client.appointments?.length ?? 0} appointment{client.appointments?.length === 1 ? "" : "s"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
