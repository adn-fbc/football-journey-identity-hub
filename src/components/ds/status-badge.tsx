import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { Status } from "@/data/types";

const statusVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      status: {
        active: "border-success/20 bg-success/10 text-success",
        verified: "border-info/20 bg-info/10 text-info",
        pending: "border-warning/25 bg-warning/12 text-warning",
        draft: "border-dashed border-neutral/40 bg-transparent text-neutral",
        completed: "border-completed/15 bg-completed/10 text-completed",
        cancelled: "border-destructive/20 bg-destructive/10 text-destructive",
        archived: "border-border bg-muted text-muted-foreground",
        scheduled: "border-border bg-card text-foreground",
        live: "border-live/25 bg-live/10 text-live",
      },
    },
    defaultVariants: { status: "active" },
  },
);

const LABELS: Record<Status, string> = {
  active: "Active", verified: "Verified", pending: "Pending", draft: "Draft", completed: "Completed",
  cancelled: "Cancelled", archived: "Archived", scheduled: "Scheduled", live: "Live",
};

const dot: Partial<Record<Status, string>> = {
  active: "bg-success", verified: "bg-info", pending: "bg-warning", completed: "bg-completed",
  cancelled: "bg-destructive", archived: "bg-muted-foreground", scheduled: "bg-muted-foreground", live: "bg-live animate-live",
};

export function StatusBadge({ status, label, className }: { status: Status; label?: string; className?: string }) {
  return (
    <span className={cn(statusVariants({ status }), className)}>
      {dot[status] && <span className={cn("size-1.5 rounded-full", dot[status])} />}
      {label ?? LABELS[status]}
    </span>
  );
}

export const STATUS_LABELS = LABELS;
