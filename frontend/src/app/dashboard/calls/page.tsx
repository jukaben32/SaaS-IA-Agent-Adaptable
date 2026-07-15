"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CallLog } from "@/types";
import { format } from "date-fns";
import { PhoneIncoming, PhoneOutgoing } from "lucide-react";

interface CallListResult {
  items: CallLog[];
  total: number;
}

const OUTCOME_LABEL: Record<string, string> = {
  INFO_ONLY: "Info only",
  APPOINTMENT_BOOKED: "Appointment booked",
  TRANSFERRED_TO_HUMAN: "Transferred to human",
  NO_ANSWER: "No answer",
  VOICEMAIL: "Voicemail",
};

export default function CallsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["calls"],
    queryFn: () => api.get<CallListResult>("/calls"),
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-accent text-sm font-medium mb-1">Call Log</p>
        <h1 className="font-display text-3xl text-ink">Every call your AI agent took</h1>
      </div>

      {isLoading && <p className="text-sm text-muted">Loading calls…</p>}
      {!isLoading && !data?.items.length && (
        <div className="card p-10 text-center">
          <p className="text-ink font-medium mb-1">No calls logged yet</p>
          <p className="text-sm text-muted">Once your voice orchestrator posts to <code className="text-xs bg-sand px-1 py-0.5 rounded">/api/calls</code>, they'll appear here.</p>
        </div>
      )}

      <div className="card divide-y divide-line">
        {data?.items.map((call) => (
          <div key={call.id} className="p-5 flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
              {call.direction === "INBOUND" ? <PhoneIncoming size={16} /> : <PhoneOutgoing size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{call.callerName || call.callerPhone || "Unknown caller"}</p>
              <p className="text-xs text-muted">
                {call.aiAgent.name} · {call.property?.title ?? "General inquiry"} · {format(new Date(call.createdAt), "MMM d, h:mm a")}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted">{Math.floor(call.durationSeconds / 60)}:{String(call.durationSeconds % 60).padStart(2, "0")}</p>
              <span className="badge bg-sand text-muted border border-line mt-1">{OUTCOME_LABEL[call.outcome]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
