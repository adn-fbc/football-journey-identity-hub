import { BadgeCheck, Copy, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/** Inline Football ID token — mono, copyable. Use anywhere an identity is referenced. */
export function FootballIdTag({ id, className, copy = true, tone = "default" }: { id: string; className?: string; copy?: boolean; tone?: "default" | "ink" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-id",
        tone === "ink" ? "border-ink-border bg-ink-foreground/5 text-ink-foreground" : "border-border bg-muted text-foreground",
        className,
      )}
    >
      <Fingerprint className={cn("size-3.5", tone === "ink" ? "text-signal" : "text-primary")} />
      {id}
      {copy && (
        <button
          type="button"
          aria-label="Copy Football ID"
          className="opacity-60 transition hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard?.writeText(id);
            toast.success("Football ID copied", { description: id });
          }}
        >
          <Copy className="size-3" />
        </button>
      )}
    </span>
  );
}

export function VerifiedMark({ verified, className }: { verified: boolean; className?: string }) {
  if (!verified) return null;
  return <BadgeCheck aria-label="Verified" className={cn("size-4 fill-info text-card", className)} />;
}
