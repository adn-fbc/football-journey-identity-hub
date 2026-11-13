/**
 * Pure analytics calculations. Everything here is derived from source records and is read-only.
 */
import { getCompetitionAnalyticsSource, getOrgAnalyticsSource, type AnalyticsPeriod } from "@/data/analytics-repository";

/** Groups smaller than this are never shown individually. */
export const MIN_GROUP_SIZE = 5;
export const HIDDEN_LABEL = "Hidden · fewer than 5 players";

export type Suppressed<T> = (T & { hidden: false }) | { label: string; hidden: true };

export const percent = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

/** Replaces any group below the minimum size with a label-only row, dropping all its numbers. */
export function suppressSmallGroups<T extends { label: string; players: number }>(rows: T[], min = MIN_GROUP_SIZE): Suppressed<T>[] {
  return rows.map((row) => (row.players < min ? { label: row.label, hidden: true as const } : { ...row, hidden: false as const }));
}

export function computeOrgAnalytics(orgId: string, period: AnalyticsPeriod) {
  const src = getOrgAnalyticsSource(orgId, period);

  const teams = suppressSmallGroups(
    src.teamAttendance.map((t) => ({ label: t.teamName, teamId: t.teamId, players: t.players, sessions: t.sessions, rate: t.rate, change: t.rate - t.previous })),
  );

  const retention = suppressSmallGroups(
    src.cohorts.map((c) => ({ label: c.category, players: c.started, started: c.started, active: c.active, left: c.started - c.active, movedClub: c.movedClub, rate: percent(c.active, c.started) })),
  );

  const visibleCohorts = src.cohorts.filter((c) => c.started >= MIN_GROUP_SIZE);
  const pathway = src.pathway.map((s) => ({ ...s, rate: percent(s.progressed, s.eligible) }));
  const trend = src.trend.map((p) => ({ ...p, label: p.month }));

  return {
    organization: src.organization,
    kpis: src.kpis,
    teams,
    retention,
    retentionTotal: percent(
      visibleCohorts.reduce((n, c) => n + c.active, 0),
      visibleCohorts.reduce((n, c) => n + c.started, 0),
    ),
    pathway,
    trend,
    attention: src.attention,
  };
}

export type OrgAnalytics = ReturnType<typeof computeOrgAnalytics>;

export function computeCompetitionAnalytics(competitionId: string) {
  const src = getCompetitionAnalyticsSource(competitionId);
  const completed = src.matches.filter((m) => m.status === "completed" && m.score);
  const goals = completed.reduce((n, m) => n + m.score!.home + m.score!.away, 0);
  const cards = completed.reduce((n, m) => n + m.events.filter((e) => e.type === "yellow" || e.type === "red").length, 0);

  const results = [
    { label: "Home win", count: completed.filter((m) => m.score!.home > m.score!.away).length },
    { label: "Draw", count: completed.filter((m) => m.score!.home === m.score!.away).length },
    { label: "Away win", count: completed.filter((m) => m.score!.home < m.score!.away).length },
  ];

  const categories = (src.competition?.categories ?? []).map((cat) => {
    const matches = src.matches.filter((m) => m.categoryId === cat.id);
    const played = matches.filter((m) => m.status === "completed").length;
    const players = src.participation.find((p) => p.categoryId === cat.id)?.players ?? 0;
    return { label: cat.label, categoryId: cat.id, teams: cat.teamIds.length, players, played, scheduled: matches.length, progress: percent(played, matches.length) };
  });

  const teamIds = new Set((src.competition?.categories ?? []).flatMap((c) => c.teamIds));
  const teamGoals = [...teamIds]
    .map((teamId) => {
      const own = completed.filter((m) => m.homeId === teamId || m.awayId === teamId);
      const scored = own.reduce((n, m) => n + (m.homeId === teamId ? m.score!.home : m.score!.away), 0);
      const conceded = own.reduce((n, m) => n + (m.homeId === teamId ? m.score!.away : m.score!.home), 0);
      return { teamId, label: src.teamName(teamId), played: own.length, scored, conceded };
    })
    .filter((t) => t.played > 0)
    .sort((a, b) => b.scored - a.scored || a.conceded - b.conceded);

  return {
    competition: src.competition,
    kpis: {
      teams: teamIds.size,
      played: completed.length,
      total: src.matches.filter((m) => m.status !== "cancelled").length,
      goalsPerMatch: completed.length ? Math.round((goals / completed.length) * 10) / 10 : 0,
      cards,
    },
    results,
    categories: suppressSmallGroups(categories),
    teamGoals,
  };
}

export type CompetitionAnalytics = ReturnType<typeof computeCompetitionAnalytics>;

/** Flat export rows: the same numbers the screen shows, never names or contact details of individuals. */
export interface ExportRow { section: string; metric: string; value: string | number }

export function orgExportRows(a: OrgAnalytics): ExportRow[] {
  return [
    { section: "Summary", metric: "Active members", value: a.kpis.members },
    { section: "Summary", metric: "Retention (%)", value: a.kpis.retention },
    { section: "Summary", metric: "Attendance (%)", value: a.kpis.attendance },
    { section: "Summary", metric: "Review coverage (%)", value: a.kpis.reviewCoverage },
    ...a.teams.map((t) => ({ section: "Attendance by team", metric: t.label, value: t.hidden ? HIDDEN_LABEL : t.rate })),
    ...a.retention.map((r) => ({ section: "Retention by category", metric: r.label, value: r.hidden ? HIDDEN_LABEL : r.rate })),
  ];
}

export function competitionExportRows(a: CompetitionAnalytics): ExportRow[] {
  return [
    { section: "Summary", metric: "Teams", value: a.kpis.teams },
    { section: "Summary", metric: "Matches played", value: a.kpis.played },
    { section: "Summary", metric: "Goals per match", value: a.kpis.goalsPerMatch },
    { section: "Summary", metric: "Cards", value: a.kpis.cards },
    ...a.results.map((r) => ({ section: "Results", metric: r.label, value: r.count })),
    ...a.categories.map((c) => ({ section: "Participation", metric: c.label, value: c.hidden ? HIDDEN_LABEL : c.players })),
  ];
}

export function toCsv(rows: readonly ExportRow[]) {
  const cell = (v: string | number) => `"${String(v).replace(/^[=+@-]/, "'$&").replaceAll('"', '""')}"`;
  return ["section,metric,value", ...rows.map((r) => [r.section, r.metric, r.value].map(cell).join(","))].join("\r\n");
}
