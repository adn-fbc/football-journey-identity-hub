import { Link } from "@tanstack/react-router";
import { ClipboardCheck, Dumbbell, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { PersonAvatar } from "@/components/ds/avatars";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { MatchCard } from "@/components/ds/match-card";
import { ComingSoon } from "@/components/ds/coming-soon";
import { getTeam, listPlayers, listSchedule, upcomingMatches } from "@/data/repository";

export function CoachOverview() {
  const team = getTeam("garuda-u8")!;
  const roster = listPlayers({ teamId: team.id });
  const sessions = listSchedule([team.id]).filter((s) => s.teamId === team.id);
  const next = upcomingMatches(team.id)[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Coach · SSB Garuda Makassar"
        title={team.name}
        description="Your squad at a glance."
        actions={<Button asChild variant="outline"><Link to="/teams/$teamId" params={{ teamId: team.id }}><Users /> Open roster</Link></Button>}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Players" value={roster.length} icon={Users} hint="1 pending" />
        <StatCard label="Record" value={`${team.record.w}-${team.record.d}-${team.record.l}`} hint="W-D-L this season" />
        <StatCard label="Sessions this week" value={sessions.filter((s) => s.type === "training").length} icon={Dumbbell} />
        <StatCard label="Avg attendance" value="91%" icon={ClipboardCheck} hint="Last 30 days" trend="up" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {next && <MatchCard match={next} />}
          <Section title="Your sessions" flush>
            <div className="divide-y">{sessions.map((s) => <ScheduleRow key={s.id} item={s} />)}</div>
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Squad">
            <div className="flex flex-wrap gap-3">
              {roster.map((p) => (
                <Link key={p.id} to="/players/$playerId" params={{ playerId: p.id }} className="flex w-16 flex-col items-center gap-1 text-center">
                  <PersonAvatar name={p.name} src={p.photo} size="lg" />
                  <span className="line-clamp-1 text-[11px] font-semibold">{p.name.split(" ")[0]}</span>
                </Link>
              ))}
            </div>
          </Section>
          <ComingSoon icon={ClipboardCheck} title="Attendance tracking" description="One-tap check-ins at the pitch, synced to each player's Football ID." />
          <ComingSoon icon={TrendingUp} title="Player development" description="Skill goals and progress notes, shared with guardians." />
        </div>
      </div>
    </div>
  );
}
