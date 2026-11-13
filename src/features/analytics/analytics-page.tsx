import { useState } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { Download, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ds/page-header';
import { PrototypeNotice } from '@/components/ds/prototype-notice';
import { Section } from '@/components/ds/section';
import { StatCard } from '@/components/ds/stat-card';
import { DataTable } from '@/components/ds/data-table';
import { FilterSelect } from '@/components/ds/filter-bar';
import { PageTabs, PageTabsList, PageTabsTrigger, PageTabsContent } from '@/components/ds/page-tabs';
import { EmptyState, LoadingState, PermissionState } from '@/components/ds/states';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useRole } from '@/lib/role-context';
import { canViewAnalytics } from '@/lib/analytics-access';
import { listAnalyticsReports } from '@/data/analytics-repository';
import { computeOrgAnalytics, computeCompetitionAnalytics, toCsv, HIDDEN, type MetricRow, type Period } from './analytics-model';

const periods = [{ value: '30d', label: 'Last 30 days' }, { value: 'season', label: 'This season' }, { value: 'last-season', label: 'Last season' }];
function exportRows(rows: MetricRow[], name: string) {
  try {
    const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url; link.download = `${name}.csv`; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('CSV exported', { description: 'Same dashboard values; no contact details.' });
  } catch { toast.error('Export failed. Please try again.'); }
}
function AnalyticsChart({ rows, dataKey }: { rows: { label: string; [key: string]: string | number }[]; dataKey: string }) {
  return <ChartContainer className="h-64 w-full" config={{ [dataKey]: { label: dataKey === 'members' ? 'Members' : 'Matches', color: 'var(--primary)' } }}>
    <BarChart accessibilityLayer data={rows}><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={4} /></BarChart>
  </ChartContainer>;
}
export function AnalyticsPage() {
  const { role, ready } = useRole();
  const [period, setPeriod] = useState<Period>('30d');
  const organizer = role === 'competition_organizer';
  const allowed = canViewAnalytics(role, organizer ? { competitionId: 'myc-2027' } : { organizationId: 'garuda' });
  const org = ready && allowed && !organizer ? computeOrgAnalytics(period) : null;
  const competition = ready && allowed && organizer ? computeCompetitionAnalytics('myc-2027') : null;
  const rows = org?.rows ?? competition?.rows ?? [];
  return <div className="space-y-6">
    <PageHeader eyebrow="Preview · Analytics" title="Analytics" description={organizer ? 'Makassar Youth Cup 2027 · Participation and results' : 'SSB Garuda Makassar · Organization health'} actions={ready && allowed ? <>
      {!organizer && <FilterSelect placeholder="Reporting period" value={period} onChange={v => setPeriod(v as Period)} options={periods} />}
      <Button variant="outline" onClick={() => exportRows(rows, `analytics-${organizer ? 'myc-2027' : period}`)}><Download className="size-4" />Export CSV</Button>
    </> : undefined} />
    <PrototypeNotice moduleId="analytics" />
    {!ready ? <LoadingState /> : !allowed ? <PermissionState title="Analytics access restricted" description="Organization admins can view their own organization. Competition organizers can view competitions they manage." /> : <>
      <p className="text-small text-muted-foreground">Read-only derived insights · As of 13 November 2026 · Groups below five players are hidden. No cross-organization individual comparisons.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{rows.filter(r => r.section === 'Summary').map(r => <StatCard key={r.label} label={r.label} value={r.value} hint={r.label.includes('Retention') ? 'Fictional prior-season cohort · 2025–26' : r.label === 'Active members' ? 'Current roster; historical count for last season' : organizer ? 'Derived from competition records' : 'Only available source records; no estimated trends'} />)}</div>
      {org && <PageTabs defaultValue="overview"><PageTabsList>{['Overview', 'Retention', 'Pathways', 'Reports'].map(tab => <PageTabsTrigger key={tab} value={tab.toLowerCase()}>{tab}</PageTabsTrigger>)}</PageTabsList>
        <PageTabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2"><Section title="Members by join month" description="Current active roster with known join dates · July–November 2026. Not historical snapshots.">
            {period === 'last-season' ? <EmptyState title="Historical monthly records unavailable" description="A prior-season cohort is available in Retention." /> : <AnalyticsChart rows={org.trend.filter(r => r.members >= 5)} dataKey="members" />}
          </Section><Section title="Attention" description="Follow up using source records, not inferred individual rankings."><ul className="space-y-4 text-body">
            {org.attendanceRows.filter(r => !r.hidden && r.rate !== null && r.rate < 80).map(r => <li key={r.label}>{r.label}: {!r.hidden ? `${r.rate}% attendance · review participation barriers.` : HIDDEN}</li>)}
            <li>Development review coverage is unavailable until assessment records are linked.</li><li>Season attendance needs dated session records. Only the last 30 days is currently available.</li>
          </ul></Section></div>
          <Section title="Attendance by team" description="Active roster · last 30 days only" flush><DataTable rows={org.attendanceRows} getRowId={r => r.label} columns={[
            { key: 'team', header: 'Team', cell: r => r.label },
            { key: 'players', header: 'Players', cell: r => r.hidden ? HIDDEN : r.players },
            { key: 'rate', header: 'Attendance', cell: r => r.hidden ? HIDDEN : r.rate === null ? 'Not available for this period' : <div className="flex items-center gap-3"><span className="tabular-nums">{r.rate}%</span><Progress className="h-1.5 w-24" value={r.rate} aria-label={`${r.label} attendance`} /></div> },
          ]} mobileRow={r => <div className="space-y-1"><p className="font-medium">{r.label}</p><p className="text-small text-muted-foreground">{r.hidden ? HIDDEN : `${r.players} players · ${r.rate === null ? 'Period unavailable' : `${r.rate}% attendance`}`}</p></div>} /></Section>
        </PageTabsContent>
        <PageTabsContent value="retention"><Section title="Retention by age category" description="Fictional historical cohort: 2025–26 members retained into 2026–27. Same cohort across period filters." flush><DataTable rows={org.retentionRows} getRowId={r => r.label} columns={[
          { key: 'category', header: 'Category', cell: r => r.label }, { key: 'started', header: 'Started', cell: r => r.hidden ? HIDDEN : r.started }, { key: 'active', header: 'Still active', cell: r => r.hidden ? HIDDEN : r.active }, { key: 'retention', header: 'Retention', cell: r => r.hidden ? HIDDEN : `${r.rate}%` },
        ]} mobileRow={r => <div><p className="font-medium">{r.label}</p><p className="text-small text-muted-foreground">{r.hidden ? HIDDEN : `${r.active} of ${r.started} retained · ${r.rate}%`}</p></div>} /></Section></PageTabsContent>
        <PageTabsContent value="pathways"><Section title="Player pathways" description="Category sequence preview · player transition records are not yet linked."><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">{['U8', 'U10', 'U12', 'U14'].map((category, i) => <div key={category} className="flex items-center gap-4"><div className="rounded-lg border p-4"><p className="text-h3">{category}</p><p className="text-small text-muted-foreground">Count / % unavailable</p></div>{i < 3 && <ArrowRight className="size-4 text-muted-foreground" />}</div>)}</div><p className="mt-4 text-small text-muted-foreground">No transitions are inferred from current rosters. Counts and percentages will appear only for groups of at least five.</p></Section></PageTabsContent>
        <PageTabsContent value="reports"><Reports /></PageTabsContent>
      </PageTabs>}
      {competition && (competition.competition ? <div className="space-y-6"><Section title="Participation by category" description="Players linked to participating team rosters. Small player groups suppress the whole row." flush><DataTable rows={competition.participation} getRowId={r => r.label} columns={[
        { key: 'category', header: 'Category', cell: r => r.label }, { key: 'teams', header: 'Teams', cell: r => r.hidden ? HIDDEN : r.teams }, { key: 'players', header: 'Players', cell: r => r.hidden ? HIDDEN : r.players },
      ]} mobileRow={r => <div><p className="font-medium">{r.label}</p><p className="text-small text-muted-foreground">{r.hidden ? HIDDEN : `${r.teams} teams · ${r.players} players`}</p></div>} /></Section>
        <div className="grid gap-6 lg:grid-cols-2"><Section title="Results distribution" description="Completed matches only; missing scores are counted separately."><AnalyticsChart rows={competition.results} dataKey="count" /></Section><Section title="Top-scoring teams" description="Goals from completed matches with recorded scores." flush><DataTable rows={competition.topTeams} getRowId={r => r.label} columns={[{ key: 'team', header: 'Team', cell: r => r.label }, { key: 'goals', header: 'Goals', cell: r => r.goals }]} mobileRow={r => <div className="flex justify-between gap-4"><span>{r.label}</span><span className="tabular-nums">{r.goals} goals</span></div>} /></Section></div>
      </div> : <EmptyState title="Competition unavailable" description="No competition records are available in this workspace." />)}
    </>}
  </div>;
}
function Reports() {
  const [reports, setReports] = useState(listAnalyticsReports);
  return <Section title="Saved reports" description="Run a saved definition to refresh its timestamp; exports recompute the same dashboard rows.">
    {reports.length ? <ul className="divide-y">{reports.map(report => <li key={report.id} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"><div><p className="font-medium">{report.name}</p><p className="text-small text-muted-foreground">{periods.find(p => p.value === report.period)?.label} · Last run {report.lastRun}</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => { computeOrgAnalytics(report.period); setReports(old => old.map(r => r.id === report.id ? { ...r, lastRun: '2026-11-13' } : r)); toast.success('Report refreshed'); }}>Run</Button><Button variant="outline" onClick={() => exportRows(computeOrgAnalytics(report.period).rows, report.id)}>Export</Button></div></li>)}</ul> : <EmptyState title="No saved reports" description="Saved report definitions will appear here." />}
  </Section>;
}
