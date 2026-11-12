import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb { label: string; to?: string }

export function PageHeader({
  eyebrow, title, description, actions, crumbs, className,
}: {
  eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode; crumbs?: Crumb[]; className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0 space-y-1.5">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-small text-muted-foreground">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1">
                {c.to ? <Link to={c.to} className="hover:text-foreground">{c.label}</Link> : <span className="text-foreground">{c.label}</span>}
                {i < crumbs.length - 1 && <ChevronRight className="size-3.5" />}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <div className="text-label text-primary">{eyebrow}</div>}
        <h1 className="text-h1 text-foreground">{title}</h1>
        {description && <p className="max-w-2xl text-body text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
