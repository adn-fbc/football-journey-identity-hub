import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Bordered content block with optional title row. The main layout unit for every page. */
export function Section({
  title, description, action, children, className, bodyClassName, flush,
}: {
  title?: ReactNode; description?: ReactNode; action?: ReactNode; children: ReactNode;
  className?: string; bodyClassName?: string; flush?: boolean;
}) {
  return (
    <section className={cn("surface overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-h3">{title}</h2>}
            {description && <p className="mt-0.5 text-small text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn(!flush && "p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function InfoList({ items, className }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-4", className)}>
      {items.map((i) => (
        <div key={i.label} className="min-w-0">
          <dt className="text-label text-muted-foreground">{i.label}</dt>
          <dd className="mt-1 truncate text-sm font-semibold text-foreground">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
