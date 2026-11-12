import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_ROLE, ROLES, type RoleId } from "@/config/roles";

interface RoleContextValue {
  role: RoleId;
  setRole: (role: RoleId) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);
const STORAGE_KEY = "fid.activeRole";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleId>(DEFAULT_ROLE);

  // Read persisted role after hydration to avoid SSR mismatch.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as RoleId | null;
    if (saved && ROLES.some((r) => r.id === saved)) setRoleState(saved);
  }, []);

  const setRole = useCallback((next: RoleId) => {
    setRoleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside <RoleProvider>");
  return ctx;
}
