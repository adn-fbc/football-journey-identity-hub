import type { Competition, Organization, Player, ScheduleItem, Team } from "@/data/types";
import { listCompetitions, listPlayers, listSchedule, listTeams } from "@/data/repository";

export interface OrganizationStaffMember {
  id: string;
  name: string;
  roles: string[];
  teams: string[];
}

export interface OrganizationAttentionItem {
  id: string;
  player: Player;
  reason: "Membership request" | "Football ID verification";
}

export interface OrganizationWorkspaceSnapshot {
  teams: Team[];
  players: Player[];
  attention: OrganizationAttentionItem[];
  schedule: ScheduleItem[];
  trainings: ScheduleItem[];
  competitions: Competition[];
  attendance: Player[];
  staff: OrganizationStaffMember[];
}

export function getOrganizationWorkspaceSnapshot(
  organization: Organization,
): OrganizationWorkspaceSnapshot {
  const teams = listTeams(organization.id);
  const teamIds = new Set(teams.map((team) => team.id));
  const players = listPlayers({ orgId: organization.id });
  const attention = players.flatMap((player) => {
    if (player.membership === "pending") {
      return [{ id: player.id, player, reason: "Membership request" as const }];
    }
    if (player.verification === "pending") {
      return [{ id: player.id, player, reason: "Football ID verification" as const }];
    }
    return [];
  });
  const schedule = listSchedule([...teamIds]).filter(
    (item) => item.teamId !== undefined && teamIds.has(item.teamId),
  );
  const competitions = listCompetitions().filter(
    (competition) =>
      competition.organizer.toLowerCase() === organization.name.toLowerCase() ||
      competition.categories.some((category) => category.teamIds.some((id) => teamIds.has(id))),
  );
  const staffByName = new Map<string, OrganizationStaffMember>();

  const addStaffAssignment = (name: string, role: string, teamName: string) => {
    const member = staffByName.get(name) ?? { id: name, name, roles: [], teams: [] };
    if (!member.roles.includes(role)) member.roles.push(role);
    if (!member.teams.includes(teamName)) member.teams.push(teamName);
    staffByName.set(name, member);
  };

  for (const team of teams) {
    addStaffAssignment(team.coach, "Head coach", team.name);
    if (team.assistant) addStaffAssignment(team.assistant, "Assistant coach", team.name);
  }

  return {
    teams,
    players,
    attention,
    schedule,
    trainings: schedule.filter((item) => item.type === "training"),
    competitions,
    attendance: players
      .filter((player) => player.membership === "active")
      .sort((a, b) => a.attendance - b.attendance),
    staff: [...staffByName.values()].sort((a, b) => a.name.localeCompare(b.name)),
  };
}
