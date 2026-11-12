import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, MapPin, Shield, UserCog, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Crest, PersonAvatar } from "@/components/ds/avatars";
import { Breadcrumbs } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { StatusBadge } from "@/components/ds/status-badge";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { TeamCrest } from "@/components/ds/team-crest";
import { EmptyState } from "@/components/ds/states";
import { getOrganization, listPlayers, listSchedule, listTeams } from "@/data/repository";
import { ageCategoryFor, fmtDate } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/organizations/$orgId")({
  loader: ({ params }) => {
    const org = getOrganization(params.orgId);
    if (!org) throw notFound();
    return { org };
  },
  head: ({ loaderData }) =>
    loaderData ? pageHead(loaderData.org.name, loaderData.org.description) : { meta: [{ title: "Unavailable · Football ID" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => <EmptyState title="Organization not found" action={<Button asChild variant="outline"><Link to="/organizations">Back</Link></Button>} />,
  component: OrgDashboard,
});

function OrgDashboard() {
  const { org } = Route.useLoaderData();
  const teams = listTeams(org.id);
  const players = listPlayers({ orgId: org.id });
  const sched = listSchedule().filter((s) => teams.some((t) => t.id === s.teamId));
  const recent = players.filter((p) => p.membership === "pending" || (p.memberSince ?? "") >= "2026-01-01");
  const byAge = Object.entries(
    players.filter((p) => p.membership === "active").reduce<Record<string, number>>((acc, p) => {
      const a = ageCategoryFor(p.birthYear);
      acc[a] = (acc[a] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort();
  const max = Math.max(1, ...byAge.map(([, n]) => n));

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Organizations", to: "/organizations" }, { label: org.name }]} />
      <div className="surface overflow-hidden">
        <div className="passport-pattern h-20 md:h-24" />
        <div className="-mt-10 flex flex-col gap-4 px-5 pb-5 md:flex-row md:items-end md:px-6">
          <Crest label={org.short} hue={org.color} size="xl" className="ring-4 ring-card" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h1">{org.name}</h1>
              <StatusBadge status={org.verification} />
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 text-small text-muted-foreground">
              <span>{org.type} · founded {org.founded}</span>
              <span className="flex items-center gap-1"><MapPin className="size-3.5" />{org.homeVenue}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link to="/players"><Users /> Players</Link></Button>
            <Button asChild><Link to="/teams"><Shield /> Teams</Link></Button>
          </div>
        </div>
        <p className="border-t px-5 py-4 text-body text-muted-foreground md:px-6">{org.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Players" value={org.players} icon={Users} hint="Current members" />
        <StatCard label="Teams" value={org.teams} icon={Shield} />
        <StatCard label="Coaches" value={org.coaches} icon={UserCog} />
        <StatCard label="Activities this week" value={sched.length} icon={CalendarDays} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Teams" description="Season 2026/27" flush action={<Button asChild variant="ghost" size="sm"><Link to="/teams">All teams <ChevronRight /></Link></Button>}>
            <ul className="divide-y">
              {teams.map((t) => (
                <li key={t.id}>
                  <Link to="/teams/$teamId" params={{ teamId: t.id }} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40">
                    <TeamCrest teamId={t.id} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-small text-muted-foreground">{t.coach}</div>
                    </div>
                    <span className="hidden text-small tabular-nums text-muted-foreground sm:block">{t.record.w}W {t.record.d}D {t.record.l}L</span>
                    <StatusBadge status={t.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Upcoming activities" flush>
            {sched.length ? <div className="divide-y">{sched.slice(0, 5).map((s) => <ScheduleRow key={s.id} item={s} />)}</div> : <div className="p-5"><EmptyState title="Nothing scheduled" /></div>}
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Player summary" description="Current members by age category">
            <ul className="space-y-3">
              {byAge.map(([age, n]) => (
                <li key={age} className="grid grid-cols-[3rem_1fr_2rem] items-center gap-3 text-small">
                  <span className="font-semibold">{age}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-primary" style={{ width: `${(n / max) * 100}%` }} /></span>
                  <span className="text-right tabular-nums text-muted-foreground">{n}</span>
                </li>
              ))}
            </ul>
            {!byAge.length && <p className="text-small text-muted-foreground">No player data shared.</p>}
          </Section>
          <Section title="Recent registrations" flush>
            {recent.length ? (
              <ul className="divide-y">
                {recent.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <Link to="/players/$playerId" params={{ playerId: p.id }} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40">
                      <PersonAvatar name={p.name} src={p.photo} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{p.name}</div>
                        <div className="text-small text-muted-foreground">{p.memberSince ? fmtDate(p.memberSince) : "Awaiting approval"}</div>
                      </div>
                      <StatusBadge status={p.membership} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <div className="p-5"><EmptyState title="No recent registrations" /></div>}
          </Section>
        </div>
      </div>
    </div>
  );
}
