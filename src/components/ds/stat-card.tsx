import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, hint, icon: Icon, trend, className,
}: { label: string; value: ReactNode; hint?: ReactNode | undefined; icon?: LucideIcon | undefined; trend?: "up" | "down" | undefined; className?: string | undefined }) {
  return (
    <div className={cn("surface p-4 md:p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-small font-medium text-muted-foreground">{label}</span>
        {Icon && (
          <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">{value}</div>
      {hint && (
        <div className={cn("mt-1 text-small", trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground")}>
          {hint}
        </div>
      )}
    </div>
  );
}
