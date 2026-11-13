import { Link } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, Fingerprint, Shield, Swords, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/ds/avatars";
import { FootballIdTag } from "@/components/ds/football-id";
import { MatchRow } from "@/components/ds/match-card";
import { Section } from "@/components/ds/section";
import { JourneyTimeline } from "@/components/ds/journey-timeline";
import { EmptyState, LoadingState, PermissionState } from "@/components/ds/states";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { getJourney, getPlayer, getTeam, listSchedule, recentMatches } from "@/data/repository";
import { useRole } from "@/lib/role-context";

export function PlayerOverview({ loading = false }: { loading?: boolean | undefined } = {}) {
  const { role } = useRole();
  if (loading) return <LoadingState rows={3} />;
  if (role !== "player") {
    return (
      <PermissionState
        title="Player home only"
        description="Switch to the Player workspace to view this personal home."
      />
    );
  }

  const me = getPlayer("p-123");
  if (!me)
    return (
      <EmptyState
        title="Player profile unavailable"
        description="This Football ID is not available in the current preview."
      />
    );

  const team = getTeam(me.teamId);
  const nextActivity = team
    ? listSchedule([team.id]).find((item) => item.teamId === team.id)
    : undefined;
  const recent = team ? recentMatches(team.id).slice(0, 2) : [];
  const journey = getJourney(me.id).slice(-3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-label text-primary">My football</div>
          <h1 className="text-h1">Player Home</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Your next step, your team, your journey.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/players/$playerId" params={{ playerId: me.id }} search={{ view: "overview" }}>
            <UserRound /> My Profile
          </Link>
        </Button>
      </div>

      <div className="passport-pattern flex items-center gap-4 rounded-3xl p-5 text-ink-foreground md:p-7">
        <PersonAvatar name={me.name} src={me.photo} size="xl" className="ring-2 ring-signal/50" />
        <div className="min-w-0">
          <div className="text-label text-signal">Hey {me.nickname ?? me.name.split(" ")[0]}!</div>
          <h2 className="mt-1 font-display text-xl font-semibold md:text-2xl">{me.name}</h2>
          <p className="text-small text-ink-muted">
            {me.positionLabel}
            {team ? ` · ${team.name} · #${me.jersey}` : " · No team yet"}
          </p>
          <FootballIdTag id={me.footballId} tone="ink" className="mt-2" />
        </div>
      </div>

      <Section
        title="Next up"
        description={
          nextActivity
            ? "Your next team activity."
            : "Your schedule will appear here when an activity is added."
        }
        action={
          <Button asChild variant="ghost" size="sm">
            <Link to="/schedule">
              Full schedule <ChevronRight />
            </Link>
          </Button>
        }
        flush
      >
        {nextActivity ? (
          <ScheduleRow item={nextActivity} />
        ) : (
          <div className="p-5">
            <EmptyState
              icon={CalendarDays}
              title="Nothing scheduled"
              description="Check back when your coach adds the next training or match."
            />
          </div>
        )}
      </Section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="My team"
          description={
            team
              ? `${team.ageCategory} · ${team.season}`
              : "Team relationships are separate from your Football ID."
          }
          className="lg:col-span-1"
        >
          {team ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold">{team.name}</p>
              <p className="text-small text-muted-foreground">{team.coach}</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/teams">Open My Team</Link>
              </Button>
            </div>
          ) : (
            <EmptyState
              icon={Shield}
              title="No team yet"
              description="Your Football ID and journey remain yours while you find a team."
            />
          )}
        </Section>

        <Section
          title="Match history"
          description="Your team's latest results."
          className="lg:col-span-2"
          flush
          action={
            <Button asChild variant="ghost" size="sm">
              <Link
                to="/players/$playerId"
                params={{ playerId: me.id }}
                search={{ view: "matches" }}
              >
                View history <ChevronRight />
              </Link>
            </Button>
          }
        >
          {recent.length ? (
            <div className="divide-y">
              {recent.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="p-5">
              <EmptyState
                icon={Swords}
                title="No matches recorded yet"
                description="Completed matches will appear here."
              />
            </div>
          )}
        </Section>
      </div>

      <Section
        title="Football journey"
        description="The history that travels with your identity."
        action={
          <Button asChild variant="ghost" size="sm">
            <Link to="/football-id">
              Open journey <ChevronRight />
            </Link>
          </Button>
        }
      >
        <JourneyTimeline events={journey} compact />
      </Section>

      <nav aria-label="Player destinations" className="flex flex-wrap gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/football-id">
            <Fingerprint /> Football ID
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link
            to="/players/$playerId"
            params={{ playerId: me.id }}
            search={{ view: "development" }}
          >
            Development summary
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link to="/schedule">
            <CalendarDays /> Schedule
          </Link>
        </Button>
      </nav>
    </div>
  );
}
