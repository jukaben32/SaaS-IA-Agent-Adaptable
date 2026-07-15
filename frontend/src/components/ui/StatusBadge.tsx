import { clsx } from "clsx";

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-accent/10 text-accent-dark",
  PENDING: "bg-amber-100 text-amber-700",
  SOLD: "bg-forest/10 text-forest",
  RENTED: "bg-forest/10 text-forest",
  WITHDRAWN: "bg-line text-muted",
  CONFIRMED: "bg-accent/10 text-accent-dark",
  CANCELLED: "bg-clay/10 text-clay",
  RESCHEDULE_REQUESTED: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-forest/10 text-forest",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx("badge", STATUS_STYLES[status] ?? "bg-line text-muted")}>
      {status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}
