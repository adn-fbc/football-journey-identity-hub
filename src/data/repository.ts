/**
 * Data access layer. Pages import only from here, never from ./mock directly.
 * Swap these implementations for real API / database calls later without touching UI code.
 */
import {
  achievements, childPayments, childRegistrations, competitions, documents, journeys, matches, memberships,
  notifications, organizations, players, schedule, teams, guardians, CURRENT_USER, MOCK_TODAY,
} from "./mock";
import type { JourneyEvent, Match, Player } from "./types";
import { ageCategoryFor } from "@/lib/format";

const playerUpdates = new Map<string, Partial<Player>>();

export const getCurrentUser = () => CURRENT_USER;
export const getOrganization = (id?: string) => organizations.find((o) => o.id === id);
export const getTeam = (id?: string) => teams.find((t) => t.id === id);
export const getPlayer = (id?: string) => {
  const player = players.find((p) => p.id === id);
  return player ? { ...player, ...playerUpdates.get(player.id) } : undefined;
};
export const getPlayerByFootballId = (fid: string) =>
  players.find((p) => p.footballId.toLowerCase() === fid.trim().toLowerCase());
export const getCompetition = (id?: string) => competitions.find((c) => c.id === id);
export const getMatch = (id?: string) => matches.find((m) => m.id === id);

export const listOrganizations = () => organizations;
export const listTeams = (orgId?: string) => (orgId ? teams.filter((t) => t.orgId === orgId) : teams);
export const listPlayers = (filter?: { orgId?: string | undefined; teamId?: string | undefined }) =>
  players
    .map((p) => ({ ...p, ...playerUpdates.get(p.id) }))
    .filter((p) => (!filter?.orgId || p.orgId === filter.orgId) && (!filter?.teamId || p.teamId === filter.teamId));

export const listGuardianChildren = (guardianId: string) => {
  const guardian = guardians.find((item) => item.id === guardianId);
  if (!guardian) return [];
  const childIds = new Set(guardian.childIds);
  return listPlayers().filter((player) => childIds.has(player.id) && player.guardianIds.includes(guardian.id));
};

export const listCurrentGuardianChildren = () => {
  const guardian = guardians.find((item) => item.footballId === CURRENT_USER.footballId);
  return guardian ? listGuardianChildren(guardian.id) : [];
};

export const assignPlayerToTeam = (playerId: string, teamId: string) => {
  const player = getPlayer(playerId);
  const team = getTeam(teamId);
  if (!player || !team || player.orgId !== team.orgId || player.membership !== "active" || ageCategoryFor(player.birthYear) !== team.ageCategory) return false;
  const takenNumbers = new Set(listPlayers({ teamId }).map((member) => member.jersey).filter((number): number is number => number !== undefined));
  let jersey = 1;
  while (takenNumbers.has(jersey) && jersey <= 99) jersey++;
  if (jersey > 99) return false;
  playerUpdates.set(playerId, { ...playerUpdates.get(playerId), teamId, jersey });
  return true;
};

export const removePlayerFromTeam = (playerId: string, teamId: string) => {
  const player = getPlayer(playerId);
  if (!player || player.teamId !== teamId) return false;
  playerUpdates.set(playerId, { ...playerUpdates.get(playerId), teamId: undefined });
  return true;
};
export const listCompetitions = () => competitions;
export const listMatches = (filter?: { competitionId?: string | undefined; teamId?: string | undefined; categoryId?: string | undefined }) =>
  matches
    .filter((m) =>
      (!filter?.competitionId || m.competitionId === filter.competitionId) &&
      (!filter?.categoryId || m.categoryId === filter.categoryId) &&
      (!filter?.teamId || m.homeId === filter.teamId || m.awayId === filter.teamId))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

export const upcomingMatches = (teamId?: string) =>
  listMatches({ teamId }).filter((m) => m.status === "scheduled" || m.status === "live");
export const recentMatches = (teamId?: string) =>
  listMatches({ teamId }).filter((m) => m.status === "completed").reverse();

export const listSchedule = (teamIds?: string[]) =>
  schedule
    .filter((s) => s.date >= MOCK_TODAY && (!teamIds || !s.teamId || teamIds.includes(s.teamId)))
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));

export const listTodaySchedule = (teamIds?: string[]) =>
  listSchedule(teamIds).filter((item) => item.date === MOCK_TODAY);

export const listNotifications = (role: string) => notifications.filter((n) => n.roles.includes(role));

export const getJourney = (playerId: string): JourneyEvent[] => {
  if (journeys[playerId]) return journeys[playerId];
  const p = getPlayer(playerId);
  if (!p) return [];
  const created = `${Math.max(p.birthYear + 6, 2020)}-02-01`;
  const events: JourneyEvent[] = [
    { id: `${p.id}-id`, date: created, year: Number(created.slice(0, 4)), type: "identity", title: "Football ID created", detail: "Registered by guardian", verifiedBy: p.verification === "verified" ? "Football ID Registry" : undefined },
  ];
  if (p.memberSince && p.orgId) {
    const org = getOrganization(p.orgId);
    events.push({ id: `${p.id}-join`, date: p.memberSince, year: Number(p.memberSince.slice(0, 4)), type: "join", title: `Joined ${org?.name}`, detail: getTeam(p.teamId)?.name ?? "", orgId: p.orgId, verifiedBy: org?.name });
  }
  return events;
};
export const getMemberships = (playerId: string) => {
  const explicit = memberships[playerId];
  if (explicit) return explicit;
  const p = getPlayer(playerId);
  return p?.orgId
    ? [{ orgId: p.orgId, role: "Player", from: p.memberSince ?? MOCK_TODAY, status: p.membership, teams: [getTeam(p.teamId)?.name ?? ""] }]
    : [];
};
export const getAchievements = (playerId: string) => achievements[playerId] ?? [];
export const getDocuments = (playerId: string) => documents[playerId] ?? [];
export const listChildRegistrations = (childId?: string) =>
  childRegistrations
    .filter((registration) => !childId || registration.childId === childId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
export const listChildPayments = (childId?: string) =>
  childPayments
    .filter((payment) => !childId || payment.childId === childId)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

export interface StandingRow {
  teamId: string; p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number;
}

/** Computes group standings from completed matches. */
export function computeStandings(teamIds: string[], source: Match[]): StandingRow[] {
  const rows = new Map<string, StandingRow>(
    teamIds.map((id) => [id, { teamId: id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }]),
  );
  for (const m of source) {
    if (m.status !== "completed" || !m.score) continue;
    const h = rows.get(m.homeId);
    const a = rows.get(m.awayId);
    if (!h || !a) continue;
    h.p++; a.p++;
    h.gf += m.score.home; h.ga += m.score.away;
    a.gf += m.score.away; a.ga += m.score.home;
    if (m.score.home > m.score.away) { h.w++; a.l++; h.pts += 3; }
    else if (m.score.home < m.score.away) { a.w++; h.l++; a.pts += 3; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  }
  return [...rows.values()].sort((x, y) => y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf);
}
