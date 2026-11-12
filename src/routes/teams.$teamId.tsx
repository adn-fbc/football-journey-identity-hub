import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ds/page-header";
import { InfoList, Section } from "@/components/ds/section";
import { StatusBadge } from "@/components/ds/status-badge";
import { PersonAvatar } from "@/components/ds/avatars";
import { TeamCrest } from "@/components/ds/team-crest";
import { MatchRow } from "@/components/ds/match-card";
import { EmptyState } from "@/components/ds/states";
import { FilterChips, SearchInput } from "@/components/ds/filter-bar";
import { VerifiedMark } from "@/components/ds/football-id";
import { activity } from "@/data/mock";
import { getOrganization, getTeam, listPlayers, recentMatches, upcomingMatches } from "@/data/repository";
import type { Position } from "@/data/types";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/teams/$teamId")({
  loader: ({ params }) => {
    const team = getTeam(params.teamId);
    if (!team) throw notFound();
    return { team };
  },
  head: ({ loaderData }) =>
    loaderData ? pageHead(loaderData.team.name, `${loaderData.team.ageCategory} roster, coach and fixtures · season ${loaderData.team.season}`) : { meta: [{ title: "Unavailable · Football ID" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => <EmptyState title="Team not found" action={<Button asChild variant="outline"><Link to="/teams">Back to teams</Link></Button>} />,
  component: TeamPage,
});

const POS: { id: Position; label: string }[] = [
  { id: "GK", label: "Goalkeepers" }, { id: "DF", label: "Defenders" }, { id: "MF", label: "Midfielders" }, { id: "FW", label: "Forwards" },
];

function TeamPage() {
  const { team } = Route.useLoaderData();
  const org = getOrganization(team.orgId);
  const roster = listPlayers({ teamId: team.id }).sort((a, b) => (a.jersey ?? 99) - (b.jersey ?? 99));
  const [q, setQ] = useState("");
  const [pos, setPos] = useState<"all" | Position>("all");
  const filtered = roster.filter((p) => (pos === "all" || p.position === pos) && p.name.toLowerCase().includes(q.toLowerCase()));
  const upcoming = upcomingMatches(team.id);
  const recent = recentMatches(team.id).slice(0, 3);

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Teams", to: "/teams" }, { label: team.name }]} />
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <TeamCrest teamId={team.id} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><h1 className="text-h1">{team.name}</h1><StatusBadge status={team.status} /></div>
          <p className="mt-1 text-small text-muted-foreground">{org?.name}</p>
        </div>
        <Button onClick={() => toast("Invite players to this team (prototype)")}><UserPlus /> Add to roster</Button>
      </div>

      <div className="surface p-5">
        <InfoList className="md:grid-cols-5" items={[
          { label: "Age category", value: team.ageCategory },
          { label: "Season", value: team.season },
          { label: "Head coach", value: team.coach },
          { label: "Assistant", value: team.assistant ?? "—" },
          { label: "Record", value: <span className="tabular-nums">{team.record.w}W · {team.record.d}D · {team.record.l}L</span> },
        ]} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title={`Roster · ${roster.length}`} className="lg:col-span-2" flush>
          <div className="space-y-3 border-b px-5 py-3">
            <SearchInput value={q} onChange={setQ} placeholder="Search roster" />
            <FilterChips value={pos} onChange={setPos} options={[{ value: "all", label: "All" }, ...POS.map((p) => ({ value: p.id, label: p.label, count: roster.filter((r) => r.position === p.id).length }))]} />
          </div>
          {filtered.length === 0 ? (
            <div className="p-5"><EmptyState title="No players match" /></div>
          ) : (
            POS.filter((g) => filtered.some((p) => p.position === g.id)).map((g) => (
              <div key={g.id}>
                <div className="bg-muted/40 px-5 py-1.5 text-label text-muted-foreground">{g.label}</div>
                <ul className="divide-y">
                  {filtered.filter((p) => p.position === g.id).map((p) => (
                    <li key={p.id}>
                      <Link to="/players/$playerId" params={{ playerId: p.id }} className="grid grid-cols-[2.25rem_auto_1fr_auto] items-center gap-3 px-5 py-2.5 hover:bg-muted/40 md:grid-cols-[2.25rem_auto_1fr_8rem_6rem_auto]">
                        <span className="font-display text-lg font-semibold tabular-nums text-muted-foreground">{p.jersey ?? "–"}</span>
                        <PersonAvatar name={p.name} src={p.photo} size="sm" />
                        <span className="min-w-0">
                          <span className="flex items-center gap-1 truncate text-sm font-semibold">{p.name}<VerifiedMark verified={p.verification === "verified"} className="size-3.5" /></span>
                          <span className="block text-small text-muted-foreground md:hidden">{p.positionLabel}</span>
                        </span>
                        <span className="hidden text-small text-muted-foreground md:block">{p.positionLabel}</span>
                        <span className="hidden text-small tabular-nums text-muted-foreground md:block">{p.stats.goals}G · {p.stats.assists}A</span>
                        <StatusBadge status={p.membership} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </Section>

        <div className="space-y-6">
          <Section title="Upcoming matches" flush>
            {upcoming.length ? <div className="divide-y">{upcoming.map((m) => <MatchRow key={m.id} match={m} />)}</div> : <div className="p-5"><EmptyState title="No upcoming matches" /></div>}
          </Section>
          <Section title="Recent results" flush action={<Button asChild variant="ghost" size="sm"><Link to="/matches">All <ChevronRight /></Link></Button>}>
            {recent.length ? <div className="divide-y">{recent.map((m) => <MatchRow key={m.id} match={m} />)}</div> : <div className="p-5"><EmptyState title="No results yet" /></div>}
          </Section>
          <Section title="Recent activity">
            <ol className="space-y-3 text-small">
              {activity.slice(0, 3).map((a) => (
                <li key={a.id}><b>{a.who}</b> <span className="text-muted-foreground">{a.what} · {a.when}</span></li>
              ))}
            </ol>
          </Section>
        </div>
      </div>
    </div>
  );
}
