import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ds/page-header";
import { PageTabs, PageTabsContent, PageTabsList, PageTabsTrigger } from "@/components/ds/page-tabs";
import { InfoList, Section } from "@/components/ds/section";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { EmptyState, PermissionState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { NotificationItem } from "@/components/shell/notification-item";
import { ChildSelector } from "@/features/children/child-selector";
import {
  getGuardianAccessDecision,
  getPlayerAccessForActor,
  getWorkspaceActor,
  listChildPayments,
  listChildRegistrations,
  listCurrentGuardianChildren,
  listNotifications,
  listSchedule,
} from "@/data/repository";
import { PlayerHeader } from "@/features/players/player-header";
import { PlayerJourneyTab, PlayerMatchesTab, PrimaryContextSection } from "@/features/players/player-tabs";
import { ConsentPanel } from "@/features/children/consent-panel";
import { FootballPassport } from "@/components/ds/passport";
import { ageCategoryFor, fmtDate, fmtDay, relativeDay } from "@/lib/format";
import { useRole } from "@/lib/role-context";

const childProfileSearch = z.object({
  view: z.enum(["summary", "journey", "schedule", "matches", "registrations", "payments", "notifications", "consent"]).optional(),
});

export function loadChildProfileRouteData(playerId: string) {
  return { playerId };
}

export const Route = createFileRoute("/children/$playerId")({
  loader: ({ params }) => loadChildProfileRouteData(params.playerId),
  validateSearch: childProfileSearch,
  head: () => ({ meta: [{ title: "Child profile · Football ID" }, { name: "robots", content: "noindex" }] }),
  notFoundComponent: () => <EmptyState title="Child not found" action={<Button asChild variant="outline"><Link to="/children">Back to My Children</Link></Button>} />,
  component: ChildProfile,
});

function ChildProfile() {
  const { playerId } = Route.useLoaderData();
  const { role, ready } = useRole();
  const navigate = Route.useNavigate();
  const { view } = Route.useSearch();
  if (!ready || role !== "parent") return <PermissionState title="Parent workspace only" description="Resolve the Parent / Guardian workspace before requesting child data." />;
  const access = getPlayerAccessForActor(playerId, getWorkspaceActor(role));
  if (!access.ok || access.access.scope.kind !== "guardian") {
    return <PermissionState title="Child access restricted" description="A verified relationship and current category grant are required." />;
  }
  const child = access.access.player;
  const children = listCurrentGuardianChildren();
  const guardianId = access.access.scope.guardianId;
  const canView = (category: Parameters<typeof getGuardianAccessDecision>[2]) =>
    getGuardianAccessDecision(guardianId, child.id, category).allowed;
  const canViewSchedule = canView("schedule");
  const canViewAttendance = canView("attendance");
  const canViewMatches = canView("matches");
  const canViewRegistrations = canView("registrations");
  const canViewPayments = canView("payments");
  const canViewNotifications = canView("notifications");

  const sched = canViewSchedule
    ? listSchedule(child.teamId ? [child.teamId] : []).filter((s) => !s.teamId || s.teamId === child.teamId)
    : [];
  const days = Object.entries(sched.reduce<Record<string, typeof sched>>((acc, item) => ((acc[item.date] ??= []).push(item), acc), {}));
  const notes = canViewNotifications ? listNotifications("parent").filter((item) => item.href?.includes(child.id)) : [];
  const registrations = canViewRegistrations ? listChildRegistrations(child.id) : [];
  const payments = canViewPayments ? listChildPayments(child.id) : [];
  const allowedViews = new Set([
    "summary",
    "journey",
    "consent",
    ...(canViewSchedule ? ["schedule"] : []),
    ...(canViewMatches ? ["matches"] : []),
    ...(canViewRegistrations ? ["registrations"] : []),
    ...(canViewPayments ? ["payments"] : []),
    ...(canViewNotifications ? ["notifications"] : []),
  ]);
  const selectedView = view && allowedViews.has(view) ? view : "summary";

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Parent Home", to: "/" }, { label: "My Children", to: "/children" }, { label: child.nickname ?? child.name }]} />
      <ChildSelector
        children={children}
        value={child.id}
        onChange={(childId) => navigate({ to: "/children/$playerId", params: { playerId: childId }, search: { view: selectedView } })}
      />
      <PlayerHeader player={child} />
      <PageTabs key={selectedView} defaultValue={selectedView}>
        <PageTabsList>
          <PageTabsTrigger value="summary">Summary</PageTabsTrigger>
          <PageTabsTrigger value="journey">Journey</PageTabsTrigger>
          {canViewSchedule && <PageTabsTrigger value="schedule">Schedule</PageTabsTrigger>}
          {canViewMatches && <PageTabsTrigger value="matches">Matches</PageTabsTrigger>}
          {canViewRegistrations && <PageTabsTrigger value="registrations">Registrations</PageTabsTrigger>}
          {canViewPayments && <PageTabsTrigger value="payments">Payments</PageTabsTrigger>}
          {canViewNotifications && <PageTabsTrigger value="notifications">Notifications</PageTabsTrigger>}
          <PageTabsTrigger value="consent">Privacy & consent</PageTabsTrigger>
        </PageTabsList>
        <PageTabsContent value="summary" className="space-y-6">
          <FootballPassport player={child} />
          <PrimaryContextSection player={child} />
          <Section title="Football at a glance" description="A summary of this child's current football identity and activity.">
            <InfoList className="sm:grid-cols-3" items={[
              { label: "Age group", value: ageCategoryFor(child.birthYear) },
              { label: "Position", value: child.positionLabel },
                ...(canViewAttendance ? [{ label: "Attendance", value: `${child.attendance}% · last 30 days` }] : []),
            ]} />
          </Section>
        </PageTabsContent>
        <PageTabsContent value="journey">
          <PlayerJourneyTab player={child} />
        </PageTabsContent>
        {canViewSchedule && <PageTabsContent value="schedule">
          {days.length ? days.map(([date, items]) => (
            <Section key={date} title={relativeDay(date) === fmtDay(date) ? fmtDay(date) : `${relativeDay(date)} · ${fmtDay(date)}`} flush>
              <div className="divide-y">{items.map((item) => <ScheduleRow key={item.id} item={item} />)}</div>
            </Section>
          )) : <EmptyState title="Nothing scheduled" description="Training and matches for this child will appear here." />}
        </PageTabsContent>}
        {canViewMatches && <PageTabsContent value="matches"><PlayerMatchesTab player={child} /></PageTabsContent>}
        {canViewRegistrations && <PageTabsContent value="registrations">
          {registrations.length ? (
            <Section title="Competition registrations" description="Registration status for this child's football activities.">
              <ul className="divide-y">
                {registrations.map((registration) => (
                  <li key={registration.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{registration.title}</div>
                      <div className="text-small text-muted-foreground">{registration.organization} · submitted {fmtDate(registration.submittedAt)}</div>
                    </div>
                    <StatusBadge status={registration.status === "confirmed" ? "active" : registration.status} label={registration.status === "confirmed" ? "Confirmed" : undefined} />
                  </li>
                ))}
              </ul>
            </Section>
          ) : <EmptyState title="No registrations" description="Competition registrations for this child will appear here." />}
        </PageTabsContent>}
        {canViewPayments && <PageTabsContent value="payments">
          <div className="mb-4 flex items-start gap-3 rounded-lg border bg-muted/40 p-4 text-small text-muted-foreground">
            <span className="font-semibold text-foreground">Mock records only.</span>
            <span>No payment is collected or processed in this prototype.</span>
          </div>
          {payments.length ? (
            <Section title="Contributions" description="Payment status supplied by the organization." flush>
              <ul className="divide-y">
                {payments.map((payment) => (
                  <li key={payment.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{payment.title}</div>
                      <div className="text-small text-muted-foreground">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(payment.amount)} · {payment.status === "paid" && payment.paidAt ? `paid ${fmtDate(payment.paidAt)}` : `due ${fmtDate(payment.dueDate)}`}</div>
                    </div>
                    <StatusBadge status={payment.status === "paid" ? "completed" : "pending"} label={payment.status === "paid" ? "Paid" : "Due"} />
                  </li>
                ))}
              </ul>
            </Section>
          ) : <EmptyState title="No payment records" description="Organization contributions will appear here when available." />}
        </PageTabsContent>}
        {canViewNotifications && <PageTabsContent value="notifications">
          {notes.length ? <Section flush><ul className="divide-y">{notes.map((n) => <NotificationItem key={n.id} n={n} large />)}</ul></Section> : <EmptyState title="No child-specific notifications" description="Updates for this child will appear here." />}
        </PageTabsContent>}
        <PageTabsContent value="consent"><ConsentPanel child={child} /></PageTabsContent>
      </PageTabs>
    </div>
  );
}
