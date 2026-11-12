import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Notification } from "@/data/types";

/** Client-side read state for mock notifications. Replace with server state later. */
interface Ctx { isRead: (n: Notification) => boolean; markRead: (id: string) => void; markAllRead: (ids: string[]) => void }
const NotificationCtx = createContext<Ctx | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const isRead = useCallback((n: Notification) => n.read || readIds.has(n.id), [readIds]);
  const markRead = useCallback((id: string) => setReadIds((s) => new Set(s).add(id)), []);
  const markAllRead = useCallback((ids: string[]) => setReadIds((s) => new Set([...s, ...ids])), []);
  return <NotificationCtx.Provider value={{ isRead, markRead, markAllRead }}>{children}</NotificationCtx.Provider>;
}

export function useNotificationState() {
  const ctx = useContext(NotificationCtx);
  if (!ctx) throw new Error("useNotificationState must be used inside <NotificationProvider>");
  return ctx;
}
