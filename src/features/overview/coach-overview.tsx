import { Link } from "@tanstack/react-router";
import { ClipboardCheck, Dumbbell, Shield, Swords, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { MatchRow } from "@/components/ds/match-card";
import { EmptyState, ErrorState, LoadingState, PermissionState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { TeamCrest } from "@/components/ds/team-crest";
import { getCurrentUser } from "@/data/repository";
import { getCoachDashboardSnapshot } from "./coach-dashboard-model";
import { useRole } from "@/lib/role-context";

export function CoachOverview({
  loading = false,
  error = false,
  onRetry,
}: {
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}) {
  const { role } = useRole();
  const coach = getCurrentUser();
  const dashboard = getCoachDashboardSnapshot(coach.name);

  if (loading) return <LoadingState rows={5} />;
  if (error) {
    return (
      <ErrorState
        title="Coach workspace unavailable"
        description="We couldn't load your assigned teams and activities."
        onRetry={onRetry}
      />
    );
  }
  if (role !== "coach") {
    return (
      <PermissionState
        title="Coach workspace only"
        description="Switch to the Coach workspace to view your teams and coaching activity."
      />
    );
  }
  if (!dashboard.teams.length) {
    return (
      <EmptyState
        icon={Users}
        title="No team assignments yet"
        description="Teams assigned to your Coach role will appear in this workspace."
        action={
          <Button asChild variant="outline">
            <Link to="/teams">Browse teams</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Coach workspace"
        title="Coach Dashboard"
        description="Your teams, upcoming work, and player follow-up in one place."
        actions={
          <Button asChild variant="outline">
            <Link to="/teams">
              <Users /> My Teams
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="My teams" value={dashboard.teams.length} icon={Shield} />
        <StatCard label="Players" value={dashboard.players.length} icon={Users} />
        <StatCard
          label="Upcoming training"
          value={dashboard.upcomingTraining.length}
          icon={Dumbbell}
        />
        <StatCard label="Upcoming matches" value={dashboard.upcomingMatches.length} icon={Swords} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section
            title="Upcoming training"
            description="Your next scheduled sessions."
            flush
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/schedule">Full schedule</Link>
              </Button>
            }
          >
            {dashboard.upcomingTraining.length ? (
              <div className="divide-y">
                {dashboard.upcomingTraining.slice(0, 5).map((session) => (
                  <ScheduleRow key={session.id} item={session} />
                ))}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState
                  icon={Dumbbell}
                  title="No training scheduled"
                  description="Upcoming sessions for your teams will appear here."
                />
              </div>
            )}
          </Section>
          <Section title="Upcoming matches" description="Fixtures for your assigned teams." flush>
            {dashboard.upcomingMatches.length ? (
              <div className="divide-y">
                {dashboard.upcomingMatches.slice(0, 5).map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState
                  title="No upcoming matches"
                  description="Team fixtures will appear here when published."
                />
              </div>
            )}
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="My Teams" flush>
            <ul className="divide-y">
              {dashboard.teams.map((team) => (
                <li key={team.id}>
                  <Link
                    to="/teams/$teamId"
                    params={{ teamId: team.id }}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40"
                  >
                    <TeamCrest teamId={team.id} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{team.name}</span>
                      <span className="block truncate text-small text-muted-foreground">
                        {team.ageCategory} · {team.coach}
                      </span>
                    </span>
                    <StatusBadge status={team.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Pending player assessments">
            <EmptyState
              icon={ClipboardCheck}
              title="No assessments due"
              description="Player assessment tasks will appear here when records are available."
            />
          </Section>
          <Section title="Recent activity">
            <EmptyState
              icon={TrendingUp}
              title="No recent team activity"
              description="Updates for your assigned teams will appear here."
            />
          </Section>
        </div>
      </div>
    </div>
  );
}
