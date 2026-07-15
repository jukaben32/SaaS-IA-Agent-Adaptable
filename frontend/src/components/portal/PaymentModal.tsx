"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { api } from "@/lib/api";
import { X } from "lucide-react";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function CheckoutForm({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({ elements, redirect: "if_required" });

    setSubmitting(false);
    if (confirmError) {
      setError(confirmError.message ?? "Payment failed");
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-clay">{error}</p>}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={!stripe || submitting} className="btn-primary flex-1">
          {submitting ? "Processing…" : "Pay now"}
        </button>
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function PaymentModal({ appointmentId, onClose, onSuccess }: { appointmentId: string; onClose: () => void; onSuccess: () => void }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    api.post<{ clientSecret: string }>("/payments/intent", { appointmentId }).then((res) => setClientSecret(res.clientSecret));
  }, [appointmentId]);

  if (!stripePromise) {
    return (
      <Modal onClose={onClose}>
        <p className="text-sm text-muted">
          Stripe isn't configured yet. Set <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to enable online payments.
        </p>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      {!clientSecret && <p className="text-sm text-muted">Preparing checkout…</p>}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      )}
    </Modal>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-6 z-50">
      <div className="card bg-white p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-ink">
          <X size={18} />
        </button>
        <h3 className="font-display text-lg text-ink mb-4">Pay for your viewing</h3>
        {children}
      </div>
    </div>
  );
}
