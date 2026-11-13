import type { Match, Player, ScheduleItem, Team } from "@/data/types";
import { listSchedule, upcomingMatches } from "@/data/repository";
import { getCoachAssignedTeams, getCoachAssignedPlayers } from "@/lib/coach-access";

export interface CoachDashboardSnapshot {
  teams: Team[];
  players: Player[];
  upcomingTraining: ScheduleItem[];
  upcomingMatches: Match[];
}

export function getCoachDashboardSnapshot(coachName: string): CoachDashboardSnapshot {
  const teams = getCoachAssignedTeams(coachName);
  const teamIds = new Set(teams.map((team) => team.id));
  const upcomingTraining = listSchedule([...teamIds]).filter(
    (item) => item.type === "training" && item.teamId !== undefined && teamIds.has(item.teamId),
  );
  const matches = new Map(
    teams.flatMap((team) => upcomingMatches(team.id)).map((match) => [match.id, match]),
  );

  return {
    teams,
    players: getCoachAssignedPlayers(coachName),
    upcomingTraining,
    upcomingMatches: [...matches.values()],
  };
}
