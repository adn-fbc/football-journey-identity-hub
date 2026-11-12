import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/** Placeholder for capabilities planned in later phases. Keeps layouts stable as modules ship. */
export function ComingSoon({ icon: Icon = Lock, title, description, className }: { icon?: LucideIcon | undefined; title: string; description: string; className?: string | undefined }) {
  return (
    <div className={cn("relative flex flex-col gap-2 rounded-xl border border-dashed bg-muted/30 p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-lg bg-card text-muted-foreground shadow-card">
          <Icon className="size-4" />
        </span>
        <span className="text-label text-muted-foreground">Coming soon</span>
      </div>
      <h3 className="mt-2 text-h3">{title}</h3>
      <p className="text-small text-muted-foreground">{description}</p>
    </div>
  );
}
