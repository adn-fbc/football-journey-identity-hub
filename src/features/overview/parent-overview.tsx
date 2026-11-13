import { Link } from "@tanstack/react-router";
import { Bell, CalendarDays, CreditCard, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { EmptyState, LoadingState, PermissionState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { JourneyTimeline } from "@/components/ds/journey-timeline";
import { ChildSelector } from "@/features/children/child-selector";
import { getParentDashboardSnapshot } from "@/features/children/parent-workspace";
import { listCurrentGuardianChildren } from "@/data/repository";
import { useNotificationState } from "@/lib/notification-state";
import { useRole } from "@/lib/role-context";
import { fmtDate } from "@/lib/format";

const formatIDR = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export function ParentOverview({ loading = false }: { loading?: boolean | undefined } = {}) {
  const { role } = useRole();
  const { isRead } = useNotificationState();
  const children = listCurrentGuardianChildren();
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? "");
  if (loading) return <LoadingState rows={4} />;
  if (role !== "parent") return <PermissionState title="Parent workspace only" description="Switch to the Parent / Guardian workspace to view your family dashboard." />;
  if (!children.length) return <EmptyState title="No children linked yet" description="Children linked to your Football ID will appear in this workspace." />;

  const child = children.find((item) => item.id === selectedChildId) ?? children[0]!;
  const dashboard = getParentDashboardSnapshot(child, isRead);
  const latestJourneyEvent = dashboard.journey.at(-1);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Parent / Guardian"
        title="Parent Home"
        description="One family workspace connected to your Football ID."
        actions={<Button asChild variant="outline"><Link to="/notifications"><Bell /> Notifications</Link></Button>}
      />

      <ChildSelector children={children} value={child.id} onChange={setSelectedChildId} />

      <Section title={`${child.nickname ?? child.name} · Today`} description={!dashboard.hasScheduleAccess ? "A current schedule-category grant is required to view activities." : dashboard.todaySchedule.length ? "Your child's activities today." : "No activities are scheduled for this child today."} flush action={<Button asChild variant="ghost" size="sm"><Link to="/schedule"><CalendarDays /> Full schedule</Link></Button>}>
        {dashboard.todaySchedule.length ? <div className="divide-y">{dashboard.todaySchedule.map((item) => <ScheduleRow key={item.id} item={item} />)}</div> : <div className="p-5"><EmptyState icon={CalendarDays} title={dashboard.hasScheduleAccess ? "No activity today" : "Schedule not shared"} description={dashboard.hasScheduleAccess ? "Upcoming training and matches will appear in the schedule." : "A current schedule grant is required before activities can be shown."} /></div>}
      </Section>

      <Section title={`Needs attention · ${dashboard.attentionCount}`} description="Items awaiting your review for this child.">
        {dashboard.attentionCount ? (
          <ul className="divide-y">
            {dashboard.consentRequests.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1"><div className="text-sm font-semibold">Consent request</div><div className="text-small text-muted-foreground">{item.body}</div></div>
                <Button asChild size="sm"><Link to="/children/$playerId" params={{ playerId: child.id }} search={{ view: "consent" }}>Review</Link></Button>
              </li>
            ))}
            {dashboard.pendingRegistrations.map((registration) => (
              <li key={registration.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1"><div className="text-sm font-semibold">Registration submitted</div><div className="text-small text-muted-foreground">{registration.title} · {registration.organization}</div></div>
                <StatusBadge status="pending" label="Awaiting response" />
                <Button asChild size="sm" variant="outline"><Link to="/children/$playerId" params={{ playerId: child.id }} search={{ view: "registrations" }}>Review</Link></Button>
              </li>
            ))}
            {dashboard.duePayments.map((payment) => (
              <li key={payment.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{payment.title}</div><div className="text-small text-muted-foreground">{formatIDR.format(payment.amount)} · due {fmtDate(payment.dueDate)}</div></div>
                <Button asChild variant="outline" size="sm"><Link to="/children/$playerId" params={{ playerId: child.id }} search={{ view: "payments" }}><CreditCard /> View</Link></Button>
              </li>
            ))}
          </ul>
        ) : <EmptyState title={dashboard.hasNotificationAccess || dashboard.hasRegistrationAccess || dashboard.hasPaymentAccess ? "Nothing needs your attention" : "Attention categories not shared"} description={dashboard.hasNotificationAccess || dashboard.hasRegistrationAccess || dashboard.hasPaymentAccess ? "Consent, registration, and contribution updates will appear here." : "Current notification, registration, or payment grants are required before these records can be shown."} />}
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title={`${child.nickname ?? child.name} · Football journey`} description="A short view of the history attached to your child's Football ID.">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 text-small">
            <span className="font-semibold">{dashboard.journey.length} recorded milestones</span>
            {latestJourneyEvent && <span className="text-muted-foreground">Latest · {latestJourneyEvent.title} · {fmtDate(latestJourneyEvent.date)}</span>}
          </div>
          <JourneyTimeline events={dashboard.journey.slice(-3)} compact />
          <Button asChild variant="ghost" size="sm" className="mt-3"><Link to="/children/$playerId" params={{ playerId: child.id }} search={{ view: "journey" }}>Open child profile</Link></Button>
        </Section>
        <Section title="My children" description="Profiles linked to your guardian relationship." flush action={<Button asChild variant="ghost" size="sm"><Link to="/children">All children</Link></Button>}>
          <ul className="divide-y">
            {children.map((item) => (
              <li key={item.id}>
                <Link to="/children/$playerId" params={{ playerId: item.id }} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40">
                  <UserRound className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{item.nickname ?? item.name}</span><span className="block truncate text-small text-muted-foreground">{item.name}</span></span>
                  <StatusBadge status={item.membership} />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
