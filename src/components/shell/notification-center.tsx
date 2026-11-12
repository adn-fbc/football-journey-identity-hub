import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { listNotifications } from "@/data/repository";
import { useRole } from "@/lib/role-context";
import { useNotificationState } from "@/lib/notification-state";
import { NotificationItem } from "./notification-item";

export function NotificationCenter() {
  const { role } = useRole();
  const { isRead, markAllRead } = useNotificationState();
  const items = listNotifications(role);
  const unread = items.filter((n) => !isRead(n)).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unread} unread`}>
          <Bell className="size-[18px]" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-live px-1 text-[10px] font-bold leading-4 text-primary-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-h3">Notifications</h2>
          <button type="button" className="text-small font-semibold text-primary hover:underline" onClick={() => markAllRead(items.map((n) => n.id))}>
            Mark all read
          </button>
        </div>
        <ul className="max-h-96 divide-y overflow-y-auto">
          {items.slice(0, 5).map((n) => <NotificationItem key={n.id} n={n} />)}
        </ul>
        <div className="border-t p-2">
          <Button asChild variant="ghost" className="w-full">
            <Link to="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
