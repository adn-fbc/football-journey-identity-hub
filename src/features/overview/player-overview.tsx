import { Link } from "@tanstack/react-router";
import { ChevronRight, Fingerprint, Goal, Footprints, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/ds/avatars";
import { FootballIdTag } from "@/components/ds/football-id";
import { MatchCard, MatchRow } from "@/components/ds/match-card";
import { Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { JourneyTimeline } from "@/components/ds/journey-timeline";
import { getJourney, getPlayer, getTeam, recentMatches, upcomingMatches } from "@/data/repository";

export function PlayerOverview() {
  const me = getPlayer("p-123")!;
  const team = getTeam(me.teamId);
  const next = upcomingMatches(me.teamId)[0];
  const recent = recentMatches(me.teamId).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="passport-pattern flex items-center gap-4 rounded-3xl p-5 text-ink-foreground md:p-7">
        <PersonAvatar name={me.name} src={me.photo} size="xl" className="ring-2 ring-signal/50" />
        <div className="min-w-0">
          <div className="text-label text-signal">Hey {me.nickname}!</div>
          <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">{me.name}</h1>
          <p className="text-small text-ink-muted">#{me.jersey} · {me.positionLabel} · {team?.name}</p>
          <FootballIdTag id={me.footballId} tone="ink" className="mt-2" />
        </div>
        <Button asChild variant="signal" className="ml-auto hidden md:inline-flex"><Link to="/football-id"><Fingerprint /> My Football ID</Link></Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Matches" value={me.stats.matches} icon={Trophy} hint="Career" />
        <StatCard label="Goals" value={me.stats.goals} icon={Goal} hint="+2 last match" trend="up" />
        <StatCard label="Assists" value={me.stats.assists} icon={Footprints} />
        <StatCard label="Minutes" value={me.stats.minutes} icon={Timer} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          {next && <MatchCard match={next} />}
          <Section title="Recent matches" flush action={<Button asChild variant="ghost" size="sm"><Link to="/matches">All <ChevronRight /></Link></Button>}>
            <div className="divide-y">{recent.map((m) => <MatchRow key={m.id} match={m} />)}</div>
          </Section>
        </div>
        <Section title="My journey" className="lg:col-span-2" action={<Button asChild variant="ghost" size="sm"><Link to="/football-id">Passport <ChevronRight /></Link></Button>}>
          <JourneyTimeline events={getJourney(me.id).slice(-4)} compact />
        </Section>
      </div>
    </div>
  );
}
