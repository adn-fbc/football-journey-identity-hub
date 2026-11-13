import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CircleCheck, Inbox, LockKeyhole, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = Inbox, title, description, action, className,
}: { icon?: LucideIcon | undefined; title: string; description?: string | undefined; action?: ReactNode | undefined; className?: string | undefined }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center", className)}>
      <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-h3">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-small text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({ rows = 4, className }: { rows?: number | undefined; className?: string | undefined }) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-live="polite" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong", description = "We couldn't load this information. Please try again.", onRetry, className,
}: { title?: string | undefined; description?: string | undefined; onRetry?: (() => void) | undefined; className?: string | undefined }) {
  return (
    <div role="alert" aria-live="assertive" className={cn("flex flex-col items-center rounded-xl border border-error/25 bg-error/5 px-6 py-10 text-center", className)}>
      <span className="grid size-11 place-items-center rounded-full bg-error/10 text-error">
        <AlertTriangle className="size-5" />
      </span>
      <h3 className="mt-4 text-h3">{title}</h3>
      <p className="mt-1 max-w-sm text-small text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          <RefreshCw /> Try again
        </Button>
      )}
    </div>
  );
}

export function SuccessState({
  icon: Icon = CircleCheck, title, description, action, className,
}: { icon?: LucideIcon | undefined; title: string; description?: string | undefined; action?: ReactNode | undefined; className?: string | undefined }) {
  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col items-center rounded-xl border border-success/25 bg-success/5 px-6 py-10 text-center", className)}>
      <span className="grid size-11 place-items-center rounded-full bg-success/10 text-success">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-h3">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-small text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PermissionState({
  icon: Icon = LockKeyhole, title = "Access restricted", description = "You don't have permission to view this information.", action, className,
}: { icon?: LucideIcon | undefined; title?: string | undefined; description?: string | undefined; action?: ReactNode | undefined; className?: string | undefined }) {
  return (
    <div role="status" className={cn("flex flex-col items-center rounded-xl border border-border bg-muted/40 px-6 py-10 text-center", className)}>
      <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-h3">{title}</h3>
      <p className="mt-1 max-w-sm text-small text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
