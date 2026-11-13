import { historicalCohorts, savedReports } from './analytics-mock';
import { getCompetition, listMatches, listPlayers, listTeams } from '@/data/repository';
export function getOrgAnalyticsRecords() {
  return { players: listPlayers({ orgId: 'garuda' }), teams: listTeams('garuda'), cohorts: historicalCohorts.map(row => ({ ...row })) };
}
export function getCompetitionAnalyticsRecords(id: string) {
  return { competition: getCompetition(id), matches: listMatches({ competitionId: id }), teams: listTeams(), players: listPlayers() };
}
export const listAnalyticsReports = () => savedReports.map(row => ({ ...row }));
