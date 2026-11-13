/**
 * Fictional, pre-aggregated analytics for the Analytics preview.
 * These stand in for MetricSnapshot records; they never overwrite membership, attendance or match records.
 */
export type AnalyticsPeriod = "30d" | "season" | "last-season";

export interface OrgKpiSnapshot {
  members: number;
  membersHint: string;
  retention: number;
  retentionHint: string;
  attendance: number;
  attendanceHint: string;
  attendanceTrend: "up" | "down";
  reviewCoverage: number;
  reviewHint: string;
}

export const ORG_KPIS: Record<AnalyticsPeriod, OrgKpiSnapshot> = {
  "30d": {
    members: 148, membersHint: "+6 joined this month",
    retention: 84, retentionHint: "+3 pts vs 2025-26",
    attendance: 87, attendanceHint: "−2 pts vs previous 30 days", attendanceTrend: "down",
    reviewCoverage: 72, reviewHint: "Term reviews due 20 Dec 2026",
  },
  season: {
    members: 148, membersHint: "+27 since July 2026",
    retention: 84, retentionHint: "+3 pts vs 2025-26",
    attendance: 89, attendanceHint: "+1 pt vs 2025-26", attendanceTrend: "up",
    reviewCoverage: 72, reviewHint: "106 of 148 players reviewed",
  },
  "last-season": {
    members: 121, membersHint: "Season closed 30 Jun 2026",
    retention: 81, retentionHint: "2024-25 to 2025-26",
    attendance: 88, attendanceHint: "Season average", attendanceTrend: "up",
    reviewCoverage: 91, reviewHint: "110 of 121 players reviewed",
  },
};

/** Active members at the end of each month. */
export const MEMBER_TREND = [
  { month: "2025-12", members: 112, joined: 3 },
  { month: "2026-01", members: 116, joined: 6 },
  { month: "2026-02", members: 119, joined: 4 },
  { month: "2026-03", members: 121, joined: 3 },
  { month: "2026-04", members: 120, joined: 1 },
  { month: "2026-05", members: 122, joined: 3 },
  { month: "2026-06", members: 121, joined: 0 },
  { month: "2026-07", members: 127, joined: 9 },
  { month: "2026-08", members: 134, joined: 8 },
  { month: "2026-09", members: 139, joined: 6 },
  { month: "2026-10", members: 142, joined: 4 },
  { month: "2026-11", members: 148, joined: 6 },
];

/** Attendance by team: current period rate and the previous period for comparison. */
export const TEAM_ATTENDANCE: Record<AnalyticsPeriod, { teamId: string; players: number; sessions: number; rate: number; previous: number }[]> = {
  "30d": [
    { teamId: "garuda-u8", players: 32, sessions: 12, rate: 91, previous: 90 },
    { teamId: "garuda-putri-u9", players: 4, sessions: 8, rate: 95, previous: 92 },
    { teamId: "garuda-u10", players: 38, sessions: 12, rate: 93, previous: 92 },
    { teamId: "garuda-u12", players: 41, sessions: 13, rate: 78, previous: 86 },
    { teamId: "garuda-u14", players: 33, sessions: 12, rate: 84, previous: 85 },
  ],
  season: [
    { teamId: "garuda-u8", players: 32, sessions: 44, rate: 90, previous: 88 },
    { teamId: "garuda-putri-u9", players: 4, sessions: 30, rate: 93, previous: 90 },
    { teamId: "garuda-u10", players: 38, sessions: 45, rate: 92, previous: 90 },
    { teamId: "garuda-u12", players: 41, sessions: 46, rate: 85, previous: 86 },
    { teamId: "garuda-u14", players: 33, sessions: 44, rate: 87, previous: 86 },
  ],
  "last-season": [
    { teamId: "garuda-u8", players: 27, sessions: 92, rate: 88, previous: 85 },
    { teamId: "garuda-u10", players: 33, sessions: 94, rate: 90, previous: 89 },
    { teamId: "garuda-u12", players: 34, sessions: 95, rate: 86, previous: 87 },
    { teamId: "garuda-u14", players: 27, sessions: 90, rate: 86, previous: 84 },
  ],
};

/** 2025-26 members by age category and how many are still active in 2026-27. */
export const RETENTION_COHORTS = [
  { category: "U8", started: 27, active: 24, movedClub: 1 },
  { category: "U9 Putri", started: 4, active: 4, movedClub: 0 },
  { category: "U10", started: 33, active: 29, movedClub: 2 },
  { category: "U12", started: 34, active: 27, movedClub: 3 },
  { category: "U14", started: 23, active: 18, movedClub: 2 },
];

/** Category-to-category progression at the season change (July 2026). */
export const PATHWAY_STEPS = [
  { from: "U8", to: "U10", eligible: 19, progressed: 17 },
  { from: "U10", to: "U12", eligible: 22, progressed: 19 },
  { from: "U12", to: "U14", eligible: 18, progressed: 14 },
  { from: "U14", to: "U16 / academy", eligible: 11, progressed: 7 },
];

export const ATTENTION_ITEMS = [
  { id: "u12-attendance", tone: "pending" as const, label: "Attendance drop", title: "Garuda U12 attendance fell 8 pts in 30 days", detail: "13 sessions · 9 players below 70%", teamId: "garuda-u12" },
  { id: "reviews", tone: "pending" as const, label: "Reviews due", title: "42 players still need a term review", detail: "Due 20 Dec 2026 · mostly U12 and U14", teamId: "garuda-u14" },
  { id: "u14-retention", tone: "cancelled" as const, label: "Retention", title: "U14 retention is the lowest at 78%", detail: "5 of 23 players left; 2 moved to another club", teamId: "garuda-u14" },
];

export const SAVED_REPORTS = [
  { id: "season-health", name: "Season health summary", description: "Members, retention and attendance for the board", period: "season" as AnalyticsPeriod, lastRun: "2026-11-12" },
  { id: "monthly-attendance", name: "Monthly attendance review", description: "Attendance by team for coaches' meeting", period: "30d" as AnalyticsPeriod, lastRun: "2026-11-01" },
  { id: "association-return", name: "Association annual return", description: "Membership totals for Askot PSSI Makassar", period: "last-season" as AnalyticsPeriod, lastRun: "2026-07-05" },
];

/** Registered players per competition category (from team sheets). */
export const COMPETITION_PARTICIPATION: Record<string, { categoryId: string; players: number; girls: number }[]> = {
  "myc-2027": [
    { categoryId: "u8", players: 41, girls: 4 },
    { categoryId: "u10", players: 94, girls: 7 },
    { categoryId: "u12", players: 78, girls: 3 },
  ],
};
