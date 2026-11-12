import { Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg bg-signal text-signal-foreground", className)}>
      <Fingerprint className="size-[18px]" strokeWidth={2.25} />
    </span>
  );
}

export function BrandWordmark({ tone = "ink" }: { tone?: "ink" | "default" }) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark />
      <span className="leading-none">
        <span className={cn("block font-display text-[15px] font-semibold tracking-tight", tone === "ink" ? "text-sidebar-accent-foreground" : "text-foreground")}>
          Football ID
        </span>
        <span className={cn("mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em]", tone === "ink" ? "text-sidebar-foreground/60" : "text-muted-foreground")}>
          Youth Ecosystem
        </span>
      </span>
    </span>
  );
}
