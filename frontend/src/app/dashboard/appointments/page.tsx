"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AppointmentListResult } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

export default function AppointmentsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", "agent"],
    queryFn: () => api.get<AppointmentListResult>("/appointments/agent"),
  });

  const confirm = useMutation({
    mutationFn: (id: string) => api.patch(`/appointments/${id}/confirm`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => api.patch(`/appointments/${id}/cancel`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-accent text-sm font-medium mb-1">Appointments</p>
        <h1 className="font-display text-3xl text-ink">Viewings & consultations</h1>
      </div>

      {isLoading && <p className="text-sm text-muted">Loading appointments…</p>}
      {!isLoading && !data?.items.length && (
        <div className="card p-10 text-center">
          <p className="text-ink font-medium mb-1">No appointments yet</p>
          <p className="text-sm text-muted">Bookings from your AI agent or website widget will show up here.</p>
        </div>
      )}

      <div className="card divide-y divide-line">
        {data?.items.map((appt) => (
          <div key={appt.id} className="p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-ink">{appt.client.fullName}</p>
                <StatusBadge status={appt.status} />
                {appt.paymentStatus !== "UNPAID" && (
                  <span className="badge bg-forest/10 text-forest">{appt.paymentStatus === "PAID_ONLINE" ? "Paid online" : "Pay in cash"}</span>
                )}
              </div>
              <p className="text-xs text-muted truncate">
                {appt.property.title} · {format(new Date(appt.scheduledDate), "EEE, MMM d 'at' h:mm a")} · {appt.durationMinutes} min
              </p>
              {appt.notes && <p className="text-xs text-muted/80 mt-1 italic">"{appt.notes}"</p>}
            </div>

            {(appt.status === "PENDING" || appt.status === "RESCHEDULE_REQUESTED") && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => confirm.mutate(appt.id)}
                  disabled={confirm.isPending}
                  className="btn-primary !px-3 !py-2"
                  title="Confirm"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => cancel.mutate(appt.id)}
                  disabled={cancel.isPending}
                  className="btn-danger !px-3 !py-2"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
