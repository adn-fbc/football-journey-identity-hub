import { useRouterState } from "@tanstack/react-router";

export function useIsActive() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (path: string) => (path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/"));
}
