import { Link } from "@tanstack/react-router";
import { CalendarRange, ExternalLink, MapPin, Shield, Swords, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ds/page-header";
import type { Competition, Match } from "@/data/types";
import {
  PageTabs,
  PageTabsContent,
  PageTabsList,
  PageTabsTrigger,
} from "@/components/ds/page-tabs";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ds/stat-card";
import { StatusBadge } from "@/components/ds/status-badge";
import { MatchRow } from "@/components/ds/match-card";
import { TeamCrest } from "@/components/ds/team-crest";
import { EmptyState } from "@/components/ds/states";
import { CompetitionCategoryCard, CompetitionCategorySelector } from "./competition-category";
import { CompetitionMatchGroups } from "./competition-match-groups";
import { StandingsTable } from "./standings-table";
import {
  completedResults,
  matchesForCategory,
  scheduledMatches,
  teamGroupsForCategory,
} from "./competition-view-model";
import { computeStandings, getOrganization, getTeam, listMatches } from "@/data/repository";
import { fmtDate } from "@/lib/format";

export const COMPETITION_DETAIL_VIEWS = [
  "overview",
  "categories",
  "teams",
  "schedule",
  "matches",
  "results",
  "standings",
] as const;

export type CompetitionDetailView = (typeof COMPETITION_DETAIL_VIEWS)[number];

const TABS: { value: CompetitionDetailView; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "categories", label: "Categories" },
  { value: "teams", label: "Teams" },
  { value: "schedule", label: "Schedule" },
  { value: "matches", label: "Matches" },
  { value: "results", label: "Results" },
  { value: "standings", label: "Standings" },
];

export function CompetitionDetail({
  competition,
  view,
  categoryId,
  matches: scopedMatches,
  assignedTeamIds,
  onNavigate,
}: {
  competition: Competition;
  view: CompetitionDetailView;
  categoryId?: string | undefined;
  matches?: Match[] | undefined;
  assignedTeamIds?: string[] | undefined;
  onNavigate: (view: CompetitionDetailView, categoryId: string) => void;
}) {
  const allMatches = scopedMatches ?? listMatches({ competitionId: competition.id });
  const category =
    competition.categories.find((item) => item.id === categoryId) ?? competition.categories[0];
  const selectedCategoryId = category?.id ?? "";
  const categoryGroups = category ? teamGroupsForCategory(category) : [];
  const categoryMatches = category ? matchesForCategory(allMatches, category.id) : [];
  const schedule = scheduledMatches(categoryMatches);
  const results = completedResults(categoryMatches);
  const completedCount = allMatches.filter((match) => match.status === "completed").length;
  const teamCount = new Set(competition.categories.flatMap((item) => item.teamIds)).size;
  const visibleTabs = assignedTeamIds ? TABS.filter((tab) => tab.value !== "standings") : TABS;
  const activeView = assignedTeamIds && view === "standings" ? "overview" : view;

  const changeView = (nextView: CompetitionDetailView) => onNavigate(nextView, selectedCategoryId);
  const selectCategory = (nextCategoryId: string) => onNavigate(view, nextCategoryId);
  const categorySelector = category ? (
    <CompetitionCategorySelector
      categories={competition.categories}
      value={category.id}
      onChange={selectCategory}
    />
  ) : null;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        crumbs={[{ label: "Competitions", to: "/competitions" }, { label: competition.name }]}
      />
      <div className="pitch-lines relative overflow-hidden rounded-3xl p-6 text-ink-foreground md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-signal" />
              <span className="text-label text-ink-muted">{competition.format}</span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {competition.name}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-ink-muted">
              <span className="flex items-center gap-1">
                <CalendarRange className="size-3.5" />
                {fmtDate(competition.start)} – {fmtDate(competition.end)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {competition.city} · {competition.venues.length} venue
                {competition.venues.length === 1 ? "" : "s"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={competition.status} className="bg-ink-foreground/10" />
            {competition.publicVisibility === "public" && (
              <Button asChild variant="outline">
                <Link
                  to="/public/competitions/$competitionId"
                  params={{ competitionId: competition.id }}
                >
                  <ExternalLink /> Public portal
                </Link>
              </Button>
            )}
            {competition.status === "pending" && (
              <Button variant="signal" onClick={() => changeView("teams")}>
                View eligible teams
              </Button>
            )}
          </div>
        </div>
      </div>

      <PageTabs
        value={activeView}
        onValueChange={(next) => changeView(next as CompetitionDetailView)}
      >
        <PageTabsList aria-label={`${competition.name} sections`}>
          {visibleTabs.map((tab) => (
            <PageTabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </PageTabsTrigger>
          ))}
        </PageTabsList>

        <PageTabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Categories" value={competition.categories.length} icon={Trophy} />
            <StatCard label="Teams" value={teamCount} icon={Shield} />
            <StatCard
              label="Matches"
              value={allMatches.length}
              icon={Swords}
              hint={`${completedCount} completed`}
            />
            <StatCard label="Venues" value={competition.venues.length} icon={MapPin} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Section title="About" className="lg:col-span-2">
              <p className="text-body text-muted-foreground">{competition.description}</p>
              <InfoList
                className="mt-5 md:grid-cols-3"
                items={[
                  { label: "Organizer", value: competition.organizer },
                  { label: "Format", value: competition.format },
                  {
                    label: "Registration deadline",
                    value: competition.registrationDeadline
                      ? fmtDate(competition.registrationDeadline)
                      : "—",
                  },
                ]}
              />
              {allMatches.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-small">
                    <span className="font-semibold">Results recorded</span>
                    <span className="text-muted-foreground">
                      {completedCount}/{allMatches.length} matches
                    </span>
                  </div>
                  <Progress
                    value={(completedCount / allMatches.length) * 100}
                    className="mt-2 h-2"
                  />
                </div>
              )}
            </Section>
            <Section title="Venues" flush>
              <ul className="divide-y">
                {competition.venues.map((venue) => (
                  <li key={venue} className="flex items-center gap-2 px-5 py-3 text-sm">
                    <MapPin className="size-4 text-muted-foreground" /> {venue}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
          {allMatches.length ? (
            <Section
              title="Latest results and next fixtures"
              flush
              action={
                <Button variant="ghost" size="sm" onClick={() => changeView("schedule")}>
                  Full schedule
                </Button>
              }
            >
              <div className="divide-y">
                {[...results.slice(-2).reverse(), ...schedule.slice(0, 3)].map((match) => (
                  <MatchRow key={match.id} match={match} showCompetition={false} />
                ))}
              </div>
            </Section>
          ) : (
            <EmptyState
              icon={Swords}
              title="No matches published"
              description="Fixtures will appear here when the competition schedule is available."
            />
          )}
        </PageTabsContent>
        <PageTabsContent value="categories">
          {competition.categories.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {competition.categories.map((item) => (
                <CompetitionCategoryCard
                  key={item.id}
                  category={item}
                  matchCount={matchesForCategory(allMatches, item.id).length}
                  onOpenTeams={(nextCategoryId) => onNavigate("teams", nextCategoryId)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Trophy}
              title="Categories not announced"
              description="Competition categories will appear here once they are published."
            />
          )}
        </PageTabsContent>

        <PageTabsContent value="teams" className="space-y-4">
          {categorySelector}
          {categoryGroups.some((group) =>
            group.teamIds.some((teamId) => !assignedTeamIds || assignedTeamIds.includes(teamId)),
          ) ? (
            <div className="space-y-4">
              {categoryGroups.map((group) => {
                const visibleTeamIds = group.teamIds.filter(
                  (teamId) => !assignedTeamIds || assignedTeamIds.includes(teamId),
                );
                if (!visibleTeamIds.length) return null;

                return (
                  <Section
                    key={group.name}
                    title={`${category.label} · ${group.name}`}
                    description={`${visibleTeamIds.length} team${visibleTeamIds.length === 1 ? "" : "s"}`}
                    flush
                  >
                    <ul className="divide-y">
                      {visibleTeamIds.map((teamId) => {
                        const team = getTeam(teamId);
                        if (!team) return null;
                        return (
                          <li key={team.id}>
                            <Link
                              to="/teams/$teamId"
                              params={{ teamId: team.id }}
                              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40"
                            >
                              <TeamCrest teamId={team.id} size="sm" />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold">
                                  {team.name}
                                </span>
                                <span className="block truncate text-small text-muted-foreground">
                                  {getOrganization(team.orgId)?.name}
                                </span>
                              </span>
                              <span className="hidden text-small text-muted-foreground sm:block">
                                {team.coach}
                              </span>
                              <StatusBadge status={team.status} />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Section>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Shield}
              title="No teams in this category"
              description="Teams appear here once registrations are published."
            />
          )}
        </PageTabsContent>

        <PageTabsContent value="schedule" className="space-y-4">
          {categorySelector}
          <CompetitionMatchGroups
            matches={schedule}
            emptyTitle="Schedule not published"
            emptyDescription="Upcoming fixtures for this category will appear here."
          />
        </PageTabsContent>

        <PageTabsContent value="matches" className="space-y-4">
          {categorySelector}
          <CompetitionMatchGroups
            matches={categoryMatches}
            emptyTitle="No matches in this category"
            emptyDescription="Fixtures and results will appear here when available."
          />
        </PageTabsContent>

        <PageTabsContent value="results" className="space-y-4">
          {categorySelector}
          <CompetitionMatchGroups
            matches={results}
            newestFirst
            emptyTitle="No results recorded"
            emptyDescription="Completed matches appear here once results are confirmed."
          />
        </PageTabsContent>

        <PageTabsContent value="standings" className="space-y-4">
          {categorySelector}
          {categoryGroups.some((group) => group.teamIds.length) ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {categoryGroups
                .filter((group) => group.teamIds.length)
                .map((group) => (
                  <Section
                    key={group.name}
                    title={`${category.label} · ${group.name}`}
                    description="Calculated from completed results"
                    flush
                  >
                    <StandingsTable
                      rows={computeStandings(group.teamIds, categoryMatches)}
                      qualify={0}
                    />
                  </Section>
                ))}
            </div>
          ) : (
            <EmptyState
              icon={Trophy}
              title="Standings unavailable"
              description="This category does not have published groups or standings yet."
            />
          )}
        </PageTabsContent>
      </PageTabs>
    </div>
  );
}
