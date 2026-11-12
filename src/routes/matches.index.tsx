import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/ds/page-header";
import { FilterChips } from "@/components/ds/filter-bar";
import { Section } from "@/components/ds/section";
import { MatchRow } from "@/components/ds/match-card";
import { EmptyState } from "@/components/ds/states";
import { listMatches } from "@/data/repository";
import { fmtDay } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/matches/")({
  head: () => pageHead("Matches", "Live scores, upcoming fixtures and results across youth competitions."),
  component: MatchesPage,
});

type F = "all" | "live" | "upcoming" | "results";

function MatchesPage() {
  const [f, setF] = useState<F>("all");
  const all = listMatches();
  const rows = all.filter((m) =>
    f === "all" ? true : f === "live" ? m.status === "live" : f === "upcoming" ? m.status === "scheduled" : m.status === "completed" || m.status === "cancelled");
  const groups = Object.entries(rows.reduce<Record<string, typeof rows>>((acc, m) => ((acc[m.date] ??= []).push(m), acc), {}));
  if (f === "results") groups.reverse();
  return (
    <div className="space-y-6">
      <PageHeader title="Matches" description="Fixtures and results from every competition your teams play in." />
      <FilterChips value={f} onChange={setF} options={[
        { value: "all", label: "All" },
        { value: "live", label: "Live", count: all.filter((m) => m.status === "live").length },
        { value: "upcoming", label: "Upcoming" },
        { value: "results", label: "Results" },
      ]} />
      {groups.length ? groups.map(([date, ms]) => (
        <Section key={date} title={fmtDay(date)} flush>
          <div className="divide-y">{ms.map((m) => <MatchRow key={m.id} match={m} />)}</div>
        </Section>
      )) : <EmptyState title="No matches" description="Nothing in this view right now." />}
    </div>
  );
}
