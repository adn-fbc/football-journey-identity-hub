import { getCompetitionAnalyticsRecords, getOrgAnalyticsRecords } from '@/data/analytics-repository';
export type Period = '30d' | 'season' | 'last-season';
export type MetricRow = { section: string; label: string; value: string | number };
export const HIDDEN = 'Hidden · fewer than 5 players';
export function percentage(value: number, total: number) { return total ? Math.round(value / total * 1000) / 10 : 0; }
// Hidden rows intentionally discard all source fields, including denominators.
export function suppressSmallGroups<T extends { label: string; players: number }>(rows: T[], min = 5) {
  return rows.map(row => row.players < min ? { label: row.label, hidden: true as const } : { ...row, hidden: false as const });
}
export function computeOrgAnalytics(period: Period) {
  const { players, teams, cohorts } = getOrgAnalyticsRecords();
  const active = players.filter(p => p.membership === 'active');
  const historical = period === 'last-season';
  const members = historical ? cohorts.reduce((n, c) => n + c.started, 0) : active.length;
  const retention = percentage(cohorts.reduce((n, c) => n + c.active, 0), cohorts.reduce((n, c) => n + c.started, 0));
  const attendance = period === '30d' && active.length >= 5 ? Math.round(active.reduce((n, p) => n + p.attendance, 0) / active.length) : null;
  const attendanceRows = suppressSmallGroups(teams.map(team => {
    const roster = active.filter(p => p.teamId === team.id);
    return { label: team.name, players: roster.length, rate: period === '30d' && roster.length ? Math.round(roster.reduce((n, p) => n + p.attendance, 0) / roster.length) : null };
  }));
  const retentionRows = suppressSmallGroups(cohorts.map(c => ({ ...c, rate: percentage(c.active, c.started) })));
  // Membership trend is derived from join dates, not fabricated monthly snapshots.
  const trend = ['2026-07', '2026-08', '2026-09', '2026-10', '2026-11'].map(month => ({ label: month, members: active.filter(p => p.memberSince && p.memberSince.slice(0, 7) <= month).length }));
  const rows: MetricRow[] = [
    { section: 'Summary', label: 'Active members', value: members >= 5 ? members : HIDDEN },
    { section: 'Summary', label: 'Retention (%) · historical cohort', value: retention },
    { section: 'Summary', label: 'Attendance (%)', value: attendance ?? 'Not available for this period' },
    { section: 'Summary', label: 'Development review coverage', value: 'No linked review records' },
    ...attendanceRows.map(r => ({ section: 'Attendance', label: r.label, value: r.hidden ? HIDDEN : r.rate ?? 'Not available for this period' })),
    ...retentionRows.flatMap(r => r.hidden ? [{ section: 'Retention', label: r.label, value: HIDDEN }] : [
      { section: 'Retention', label: `${r.label} started`, value: r.started },
      { section: 'Retention', label: `${r.label} still active`, value: r.active },
      { section: 'Retention', label: `${r.label} retention (%)`, value: r.rate },
    ]),
  ];
  return { members, retention, attendance, attendanceRows, retentionRows, trend, rows };
}
export function computeCompetitionAnalytics(id: string) {
  const { competition, matches, teams, players } = getCompetitionAnalyticsRecords(id);
  const completed = matches.filter(m => m.status === 'completed');
  const scored = completed.filter(m => m.score);
  const results = [
    { label: 'Home win', count: scored.filter(m => m.score!.home > m.score!.away).length },
    { label: 'Draw', count: scored.filter(m => m.score!.home === m.score!.away).length },
    { label: 'Away win', count: scored.filter(m => m.score!.home < m.score!.away).length },
    { label: 'Score unavailable', count: completed.length - scored.length },
  ];
  const teamIds = new Set(competition?.categories.flatMap(c => c.teamIds) ?? []);
  const goals = scored.reduce((n, m) => n + m.score!.home + m.score!.away, 0);
  const cards = completed.reduce((n, m) => n + m.events.filter(e => e.type === 'yellow' || e.type === 'red').length, 0);
  const participation = suppressSmallGroups((competition?.categories ?? []).map(c => ({ label: c.label, teams: c.teamIds.length, players: players.filter(p => p.teamId && c.teamIds.includes(p.teamId)).length })));
  const topTeams = [...teamIds].map(teamId => ({ label: teams.find(t => t.id === teamId)?.name ?? teamId, goals: scored.reduce((n, m) => n + (m.homeId === teamId ? m.score!.home : m.awayId === teamId ? m.score!.away : 0), 0) })).sort((a, b) => b.goals - a.goals);
  const goalsPerMatch = scored.length ? Math.round(goals / scored.length * 10) / 10 : 0;
  const rows: MetricRow[] = [
    { section: 'Summary', label: 'Teams', value: teamIds.size }, { section: 'Summary', label: 'Matches played', value: completed.length },
    { section: 'Summary', label: 'Goals per scored match', value: goalsPerMatch }, { section: 'Summary', label: 'Fair-play cards', value: cards },
    ...results.map(r => ({ section: 'Results', label: r.label, value: r.count })),
    ...participation.flatMap(r => r.hidden ? [{ section: 'Participation', label: r.label, value: HIDDEN }] : [{ section: 'Participation', label: `${r.label} players`, value: r.players }, { section: 'Participation', label: `${r.label} teams`, value: r.teams }]),
    ...topTeams.map(r => ({ section: 'Team goals', label: r.label, value: r.goals })),
  ];
  return { competition, rows, results, participation, topTeams };
}
export function toCsv(rows: readonly MetricRow[]) {
  const escape = (value: string | number) => `"${String(value).replace(/^[=+@-]/, "'$&").replaceAll('"', '""')}"`;
  return ['section,label,value', ...rows.map(r => [r.section, r.label, r.value].map(escape).join(','))].join('\r\n');
}
