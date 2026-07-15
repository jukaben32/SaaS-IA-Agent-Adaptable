"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Appointment } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PaymentModal } from "@/components/portal/PaymentModal";
import { format } from "date-fns";
import { Banknote, CreditCard, X, RefreshCw } from "lucide-react";

export default function PortalPage() {
  const queryClient = useQueryClient();
  const [payingFor, setPayingFor] = useState<string | null>(null);
  const [reschedulingFor, setReschedulingFor] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", "client"],
    queryFn: () => api.get<Appointment[]>("/appointments/client"),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["appointments", "client"] });

  const cancel = useMutation({
    mutationFn: (id: string) => api.patch(`/appointments/${id}/cancel`),
    onSuccess: invalidate,
  });

  const payCash = useMutation({
    mutationFn: (id: string) => api.patch(`/appointments/${id}/pay-cash`),
    onSuccess: invalidate,
  });

  const reschedule = useMutation({
    mutationFn: ({ id, scheduledDate }: { id: string; scheduledDate: string }) => api.patch(`/appointments/${id}/reschedule`, { scheduledDate }),
    onSuccess: () => {
      invalidate();
      setReschedulingFor(null);
    },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-accent text-sm font-medium mb-1">Your appointments</p>
        <h1 className="font-display text-3xl text-ink">Manage your viewings</h1>
      </div>

      {isLoading && <p className="text-sm text-muted">Loading…</p>}
      {!isLoading && !data?.length && <p className="text-sm text-muted">You don't have any appointments yet.</p>}

      <div className="space-y-4">
        {data?.map((appt) => (
          <div key={appt.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-display text-lg text-ink">{appt.property.title}</p>
                <p className="text-xs text-muted">{appt.property.addressLine}</p>
              </div>
              <StatusBadge status={appt.status} />
            </div>

            <p className="text-sm text-ink mb-1">{format(new Date(appt.scheduledDate), "EEEE, MMMM d 'at' h:mm a")}</p>
            <p className="text-xs text-muted mb-4">{appt.durationMinutes} minutes · {appt.type === "VIEWING" ? "Property viewing" : "Consultation"}</p>

            {reschedulingFor === appt.id ? (
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="datetime-local"
                  className="input"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                <button
                  className="btn-primary !px-3"
                  onClick={() => newDate && reschedule.mutate({ id: appt.id, scheduledDate: new Date(newDate).toISOString() })}
                >
                  Confirm
                </button>
                <button className="btn-secondary !px-3" onClick={() => setReschedulingFor(null)}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              appt.status !== "CANCELLED" &&
              appt.status !== "COMPLETED" && (
                <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  {appt.paymentStatus === "UNPAID" && (
                    <>
                      <button onClick={() => setPayingFor(appt.id)} className="btn-secondary !py-2 !px-3 text-sm">
                        <CreditCard size={14} /> Pay online
                      </button>
                      <button onClick={() => payCash.mutate(appt.id)} className="btn-secondary !py-2 !px-3 text-sm">
                        <Banknote size={14} /> Pay in cash
                      </button>
                    </>
                  )}
                  <button onClick={() => setReschedulingFor(appt.id)} className="btn-secondary !py-2 !px-3 text-sm">
                    <RefreshCw size={14} /> Reschedule
                  </button>
                  <button onClick={() => cancel.mutate(appt.id)} className="btn-danger !py-2 !px-3 text-sm">
                    <X size={14} /> Cancel
                  </button>
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {payingFor && (
        <PaymentModal
          appointmentId={payingFor}
          onClose={() => setPayingFor(null)}
          onSuccess={() => {
            setPayingFor(null);
            invalidate();
          }}
        />
      )}
    </div>
  );
}
