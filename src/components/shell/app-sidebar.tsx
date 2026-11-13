import { Link } from "@tanstack/react-router";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { GROUP_LABELS, modulesForRole, type AppModule, type ModuleGroup } from "@/config/modules";
import { useRole } from "@/lib/role-context";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BrandMark, BrandWordmark } from "./brand";
import { useIsActive } from "./use-active-path";

const ORDER: ModuleGroup[] = ["core", "personal", "manage"];

function NavItem({ m, collapsed, active }: { m: AppModule; collapsed: boolean; active: boolean }) {
  const content = (
    <Link
      to={m.path}
      className={cn(
        "group relative flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-semibold transition-colors",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      {active && <span className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-sidebar-primary" />}
      <m.icon className={cn("size-[18px] shrink-0", active && "text-sidebar-primary")} />
      {!collapsed && <span className="truncate">{m.title}</span>}
      {!collapsed && m.status !== "live" && (
        <span className={cn("ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1", m.status === "preview" ? "text-sidebar-primary ring-sidebar-primary/40" : "text-sidebar-foreground/50 ring-sidebar-border")}>
          {m.status === "preview" ? "Preview" : "Soon"}
        </span>
      )}
    </Link>
  );
  if (!collapsed) return content;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right">{m.title}</TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { role } = useRole();
  const isActive = useIsActive();
  const modules = modulesForRole(role);
  const future = modules.filter((m) => m.group === "future");
  const [futureOpen, setFutureOpen] = useState(false);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex",
        collapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <div className={cn("flex h-16 items-center px-4", collapsed && "justify-center px-0")}>
        <Link to="/" aria-label="Football ID home">{collapsed ? <BrandMark /> : <BrandWordmark />}</Link>
      </div>

      <nav className="scrollbar-none flex-1 space-y-6 overflow-y-auto px-3 py-3" aria-label="Main">
        {ORDER.map((g) => {
          const items = modules.filter((m) => m.group === g);
          if (!items.length) return null;
          return (
            <div key={g} className="space-y-0.5">
              {!collapsed && <div className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sidebar-foreground/45">{GROUP_LABELS[g]}</div>}
              {items.map((m) => <NavItem key={m.id} m={m} collapsed={collapsed} active={isActive(m.path)} />)}
            </div>
          );
        })}

        {future.length > 0 && (
          <div className="space-y-0.5">
            {!collapsed ? (
              <button
                type="button"
                onClick={() => setFutureOpen((o) => !o)}
                className="flex w-full items-center justify-between px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sidebar-foreground/45 hover:text-sidebar-foreground"
                aria-expanded={futureOpen || future.some((m) => isActive(m.path))}
              >
                {GROUP_LABELS.future} <ChevronDown className={cn("size-3.5 transition-transform", (futureOpen || future.some((m) => isActive(m.path))) && "rotate-180")} />
              </button>
            ) : (
              <div className="mx-auto my-2 h-px w-6 bg-sidebar-border" />
            )}
            {(collapsed || futureOpen || future.some((m) => isActive(m.path))) &&
              future.map((m) => <NavItem key={m.id} m={m} collapsed={collapsed} active={isActive(m.path)} />)}
          </div>
        )}
      </nav>

      <div className={cn("border-t border-sidebar-border p-3", collapsed && "flex justify-center")}>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="mx-auto size-[18px]" /> : <><PanelLeftClose className="size-[18px]" /> Collapse</>}
        </button>
      </div>
    </aside>
  );
}
