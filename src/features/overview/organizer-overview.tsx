import { Link } from "@tanstack/react-router";
import { AlertCircle, CalendarRange, ChevronRight, Goal, Shield, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { MatchCard, MatchRow } from "@/components/ds/match-card";
import { StandingsTable } from "@/features/competitions/standings-table";
import { computeStandings, getCompetition, listMatches } from "@/data/repository";
import { fmtDate } from "@/lib/format";

export function OrganizerOverview() {
  const comp = getCompetition("myc-2027")!;
  const all = listMatches({ competitionId: comp.id });
  const played = all.filter((m) => m.status === "completed");
  const live = all.find((m) => m.status === "live");
  const upcoming = all.filter((m) => m.status === "scheduled");
  const goals = played.reduce((s, m) => s + (m.score ? m.score.home + m.score.away : 0), 0);
  const teamCount = comp.categories.reduce((s, c) => s + c.teamIds.length, 0);
  const u10 = comp.categories.find((c) => c.id === "u10")!;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Competition Organizer"
        title={comp.name}
        description={`${fmtDate(comp.start)} – ${fmtDate(comp.end)} · ${comp.venues.length} venues`}
        actions={<Button asChild><Link to="/competitions/$competitionId" params={{ competitionId: comp.id }}>Manage competition</Link></Button>}
      />
      <div className="surface p-5">
        <div className="flex items-center justify-between text-small"><span className="font-semibold">Tournament progress</span><span className="text-muted-foreground">{played.length} of {all.length} matches played</span></div>
        <Progress value={(played.length / all.length) * 100} className="mt-3 h-2" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Teams" value={teamCount} icon={Shield} hint={`${comp.categories.length} categories`} />
        <StatCard label="Matches played" value={played.length} icon={Swords} />
        <StatCard label="Goals" value={goals} icon={Goal} hint={`${(goals / Math.max(1, played.length)).toFixed(1)} per match`} />
        <StatCard label="Next matchday" value="21 Feb" icon={CalendarRange} hint={`${upcoming.length} fixtures`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {live && <MatchCard match={live} label="Live now" />}
          <Section title="Upcoming fixtures" flush action={<Button asChild variant="ghost" size="sm"><Link to="/matches">All <ChevronRight /></Link></Button>}>
            <div className="divide-y">{upcoming.map((m) => <MatchRow key={m.id} match={m} showCompetition={false} />)}</div>
          </Section>
        </div>
        <div className="space-y-6">
          <Section title={<span className="flex items-center gap-2"><AlertCircle className="size-4 text-warning" />Needs action</span>} flush>
            <ul className="divide-y text-sm">
              <li className="px-5 py-3"><b>Alpha U10 vs Toraja Raya U10</b><div className="text-small text-muted-foreground">Postponed — set a new date</div></li>
              <li className="px-5 py-3"><b>Liga Anak Sulsel 2027</b><div className="text-small text-muted-foreground">5 team registrations to review</div></li>
            </ul>
          </Section>
          <Section title="U10 · Group A" flush>
            <StandingsTable rows={computeStandings(u10.groups[0]?.teamIds ?? [], all)} compact />
          </Section>
        </div>
      </div>
    </div>
  );
}
