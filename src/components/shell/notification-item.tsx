import { Link } from "@tanstack/react-router";
import { BadgeCheck, CalendarClock, Info, ShieldCheck, Swords, UserPlus, type LucideIcon } from "lucide-react";
import type { Notification } from "@/data/types";
import { useNotificationState } from "@/lib/notification-state";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

const ICON: Record<Notification["type"], LucideIcon> = {
  registration: UserPlus, match: Swords, consent: ShieldCheck, verification: BadgeCheck, schedule: CalendarClock, system: Info,
};

export function NotificationItem({ n, large }: { n: Notification; large?: boolean | undefined }) {
  const { isRead, markRead } = useNotificationState();
  const Icon = ICON[n.type];
  const read = isRead(n);
  return (
    <li>
      <Link
        to={n.href ?? "/notifications"}
        onClick={() => markRead(n.id)}
        className={cn("flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50", large && "px-5 py-4")}
      >
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", read ? "bg-muted text-muted-foreground" : "bg-accent text-accent-foreground")}>
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className={cn("text-sm", read ? "font-medium" : "font-bold")}>{n.title}</span>
            {!read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
          </span>
          <span className="mt-0.5 block text-small text-muted-foreground">{n.body}</span>
          <span className="mt-1 block text-[11px] font-medium text-muted-foreground/80">{format(parseISO(n.time), "d MMM · HH:mm")}</span>
        </span>
      </Link>
    </li>
  );
}
