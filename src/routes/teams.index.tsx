import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { FilterChips } from "@/components/ds/filter-bar";
import { StatusBadge } from "@/components/ds/status-badge";
import { TeamCrest } from "@/components/ds/team-crest";
import { listPlayers, listTeams } from "@/data/repository";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/teams/")({
  head: () => pageHead("Teams", "Squads, age categories, coaches and rosters for the 2026/27 season."),
  component: TeamsPage,
});

function TeamsPage() {
  const teams = listTeams("garuda");
  const [age, setAge] = useState("all");
  const ages = [...new Set(teams.map((t) => t.ageCategory))].sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  const shown = teams.filter((t) => age === "all" || t.ageCategory === age);
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SSB Garuda Makassar · 2026/27"
        title="Teams"
        actions={<Button onClick={() => toast("Create team (prototype)")}><Plus /> Create team</Button>}
      />
      <FilterChips value={age} onChange={setAge} options={[{ value: "all", label: "All" }, ...ages.map((a) => ({ value: a, label: a }))]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => {
          const roster = listPlayers({ teamId: t.id });
          const games = t.record.w + t.record.d + t.record.l;
          return (
            <Link key={t.id} to="/teams/$teamId" params={{ teamId: t.id }} className="surface group block p-5 transition-shadow hover:shadow-elevated">
              <div className="flex items-start justify-between">
                <TeamCrest teamId={t.id} size="lg" />
                <StatusBadge status={t.status} />
              </div>
              <h2 className="mt-4 text-h2 group-hover:text-primary">{t.name}</h2>
              <p className="text-small text-muted-foreground">{t.ageCategory} · {t.coach}</p>
              <div className="mt-4 flex items-center justify-between border-t pt-3 text-small">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="size-3.5" /><b className="text-foreground">{roster.length}</b> players</span>
                {games > 0 ? (
                  <span className="flex gap-1 font-semibold tabular-nums">
                    <span className="rounded bg-success/10 px-1.5 text-success">{t.record.w}W</span>
                    <span className="rounded bg-muted px-1.5 text-muted-foreground">{t.record.d}D</span>
                    <span className="rounded bg-destructive/10 px-1.5 text-destructive">{t.record.l}L</span>
                  </span>
                ) : <span className="text-muted-foreground">No matches yet</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
