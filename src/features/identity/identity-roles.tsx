import { Check } from "lucide-react";
import { ROLES, getRole, type RoleId } from "@/config/roles";
import { cn } from "@/lib/utils";

export function IdentityRolePicker({
  value,
  onChange,
}: {
  value: RoleId[];
  onChange: (roles: RoleId[]) => void;
}) {
  const toggle = (id: RoleId) => {
    onChange(value.includes(id) ? value.filter((role) => role !== id) : [...value, id]);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ROLES.filter((role) => role.identitySelectable !== false).map((role) => {
        const selected = value.includes(role.id);
        return (
          <button
            key={role.id}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(role.id)}
            className={cn(
              "flex min-h-20 items-start gap-3 rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected ? "border-primary bg-accent/60" : "bg-card hover:bg-muted/50",
            )}
          >
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded border",
                selected && "border-primary bg-primary text-primary-foreground",
              )}
            >
              {selected && <Check className="size-3.5" />}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{role.label}</span>
              <span className="mt-0.5 block text-small text-muted-foreground">{role.context}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function FootballRoleList({
  roles,
  activeRole,
}: {
  roles: RoleId[];
  activeRole?: RoleId | undefined;
}) {
  if (!roles.length)
    return <p className="text-small text-muted-foreground">No football roles added yet.</p>;

  return (
    <ul className="flex flex-wrap gap-2">
      {roles.map((id) => {
        const role = getRole(id);
        const active = id === activeRole;
        return (
          <li
            key={id}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-small font-semibold",
              active ? "border-primary/30 bg-accent text-accent-foreground" : "bg-card",
            )}
          >
            <span>{role.label}</span>
            {active && <span className="text-label text-primary">Active</span>}
          </li>
        );
      })}
    </ul>
  );
}
