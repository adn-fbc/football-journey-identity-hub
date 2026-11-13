import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PermissionState } from "@/components/ds/states";
import { MODULES } from "@/config/modules";
import { useRole } from "@/lib/role-context";
import { associationCanAccessPath } from "@/lib/association-access";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";
import { BrandMark } from "./brand";
import { GlobalSearch } from "./global-search";
import { MobileNav } from "./mobile-nav";
import { NotificationCenter } from "./notification-center";
import { ProfileMenu } from "./profile-menu";
import { RoleSwitcher } from "./role-switcher";

const KEY = "fid.sidebarCollapsed";

/** Application shell shared by every module: sidebar (desktop), top bar, bottom nav (mobile). */
export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { role } = useRole();
  const associationRestricted =
    role === "association" && !associationCanAccessPath(pathname);
  const pageTitle =
    pathname === "/identity"
      ? "Identity setup"
      : (MODULES.filter(
          (module) =>
            module.path !== "/" &&
            (pathname === module.path || pathname.startsWith(`${module.path}/`)),
        ).sort((a, b) => b.path.length - a.path.length)[0]?.title ?? "Overview");
  useEffect(() => setCollapsed(window.localStorage.getItem(KEY) === "1"), []);
  const toggle = () =>
    setCollapsed((c) => {
      window.localStorage.setItem(KEY, c ? "0" : "1");
      return !c;
    });

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-background">
        <AppSidebar collapsed={collapsed} onToggle={toggle} />
        <div
          className={cn(
            "transition-[padding] duration-200",
            collapsed ? "md:pl-[4.5rem]" : "md:pl-64",
          )}
        >
          <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8">
              <div className="flex min-w-0 flex-1 items-center gap-2 md:hidden">
                <Link to="/" aria-label="Home">
                  <BrandMark />
                </Link>
                <span className="truncate text-sm font-semibold">{pageTitle}</span>
              </div>
              <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
                <span className="max-w-40 shrink-0 truncate text-sm font-semibold">
                  {pageTitle}
                </span>
                <div className="min-w-0 flex-1">
                  {role !== "association" && <GlobalSearch />}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                <RoleSwitcher />
                <NotificationCenter />
                <ProfileMenu />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 md:px-8 md:pb-12 md:pt-8">
            {associationRestricted ? (
              <PermissionState
                title="Access limited"
                description="This area is not available in your Association workspace or current regional scope."
                action={
                  <Button asChild variant="outline">
                    <Link to="/">Return to Association overview</Link>
                  </Button>
                }
              />
            ) : (
              children
            )}
          </main>
        </div>
        <MobileNav />
      </div>
    </TooltipProvider>
  );
}
