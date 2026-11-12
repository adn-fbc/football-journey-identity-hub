import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ds/page-header";
import { PageTabs, PageTabsContent, PageTabsList, PageTabsTrigger } from "@/components/ds/page-tabs";
import { Section } from "@/components/ds/section";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { EmptyState } from "@/components/ds/states";
import { NotificationItem } from "@/components/shell/notification-item";
import { getPlayer, listNotifications, listSchedule } from "@/data/repository";
import { PlayerHeader } from "@/features/players/player-header";
import { PlayerJourneyTab, PlayerMatchesTab } from "@/features/players/player-tabs";
import { ConsentPanel } from "@/features/children/consent-panel";
import { FootballPassport } from "@/components/ds/passport";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/children/$playerId")({
  loader: ({ params }) => {
    const child = getPlayer(params.playerId);
    if (!child || !child.guardianIds.includes("g-1")) throw notFound();
    return { child };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(`${loaderData.child.nickname ?? loaderData.child.name}`, "Journey, schedule, matches and privacy controls for your child.")
      : { meta: [{ title: "Unavailable · Football ID" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => <EmptyState title="Child not found" action={<Button asChild variant="outline"><Link to="/children">Back to My Children</Link></Button>} />,
  component: ChildProfile,
});

function ChildProfile() {
  const { child } = Route.useLoaderData();
  const sched = listSchedule(child.teamId ? [child.teamId] : []).filter((s) => !s.teamId || s.teamId === child.teamId);
  const notes = listNotifications("parent");
  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "My Children", to: "/children" }, { label: child.nickname ?? child.name }]} />
      <PlayerHeader player={child} />
      <PageTabs defaultValue="journey">
        <PageTabsList>
          <PageTabsTrigger value="journey">Journey</PageTabsTrigger>
          <PageTabsTrigger value="schedule">Schedule</PageTabsTrigger>
          <PageTabsTrigger value="matches">Matches</PageTabsTrigger>
          <PageTabsTrigger value="notifications">Notifications</PageTabsTrigger>
          <PageTabsTrigger value="consent">Privacy & consent</PageTabsTrigger>
        </PageTabsList>
        <PageTabsContent value="journey" className="space-y-6">
          <FootballPassport player={child} />
          <PlayerJourneyTab player={child} />
        </PageTabsContent>
        <PageTabsContent value="schedule">
          <Section title="Upcoming" flush>
            {sched.length ? <div className="divide-y">{sched.map((s) => <ScheduleRow key={s.id} item={s} />)}</div> : <div className="p-5"><EmptyState title="Nothing scheduled" /></div>}
          </Section>
        </PageTabsContent>
        <PageTabsContent value="matches"><PlayerMatchesTab player={child} /></PageTabsContent>
        <PageTabsContent value="notifications">
          <Section flush><ul className="divide-y">{notes.map((n) => <NotificationItem key={n.id} n={n} large />)}</ul></Section>
        </PageTabsContent>
        <PageTabsContent value="consent"><ConsentPanel child={child} /></PageTabsContent>
      </PageTabs>
    </div>
  );
}
