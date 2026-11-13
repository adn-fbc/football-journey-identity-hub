import type { Competition, Match, Notification, Player, Team } from "@/data/types";
import {
  getCompetition,
  getCurrentUser,
  getMatch,
  getPlayer,
  getTeam,
  listPlayers,
  listCompetitions,
  listMatches,
  listNotifications,
  listTeams,
} from "@/data/repository";

function normalizedName(name: string) {
  return name
    .trim()
    .replace(/^coach\s+/i, "")
    .toLowerCase();
}

export function getCoachAssignedTeams(coachName = getCurrentUser().name): Team[] {
  const coachKey = normalizedName(coachName);
  return listTeams().filter((team) =>
    [team.coach, team.assistant].some(
      (assignment) => assignment !== undefined && normalizedName(assignment) === coachKey,
    ),
  );
}

export function getCoachAssignedPlayers(coachName = getCurrentUser().name): Player[] {
  const teamIds = new Set(getCoachAssignedTeams(coachName).map((team) => team.id));
  return listPlayers().filter(
    (player) => player.teamId !== undefined && teamIds.has(player.teamId),
  );
}

export function coachCanAccessPlayer(player: Player | string, coachName?: string) {
  const target = typeof player === "string" ? getPlayer(player) : player;
  if (!target?.teamId) return false;
  return getCoachAssignedTeams(coachName).some((team) => team.id === target.teamId);
}

export function coachCanAccessTeam(team: Team | string, coachName?: string) {
  const target = typeof team === "string" ? getTeam(team) : team;
  if (!target) return false;
  return getCoachAssignedTeams(coachName).some((assigned) => assigned.id === target.id);
}

export function coachCanAccessMatch(match: Match | string, coachName?: string) {
  const target = typeof match === "string" ? getMatch(match) : match;
  if (!target) return false;
  const assignedTeamIds = new Set(getCoachAssignedTeams(coachName).map((team) => team.id));
  return assignedTeamIds.has(target.homeId) || assignedTeamIds.has(target.awayId);
}

export function getCoachAccessibleMatches(coachName?: string): Match[] {
  const assignedTeamIds = new Set(getCoachAssignedTeams(coachName).map((team) => team.id));
  return listMatches().filter(
    (match) => assignedTeamIds.has(match.homeId) || assignedTeamIds.has(match.awayId),
  );
}

export function getCoachAccessibleCompetitions(coachName?: string): Competition[] {
  const assignedTeamIds = new Set(getCoachAssignedTeams(coachName).map((team) => team.id));
  return listCompetitions().filter((competition) =>
    competition.categories.some((category) =>
      category.teamIds.some((teamId) => assignedTeamIds.has(teamId)),
    ),
  );
}

export function coachCanAccessCompetition(competition: Competition | string, coachName?: string) {
  const target = typeof competition === "string" ? getCompetition(competition) : competition;
  if (!target) return false;
  const assignedTeamIds = new Set(getCoachAssignedTeams(coachName).map((team) => team.id));
  return target.categories.some((category) =>
    category.teamIds.some((teamId) => assignedTeamIds.has(teamId)),
  );
}

export function coachCanAccessNotification(notification: Notification, coachName?: string) {
  if (!notification.href) return false;
  const [entity, entityId] = notification.href.split("/").filter(Boolean);
  if (!entityId) return false;

  if (entity === "players") return coachCanAccessPlayer(entityId, coachName);
  if (entity === "teams") return coachCanAccessTeam(entityId, coachName);
  if (entity === "matches") return coachCanAccessMatch(entityId, coachName);
  if (entity === "competitions") return coachCanAccessCompetition(entityId, coachName);
  return false;
}

export function getCoachAccessibleNotifications(coachName?: string) {
  return listNotifications("coach").filter((notification) =>
    coachCanAccessNotification(notification, coachName),
  );
}
