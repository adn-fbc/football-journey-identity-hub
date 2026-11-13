import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FilterBar, FilterSelect, SearchInput } from "@/components/ds/filter-bar";
import { EmptyState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { TeamCrest } from "@/components/ds/team-crest";
import {
  getOrganization,
  getPlayer,
  getTeam,
  listOrganizations,
  listPlayers,
  listTeams,
} from "@/data/repository";
import { pageHead } from "@/lib/seo";
import { useRole } from "@/lib/role-context";
import { PageHeader } from "@/components/ds/page-header";
import { PlayerTeamHome } from "@/features/players/player-team";
import { getCoachAssignedTeams } from "@/lib/coach-access";

export const Route = createFileRoute("/teams/")({
  head: () =>
    pageHead("Teams", "Squads, age categories, coaches and rosters for the 2026/27 season."),
  component: TeamsPage,
});

function TeamsPage() {
  const { role } = useRole();
  const coachWorkspace = role === "coach";
  const teams = coachWorkspace ? getCoachAssignedTeams() : listTeams();
  const allOrganizations = listOrganizations();
  const organizations = coachWorkspace
    ? allOrganizations.filter((organization) => teams.some((team) => team.orgId === organization.id))
    : allOrganizations;
  const [organization, setOrganization] = useState("all");
  const [age, setAge] = useState("all");
  const [query, setQuery] = useState("");
  const ages = [...new Set(teams.map((t) => t.ageCategory))].sort(
    (a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)),
  );
  const shown = teams.filter(
    (t) =>
      (organization === "all" || t.orgId === organization) &&
      (age === "all" || t.ageCategory === age) &&
      (!query ||
        `${t.name} ${t.coach} ${getOrganization(t.orgId)?.name ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  );

  if (role === "player") {
    const player = getPlayer("p-123");
    const team = getTeam(player?.teamId);
    if (player && team) return <PlayerTeamHome player={player} team={team} />;
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Team"
          description="Your team relationship is separate from your Football ID."
        />
        <EmptyState
          title="No team yet"
          description="Your team details and activities will appear here when you join a team."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={coachWorkspace ? "Coach workspace" : "Club directory · 2026/27"}
        title={coachWorkspace ? "My Teams" : "Teams"}
        description={
          coachWorkspace
            ? "Teams assigned to your Coach role. Team management stays within each assignment."
            : "Browse squads by organization and age category. Each roster is tied to a player’s active organization relationship."
        }
        actions={
          !coachWorkspace && (
            <Button onClick={() => toast("Create team (prototype)")}>
              <Plus /> Create team
            </Button>
          )
        }
      />
      <FilterBar>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search teams, coaches or organizations"
          className="sm:w-80"
        />
        <FilterSelect
          value={organization}
          onChange={setOrganization}
          placeholder="Organization"
          options={[
            { value: "all", label: "All organizations" },
            ...organizations.map((o) => ({ value: o.id, label: o.name })),
          ]}
          className="sm:w-56"
        />
        <FilterSelect
          value={age}
          onChange={setAge}
          placeholder="Age category"
          options={[
            { value: "all", label: "All age groups" },
            ...ages.map((a) => ({ value: a, label: a })),
          ]}
        />
      </FilterBar>
      <p className="text-small text-muted-foreground">
        {shown.length} {shown.length === 1 ? "team" : "teams"}
      </p>
      {coachWorkspace && teams.length === 0 ? (
        <EmptyState
          title="No team assignments yet"
          description="Teams assigned to your Coach role will appear here."
        />
      ) : shown.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((t) => {
            const roster = listPlayers({ teamId: t.id });
            const games = t.record.w + t.record.d + t.record.l;
            return (
              <Link
                key={t.id}
                to="/teams/$teamId"
                params={{ teamId: t.id }}
                className="surface group block p-5 transition-shadow hover:shadow-elevated"
              >
                <div className="flex items-start justify-between">
                  <TeamCrest teamId={t.id} size="lg" />
                  <StatusBadge status={t.status} />
                </div>
                <h2 className="mt-4 text-h2 group-hover:text-primary">{t.name}</h2>
                <p className="text-small text-muted-foreground">
                  {getOrganization(t.orgId)?.name} · {t.ageCategory}
                </p>
                <p className="mt-1 truncate text-small text-muted-foreground">Coach: {t.coach}</p>
                <div className="mt-4 flex items-center justify-between border-t pt-3 text-small">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="size-3.5" />
                    <b className="text-foreground">{roster.length}</b> players
                  </span>
                  {games > 0 ? (
                    <span className="flex gap-1 font-semibold tabular-nums">
                      <span className="rounded bg-success/10 px-1.5 text-success">
                        {t.record.w}W
                      </span>
                      <span className="rounded bg-muted px-1.5 text-muted-foreground">
                        {t.record.d}D
                      </span>
                      <span className="rounded bg-destructive/10 px-1.5 text-destructive">
                        {t.record.l}L
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No matches yet</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No teams match"
          description="Try another organization, age group or search."
        />
      )}
    </div>
  );
}
