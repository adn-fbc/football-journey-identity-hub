import { Link } from "@tanstack/react-router";
import { CircleDot, Goal, Shield, Swords, EyeOff } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { TeamCrest } from "@/components/ds/team-crest";
import { DataTable } from "@/components/ds/data-table";
import { Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { HIDDEN_LABEL, type CompetitionAnalytics } from "./analytics-model";

const resultsConfig = { count: { label: "Matches", color: "var(--chart-1)" } } satisfies ChartConfig;
const RESULT_COLORS = ["var(--chart-1)", "var(--chart-5)", "var(--chart-2)"];

export function CompetitionAnalyticsView({ data }: { data: CompetitionAnalytics }) {
  const { kpis } = data;
  return (
    <div className="space-y-6">
      <section aria-label="Key figures" className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard label="Teams" value={kpis.teams} hint={`${data.categories.length} categories`} icon={Shield} />
        <StatCard label="Matches played" value={`${kpis.played}/${kpis.total}`} hint="Cancelled fixtures excluded" icon={Swords} />
        <StatCard label="Goals per match" value={kpis.goalsPerMatch} hint="Completed matches" icon={Goal} />
        <StatCard label="Cards" value={kpis.cards} hint="Yellow and red, all categories" icon={CircleDot} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Participation by category" flush>
          <DataTable
            className="rounded-none border-0 shadow-none"
            rows={data.categories}
            getRowId={(r) => r.label}
            columns={[
              { key: "cat", header: "Category", cell: (r) => <span className="font-semibold">{r.label}</span> },
              { key: "teams", header: "Teams", className: "tabular-nums", cell: (r) => (r.hidden ? "—" : r.teams) },
              { key: "players", header: "Players", className: "tabular-nums", cell: (r) => (r.hidden ? <Hidden /> : r.players) },
              {
                key: "progress", header: "Played", hideBelow: "sm",
                cell: (r) => (r.hidden ? "—" : (
                  <div className="flex items-center gap-2">
                    <span className="text-small tabular-nums">{r.played}/{r.scheduled}</span>
                    <Progress value={r.progress} className="h-1.5 w-16" aria-label={`${r.label} matches played`} />
                  </div>
                )),
              },
            ]}
            mobileRow={(r) => (
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{r.label}</span>
                <span className="text-small text-muted-foreground">{r.hidden ? HIDDEN_LABEL : `${r.teams} teams · ${r.players} players · ${r.played}/${r.scheduled} played`}</span>
              </div>
            )}
          />
        </Section>

        <Section title="Results" description="How completed matches ended">
          <ChartContainer config={resultsConfig} className="aspect-auto h-52 w-full">
            <BarChart data={data.results} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
              <Bar dataKey="count" radius={6}>
                {data.results.map((r, i) => <Cell key={r.label} fill={RESULT_COLORS[i] ?? "var(--chart-1)"} />)}
              </Bar>
            </BarChart>
          </ChartContainer>
        </Section>
      </div>

      <Section title="Team goals" description="Completed matches only" flush>
        <DataTable
          className="rounded-none border-0 shadow-none"
          rows={data.teamGoals}
          getRowId={(r) => r.teamId}
          columns={[
            {
              key: "team", header: "Team",
              cell: (r) => (
                <Link to="/teams/$teamId" params={{ teamId: r.teamId }} className="flex items-center gap-2.5 font-semibold hover:text-primary">
                  <TeamCrest teamId={r.teamId} size="sm" /> {r.label}
                </Link>
              ),
            },
            { key: "played", header: "Played", className: "tabular-nums", cell: (r) => r.played },
            { key: "scored", header: "Scored", className: "tabular-nums", cell: (r) => r.scored },
            { key: "conceded", header: "Conceded", className: "tabular-nums", hideBelow: "sm", cell: (r) => r.conceded },
          ]}
          mobileRow={(r) => (
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5 text-sm font-semibold"><TeamCrest teamId={r.teamId} size="sm" /> {r.label}</span>
              <span className="text-small tabular-nums text-muted-foreground">{r.scored} scored · {r.conceded} conceded</span>
            </div>
          )}
        />
      </Section>
    </div>
  );
}

function Hidden() {
  return <span className="inline-flex items-center gap-1 text-small text-muted-foreground"><EyeOff className="size-3.5" /> Hidden</span>;
}
