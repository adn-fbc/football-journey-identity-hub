/** Read access for the Analytics preview. UI imports only from here. */
import { getCompetition, getOrganization, getTeam, listMatches } from "@/data/repository";
import {
  ATTENTION_ITEMS, COMPETITION_PARTICIPATION, MEMBER_TREND, ORG_KPIS, PATHWAY_STEPS, RETENTION_COHORTS, SAVED_REPORTS, TEAM_ATTENDANCE,
  type AnalyticsPeriod,
} from "./analytics-mock";

export type { AnalyticsPeriod } from "./analytics-mock";

export const ANALYTICS_AS_OF = "2026-11-13";

export function getOrgAnalyticsSource(orgId: string, period: AnalyticsPeriod) {
  return {
    organization: getOrganization(orgId),
    kpis: ORG_KPIS[period],
    trend: MEMBER_TREND,
    teamAttendance: TEAM_ATTENDANCE[period].map((row) => ({ ...row, teamName: getTeam(row.teamId)?.name ?? row.teamId })),
    cohorts: RETENTION_COHORTS,
    pathway: PATHWAY_STEPS,
    attention: ATTENTION_ITEMS,
  };
}

export function getCompetitionAnalyticsSource(competitionId: string) {
  return {
    competition: getCompetition(competitionId),
    matches: listMatches({ competitionId }),
    participation: COMPETITION_PARTICIPATION[competitionId] ?? [],
    teamName: (teamId: string) => getTeam(teamId)?.name ?? teamId,
  };
}

export const listSavedReports = () => SAVED_REPORTS.map((r) => ({ ...r }));
