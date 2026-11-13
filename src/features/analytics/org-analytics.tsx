import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, ArrowUpRight, ClipboardCheck, EyeOff, FileBarChart, Play, Repeat2, Users } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { DataTable } from "@/components/ds/data-table";
import { PageTabs, PageTabsContent, PageTabsList, PageTabsTrigger } from "@/components/ds/page-tabs";
import { Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { StatusBadge } from "@/components/ds/status-badge";
import { EmptyState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { listSavedReports, type AnalyticsPeriod } from "@/data/analytics-repository";
import { fmtDate, fmtMonthYear } from "@/lib/format";
import { cn } from "@/lib/utils";
import { HIDDEN_LABEL, computeOrgAnalytics, orgExportRows, type OrgAnalytics } from "./analytics-model";
import { downloadCsv } from "./export-csv";

const trendConfig = { members: { label: "Active members", color: "var(--chart-1)" } } satisfies ChartConfig;

export function OrgAnalytics({ data }: { data: OrgAnalytics }) {
  const { kpis } = data;
  return (
    <div className="space-y-6">
      <section aria-label="Key figures" className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard label="Active members" value={kpis.members} hint={kpis.membersHint} trend="up" icon={Users} />
        <StatCard label="Retention" value={`${kpis.retention}%`} hint={kpis.retentionHint} trend="up" icon={Repeat2} />
        <StatCard label="Attendance" value={`${kpis.attendance}%`} hint={kpis.attendanceHint} trend={kpis.attendanceTrend} icon={ClipboardCheck} />
        <StatCard label="Review coverage" value={`${kpis.reviewCoverage}%`} hint={kpis.reviewHint} icon={FileBarChart} />
      </section>

      <PageTabs defaultValue="overview">
        <PageTabsList>
          <PageTabsTrigger value="overview">Overview</PageTabsTrigger>
          <PageTabsTrigger value="retention">Retention</PageTabsTrigger>
          <PageTabsTrigger value="pathways">Pathways</PageTabsTrigger>
          <PageTabsTrigger value="reports">Reports</PageTabsTrigger>
        </PageTabsList>

        <PageTabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Section title="Membership" description="Active members at the end of each month">
              <ChartContainer config={trendConfig} className="aspect-auto h-60 w-full">
                <AreaChart data={data.trend} margin={{ left: -16, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickFormatter={(v: string) => fmtMonthYear(`${v}-01`).slice(0, 3)} />
                  <YAxis tickLine={false} axisLine={false} domain={["dataMin - 10", "dataMax + 5"]} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => fmtMonthYear(`${String(v)}-01`)} />} />
                  <Area dataKey="members" type="monotone" stroke="var(--color-members)" fill="var(--color-members)" fillOpacity={0.12} strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </Section>

            <Section title="Needs attention" description="Worth a look this week" flush>
              <ul className="divide-y">
                {data.attention.map((item) => (
                  <li key={item.id} className="space-y-1.5 px-5 py-4">
                    <StatusBadge status={item.tone} label={item.label} />
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-small text-muted-foreground">{item.detail}</p>
                    <Link to="/teams/$teamId" params={{ teamId: item.teamId }} className="inline-flex items-center gap-1 text-small font-semibold text-primary hover:underline">
                      Open team <ArrowRight className="size-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <Section title="Attendance by team" description="Share of rostered players present per session" flush>
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={data.teams}
              getRowId={(r) => r.label}
              columns={[
                { key: "team", header: "Team", cell: (r) => <span className="font-semibold">{r.label}</span> },
                { key: "players", header: "Players", className: "tabular-nums", hideBelow: "sm", cell: (r) => (r.hidden ? "—" : r.players) },
                { key: "sessions", header: "Sessions", className: "tabular-nums", hideBelow: "lg", cell: (r) => (r.hidden ? "—" : r.sessions) },
                { key: "rate", header: "Attendance", cell: (r) => (r.hidden ? <HiddenCell /> : <RateBar rate={r.rate} label={r.label} />) },
                { key: "change", header: "Change", cell: (r) => (r.hidden ? "—" : <Change value={r.change} />) },
              ]}
              mobileRow={(r) => (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{r.label}</p>
                    <p className="text-small text-muted-foreground">{r.hidden ? HIDDEN_LABEL : `${r.players} players · ${r.sessions} sessions`}</p>
                  </div>
                  {!r.hidden && (
                    <div className="text-right">
                      <div className="font-display text-lg font-semibold tabular-nums">{r.rate}%</div>
                      <Change value={r.change} />
                    </div>
                  )}
                </div>
              )}
            />
          </Section>
        </PageTabsContent>

        <PageTabsContent value="retention" className="space-y-6">
          <div className="surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-label text-muted-foreground">2025-26 members still active in 2026-27</div>
              <div className="mt-1 font-display text-3xl font-semibold tabular-nums">{data.retentionTotal}%</div>
            </div>
            <p className="max-w-md text-small text-muted-foreground">
              Players who moved to another club keep their Football ID and journey. They count as left here, never as lost.
            </p>
          </div>
          <Section title="Retention by age category" flush>
            <DataTable
              className="rounded-none border-0 shadow-none"
              rows={data.retention}
              getRowId={(r) => r.label}
              columns={[
                { key: "cat", header: "Category", cell: (r) => <span className="font-semibold">{r.label}</span> },
                { key: "started", header: "Started", className: "tabular-nums", hideBelow: "sm", cell: (r) => (r.hidden ? "—" : r.started) },
                { key: "active", header: "Still active", className: "tabular-nums", cell: (r) => (r.hidden ? "—" : r.active) },
                { key: "moved", header: "Moved club", className: "tabular-nums", hideBelow: "md", cell: (r) => (r.hidden ? "—" : r.movedClub) },
                { key: "rate", header: "Retention", cell: (r) => (r.hidden ? <HiddenCell /> : <RateBar rate={r.rate} label={r.label} />) },
              ]}
              mobileRow={(r) => (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{r.label}</p>
                    <p className="text-small text-muted-foreground">{r.hidden ? HIDDEN_LABEL : `${r.active} of ${r.started} still active`}</p>
                  </div>
                  {!r.hidden && <span className="font-display text-lg font-semibold tabular-nums">{r.rate}%</span>}
                </div>
              )}
            />
          </Section>
        </PageTabsContent>

        <PageTabsContent value="pathways" className="space-y-6">
          <Section title="Player pathway" description="Players who moved up an age category at the July 2026 season change">
            <ol className="grid gap-3 md:grid-cols-4">
              {data.pathway.map((step) => (
                <li key={step.from} className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {step.from} <ArrowRight className="size-3.5 text-muted-foreground" /> {step.to}
                  </div>
                  <div className="mt-3 font-display text-3xl font-semibold tabular-nums">{step.rate}%</div>
                  <p className="text-small text-muted-foreground">{step.progressed} of {step.eligible} players continued</p>
                  <Progress value={step.rate} className="mt-3 h-1.5" aria-label={`${step.from} to ${step.to} progression`} />
                </li>
              ))}
            </ol>
            <p className="mt-4 text-small text-muted-foreground">
              Based on team assignments on each player's Football Journey. Players are never ranked individually.
            </p>
          </Section>
        </PageTabsContent>

        <PageTabsContent value="reports">
          <SavedReports />
        </PageTabsContent>
      </PageTabs>
    </div>
  );
}

function SavedReports() {
  const [reports, setReports] = useState(listSavedReports);
  const run = (id: string) => {
    setReports((all) => all.map((r) => (r.id === id ? { ...r, lastRun: "2026-11-13" } : r)));
    toast.success("Report refreshed");
  };
  const exportReport = (id: string, period: AnalyticsPeriod) => downloadCsv(orgExportRows(computeOrgAnalytics("garuda", period)), id);

  if (!reports.length) return <EmptyState icon={FileBarChart} title="No saved reports" description="Save a filtered view to run it again later." />;
  return (
    <Section title="Saved reports" description="Run again to refresh, or export the same numbers as CSV" flush>
      <ul className="divide-y">
        {reports.map((r) => (
          <li key={r.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-small text-muted-foreground">{r.description} · Last run {fmtDate(r.lastRun)}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" variant="outline" onClick={() => run(r.id)}><Play /> Run</Button>
              <Button size="sm" variant="ghost" onClick={() => exportReport(r.id, r.period)}>Export</Button>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function RateBar({ rate, label }: { rate: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 text-sm font-semibold tabular-nums">{rate}%</span>
      <Progress value={rate} className="h-1.5 w-24" aria-label={`${label}: ${rate}%`} />
    </div>
  );
}

function Change({ value }: { value: number }) {
  if (value === 0) return <span className="text-small text-muted-foreground">No change</span>;
  const up = value > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-small font-semibold tabular-nums", up ? "text-success" : "text-destructive")}>
      <Icon className="size-3.5" /> {up ? "+" : "−"}{Math.abs(value)} pts
    </span>
  );
}

function HiddenCell() {
  return (
    <span className="inline-flex items-center gap-1.5 text-small text-muted-foreground">
      <EyeOff className="size-3.5" /> {HIDDEN_LABEL}
    </span>
  );
}
