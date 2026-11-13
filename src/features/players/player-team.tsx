import { Link } from "@tanstack/react-router";
import { CalendarDays, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingState } from "@/components/ds/states";
import { MatchRow } from "@/components/ds/match-card";
import { PageHeader } from "@/components/ds/page-header";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { InfoList, Section } from "@/components/ds/section";
import { TeamCrest } from "@/components/ds/team-crest";
import { getOrganization, listSchedule, recentMatches, upcomingMatches } from "@/data/repository";
import type { Player, Team } from "@/data/types";

export function PlayerTeamHome({
  player,
  team,
  loading = false,
}: {
  player: Player;
  team: Team;
  loading?: boolean | undefined;
}) {
  if (loading) return <LoadingState rows={3} />;

  const organization = getOrganization(team.orgId);
  const nextActivity = listSchedule([team.id]).find((item) => item.teamId === team.id);
  const upcoming = upcomingMatches(team.id);
  const recent = recentMatches(team.id).slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={team.season}
        title="My Team"
        description="Your team is one relationship in your football journey. Your Football ID stays yours."
        actions={
          <Button asChild variant="outline">
            <Link to="/players/$playerId" params={{ playerId: player.id }}>
              <UserRound /> My Profile
            </Link>
          </Button>
        }
      />

      <Section title={team.name} description={organization?.name}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <TeamCrest teamId={team.id} size="xl" />
          <InfoList
            className="flex-1 sm:grid-cols-2"
            items={[
              { label: "Age group", value: team.ageCategory },
              { label: "Coach", value: team.coach },
              { label: "Your position", value: player.positionLabel },
              {
                label: "Squad number",
                value: player.jersey ? `#${player.jersey}` : "Not assigned",
              },
            ]}
          />
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Next up"
          description="Your next team activity."
          flush
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/schedule">
                <CalendarDays /> Schedule
              </Link>
            </Button>
          }
        >
          {nextActivity ? (
            <ScheduleRow item={nextActivity} />
          ) : (
            <div className="p-5">
              <EmptyState
                title="Nothing scheduled"
                description="Your next training or match will appear here."
              />
            </div>
          )}
        </Section>
        <Section title="Upcoming matches" flush>
          {upcoming.length ? (
            <div className="divide-y">
              {upcoming.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="p-5">
              <EmptyState
                title="No upcoming matches"
                description="Your team fixtures will appear here."
              />
            </div>
          )}
        </Section>
      </div>

      <Section title="Recent results" flush>
        {recent.length ? (
          <div className="divide-y">
            {recent.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              title="No results yet"
              description="Completed team matches will appear here."
            />
          </div>
        )}
      </Section>
    </div>
  );
}
