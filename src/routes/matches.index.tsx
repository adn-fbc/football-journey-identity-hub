import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/ds/page-header";
import { FilterBar, FilterChips, FilterSelect, SearchInput } from "@/components/ds/filter-bar";
import { Section } from "@/components/ds/section";
import { MatchRow } from "@/components/ds/match-card";
import { EmptyState } from "@/components/ds/states";
import { getCompetition, getTeam, listCompetitions, listMatches } from "@/data/repository";
import { fmtDay } from "@/lib/format";
import { pageHead } from "@/lib/seo";
import { getCoachAccessibleCompetitions, getCoachAccessibleMatches } from "@/lib/coach-access";
import { useRole } from "@/lib/role-context";

export const Route = createFileRoute("/matches/")({
  head: () => pageHead("Matches", "Live scores, upcoming fixtures and results across youth competitions."),
  component: MatchesPage,
});

type F = "all" | "live" | "upcoming" | "results";

function MatchesPage() {
  const { role } = useRole();
  const [f, setF] = useState<F>("all");
  const [competitionId, setCompetitionId] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");
  const all = role === "coach" ? getCoachAccessibleMatches() : listMatches();
  const competitions =
    role === "coach" ? getCoachAccessibleCompetitions() : listCompetitions();
  const selectedCompetition = competitionId === "all" ? undefined : getCompetition(competitionId);
  const categories = selectedCompetition
    ? selectedCompetition.categories
    : [...new Map(competitions.flatMap((competition) => competition.categories.map((category) => [category.id, category] as const))).values()];
  const rows = all.filter((m) =>
    (f === "all" || (f === "live" ? m.status === "live" : f === "upcoming" ? m.status === "scheduled" : m.status === "completed")) &&
    (competitionId === "all" || m.competitionId === competitionId) &&
    (categoryId === "all" || m.categoryId === categoryId) &&
    (!query || `${getTeam(m.homeId)?.name ?? ""} ${getTeam(m.awayId)?.name ?? ""} ${getCompetition(m.competitionId)?.name ?? ""} ${m.round} ${m.venue}`.toLowerCase().includes(query.toLowerCase())),
  );
  const groups = Object.entries(rows.reduce<Record<string, typeof rows>>((acc, m) => ((acc[m.date] ??= []).push(m), acc), {}));
  if (f === "results") {
    groups.reverse();
    groups.forEach(([, matches]) => matches.reverse());
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title="Matches"
        description={
          role === "coach"
            ? "Fixtures and results involving your assigned teams."
            : "Fixtures and results from every competition your teams play in."
        }
      />
      <FilterChips value={f} onChange={setF} options={[
        { value: "all", label: "All" },
        { value: "live", label: "Live", count: all.filter((m) => m.status === "live").length },
        { value: "upcoming", label: "Upcoming", count: all.filter((m) => m.status === "scheduled").length },
        { value: "results", label: "Results", count: all.filter((m) => m.status === "completed").length },
      ]} />
      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search teams, competition or venue" className="sm:w-80" />
        <FilterSelect value={competitionId} onChange={(value) => { setCompetitionId(value); setCategoryId("all"); }} placeholder="Competition" options={[{ value: "all", label: "All competitions" }, ...competitions.map((c) => ({ value: c.id, label: c.name }))]} className="sm:w-56" />
        <FilterSelect value={categoryId} onChange={setCategoryId} placeholder="Category" options={[{ value: "all", label: "All categories" }, ...categories.map((category) => ({ value: category.id, label: category.label }))]} />
      </FilterBar>
      {groups.length ? groups.map(([date, ms]) => (
        <Section key={date} title={fmtDay(date)} flush>
          <div className="divide-y">{ms.map((m) => <MatchRow key={m.id} match={m} />)}</div>
        </Section>
      )) : <EmptyState title="No matches" description="Nothing in this view right now." />}
    </div>
  );
}
