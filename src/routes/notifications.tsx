import { createFileRoute } from "@tanstack/react-router";
import { BellOff, CheckCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { FilterChips } from "@/components/ds/filter-bar";
import { Section } from "@/components/ds/section";
import { EmptyState } from "@/components/ds/states";
import { NotificationItem } from "@/components/shell/notification-item";
import { listNotifications } from "@/data/repository";
import { getCoachAccessibleNotifications } from "@/lib/coach-access";
import { useNotificationState } from "@/lib/notification-state";
import { useRole } from "@/lib/role-context";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/notifications")({
  head: () => pageHead("Notifications", "Registrations, consent requests, match updates and schedule changes."),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { role } = useRole();
  const { isRead, markAllRead } = useNotificationState();
  const [f, setF] = useState<"all" | "unread">("all");
  const all = role === "coach" ? getCoachAccessibleNotifications() : listNotifications(role);
  const rows = all.filter((n) => f === "all" || !isRead(n));
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Updates for your current role."
        actions={<Button variant="outline" onClick={() => markAllRead(all.map((n) => n.id))}><CheckCheck /> Mark all read</Button>}
      />
      <FilterChips value={f} onChange={setF} options={[{ value: "all", label: "All", count: all.length }, { value: "unread", label: "Unread", count: all.filter((n) => !isRead(n)).length }]} />
      {rows.length ? (
        <Section flush><ul className="divide-y">{rows.map((n) => <NotificationItem key={n.id} n={n} large />)}</ul></Section>
      ) : <EmptyState icon={BellOff} title="You're all caught up" description="New updates will appear here." />}
    </div>
  );
}
