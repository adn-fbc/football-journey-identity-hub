import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, ClipboardCheck, Swords, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ds/page-header";
import { DataTable, type Column } from "@/components/ds/data-table";
import { PersonAvatar } from "@/components/ds/avatars";
import { MatchRow } from "@/components/ds/match-card";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { Section } from "@/components/ds/section";
import { EmptyState } from "@/components/ds/states";
import { StatCard } from "@/components/ds/stat-card";
import { StatusBadge } from "@/components/ds/status-badge";
import { TeamCrest } from "@/components/ds/team-crest";
import { getOrganization, listPlayers, listSchedule, upcomingMatches } from "@/data/repository";
import type { Player, Team } from "@/data/types";
import { ageCategoryFor } from "@/lib/format";

export function CoachTeamWorkspace({ team }: { team: Team }) {
  const navigate = useNavigate();
  const roster = listPlayers({ teamId: team.id });
  const training = listSchedule([team.id]).filter(
    (item) => item.type === "training" && item.teamId === team.id,
  );
  const matches = upcomingMatches(team.id);
  const organization = getOrganization(team.orgId);
  const columns: Column<Player>[] = [
    {
      key: "player",
      header: "Player",
      cell: (player) => (
        <div className="flex items-center gap-3">
          <PersonAvatar name={player.name} src={player.photo} size="sm" />
          <div className="min-w-0">
            <div className="truncate font-semibold">{player.name}</div>
            <div className="text-small text-muted-foreground">{player.positionLabel}</div>
          </div>
        </div>
      ),
    },
    {
      key: "attendance",
      header: "Attendance · 30 days",
      cell: (player) => `${player.attendance}%`,
    },
    {
      key: "status",
      header: "Relationship",
      cell: (player) => <StatusBadge status={player.membership} />,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "My Teams", to: "/teams" }, { label: team.name }]} />
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <TeamCrest teamId={team.id} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-h1">{team.name}</h1>
            <StatusBadge status={team.status} />
          </div>
          <p className="mt-1 text-small text-muted-foreground">
            {organization?.name} · {team.ageCategory} · {team.season}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/schedule">
            <CalendarDays /> Schedule
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Players" value={roster.length} icon={Users} />
        <StatCard label="Upcoming training" value={training.length} icon={ClipboardCheck} />
        <StatCard label="Upcoming matches" value={matches.length} icon={Swords} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title={`Players · ${roster.length}`} className="lg:col-span-2" flush>
          <DataTable
            rows={roster}
            columns={columns}
            getRowId={(player) => player.id}
            getRowLabel={(player) => player.name}
            onRowClick={(player) =>
              navigate({ to: "/players/$playerId", params: { playerId: player.id } })
            }
            mobileRow={(player) => (
              <div className="flex items-center gap-3">
                <PersonAvatar name={player.name} src={player.photo} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{player.name}</span>
                  <span className="block text-small text-muted-foreground">
                    {player.positionLabel} · {ageCategoryFor(player.birthYear)} ·{" "}
                    {player.attendance}% attendance
                  </span>
                </span>
                <StatusBadge status={player.membership} />
              </div>
            )}
            empty={
              <div className="p-5">
                <EmptyState
                  title="No players assigned"
                  description="Players in this team will appear here."
                />
              </div>
            }
          />
        </Section>

        <div className="space-y-6">
          <Section title="Upcoming training" flush>
            {training.length ? (
              <div className="divide-y">
                {training.slice(0, 4).map((session) => (
                  <ScheduleRow key={session.id} item={session} />
                ))}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState icon={CalendarDays} title="No training scheduled" />
              </div>
            )}
          </Section>
          <Section title="Upcoming matches" flush>
            {matches.length ? (
              <div className="divide-y">
                {matches.slice(0, 4).map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState icon={Swords} title="No upcoming matches" />
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
