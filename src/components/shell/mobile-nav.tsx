import { Link } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GROUP_LABELS, mobileModulesForRole, modulesForRole, type ModuleGroup } from "@/config/modules";
import { useRole } from "@/lib/role-context";
import { cn } from "@/lib/utils";
import { useIsActive } from "./use-active-path";

const GROUPS: ModuleGroup[] = ["core", "personal", "manage", "future"];

/** Bottom tab bar (4 role-specific tabs + More). Primary navigation for players and parents on mobile. */
export function MobileNav() {
  const { role } = useRole();
  const isActive = useIsActive();
  const [open, setOpen] = useState(false);
  const tabs = mobileModulesForRole(role);
  const all = modulesForRole(role);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Mobile">
        <ul className="grid grid-cols-5">
          {tabs.map((m) => {
            const active = isActive(m.path);
            return (
              <li key={m.id}>
                <Link to={m.path} className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold", active ? "text-primary" : "text-muted-foreground")}>
                  <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", active && "bg-accent")}>
                    <m.icon className="size-5" />
                  </span>
                  <span className="max-w-full truncate px-1">{m.title === "My Children" ? "Children" : m.title}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button type="button" onClick={() => setOpen(true)} className="flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground">
              <span className="grid h-7 w-12 place-items-center rounded-full"><LayoutGrid className="size-5" /></span>
              More
            </button>
          </li>
        </ul>
      </nav>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader><SheetTitle className="font-display">All modules</SheetTitle></SheetHeader>
          <div className="space-y-5 px-4 pb-6">
            {GROUPS.map((g) => {
              const items = all.filter((m) => m.group === g);
              if (!items.length) return null;
              return (
                <div key={g}>
                  <div className="mb-2 text-label text-muted-foreground">{GROUP_LABELS[g]}</div>
                  <div className="grid grid-cols-4 gap-2">
                    {items.map((m) => (
                      <Link key={m.id} to={m.path} onClick={() => setOpen(false)} className={cn("flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center text-[11px] font-semibold leading-tight", isActive(m.path) ? "border-primary bg-accent text-accent-foreground" : "bg-card", m.status === "soon" && "opacity-70")}>
                        <m.icon className="size-5" />
                        {m.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
