"use client";

import { useState } from "react";
import { Phone, X, Loader2 } from "lucide-react";
import { clsx } from "clsx";

// Embeddable call/booking widget - the same component powers the public micro-site
// (app/sites/[slug]) and the standalone demo/test pages. In production this would open
// a Realtime voice session (WebRTC/WebSocket) against the voice orchestrator; here it's
// wired to visually simulate the call state so the flow is inspectable end-to-end.
export function CallWidget({ agentName = "Alexis", themeColor = "#0B3D2E" }: { agentName?: string; themeColor?: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "connecting" | "live">("idle");

  function startCall() {
    setStatus("connecting");
    setTimeout(() => setStatus("live"), 1200);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 card p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: themeColor }}>
                {agentName[0]}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{agentName}</p>
                <p className="text-xs text-muted">AI real estate assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-ink">
              <X size={16} />
            </button>
          </div>

          {status === "idle" && (
            <button onClick={startCall} className="btn-primary w-full" style={{ backgroundColor: themeColor }}>
              <Phone size={16} /> Start a call
            </button>
          )}
          {status === "connecting" && (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted">
              <Loader2 size={16} className="animate-spin" /> Connecting…
            </div>
          )}
          {status === "live" && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-live" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="text-xs text-muted">Live · ask about any listing</span>
              </div>
              <button
                onClick={() => {
                  setStatus("idle");
                  setOpen(false);
                }}
                className="btn-danger w-full"
              >
                End call
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className={clsx("h-14 w-14 rounded-full shadow-card flex items-center justify-center text-white transition-transform hover:scale-105")}
        style={{ backgroundColor: themeColor }}
        aria-label="Talk to our AI agent"
      >
        <Phone size={20} />
      </button>
    </div>
  );
}
