import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Check, ChevronsUpDown, Repeat2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLES, getRole, type RoleId } from "@/config/roles";
import { modulesForRole } from "@/config/modules";
import { useRole } from "@/lib/role-context";
import { cn } from "@/lib/utils";

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = getRole(role);

  const switchTo = (id: RoleId) => {
    if (id === role) return;
    setRole(id);
    const allowed = modulesForRole(id).some((m) => m.path !== "/" && (pathname === m.path || pathname.startsWith(m.path + "/")));
    if (!allowed && pathname !== "/") navigate({ to: "/" });
    toast.success(`Switched to ${getRole(id).label}`, { description: "Navigation and dashboard adapted to this role." });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-lg border bg-card pl-2.5 pr-2 text-left shadow-card transition-colors hover:bg-muted/60"
          aria-label={`Current role: ${current.label}. Switch role`}
        >
          <Repeat2 className="size-4 text-primary" />
          <span className="hidden leading-none sm:block">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Current role</span>
            <span className="mt-0.5 block text-sm font-semibold">{current.label}</span>
          </span>
          <span className="text-sm font-semibold sm:hidden">{current.short}</span>
          <ChevronsUpDown className="size-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-label text-muted-foreground">Switch role · one account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLES.map((r) => (
          <DropdownMenuItem key={r.id} onSelect={() => switchTo(r.id)} className="flex items-start gap-3 py-2">
            <span className={cn("mt-1 size-2 shrink-0 rounded-full", r.id === role ? "bg-primary" : "bg-border")} />
            <span className="flex-1">
              <span className="block text-sm font-semibold">{r.label}</span>
              <span className="block text-small text-muted-foreground">{r.context}</span>
            </span>
            {r.id === role && <Check className="mt-0.5 size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
