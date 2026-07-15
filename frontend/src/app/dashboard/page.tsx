"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PropertyListResult, AppointmentListResult } from "@/types";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Building2, CalendarCheck, PhoneCall, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function OverviewPage() {
  const { data: properties } = useQuery({
    queryKey: ["properties", "overview"],
    queryFn: () => api.get<PropertyListResult>("/properties?pageSize=1"),
  });

  const { data: appointments } = useQuery({
    queryKey: ["appointments", "agent", "overview"],
    queryFn: () => api.get<AppointmentListResult>("/appointments/agent?pageSize=5"),
  });

  const counters = properties?.counters ?? {};
  const pendingAppointments = appointments?.items.filter((a) => a.status === "PENDING").length ?? 0;

  return (
    <div>
      <div className="mb-8">
        <p className="text-accent text-sm font-medium mb-1">Overview</p>
        <h1 className="font-display text-3xl text-ink">Good to see you back.</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Available" value={counters.AVAILABLE ?? 0} icon={Building2} hint="Active listings" />
        <StatCard label="Pending" value={counters.PENDING ?? 0} icon={Clock} hint="Awaiting update" />
        <StatCard label="Sold / Rented" value={(counters.SOLD ?? 0) + (counters.RENTED ?? 0)} icon={Building2} />
        <StatCard label="Appointments to confirm" value={pendingAppointments} icon={CalendarCheck} hint="Needs your review" />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-ink">Recent appointments</h2>
          <Link href="/dashboard/appointments" className="text-sm text-forest hover:underline">
            View all
          </Link>
        </div>

        {!appointments?.items.length && <p className="text-sm text-muted">No appointments yet — bookings from your AI agent will show up here.</p>}

        <div className="space-y-3">
          {appointments?.items.map((appt) => (
            <div key={appt.id} className="flex items-center justify-between py-3 border-b border-line last:border-0">
              <div>
                <p className="text-sm font-medium text-ink">{appt.client.fullName}</p>
                <p className="text-xs text-muted">
                  {appt.property.title} · {format(new Date(appt.scheduledDate), "EEE, MMM d 'at' h:mm a")}
                </p>
              </div>
              <StatusBadge status={appt.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
