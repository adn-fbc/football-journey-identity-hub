import type { ReactNode } from "react";

export function OrganizationSectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-h2">{title}</h2>
        <p className="mt-1 text-small text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
