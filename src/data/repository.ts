/**
 * Data access layer. Pages import only from here, never from ./mock directly.
 * Swap these implementations for real API / database calls later without touching UI code.
 */
import {
  achievements, childPayments, childRegistrations, competitions, documents, journeys, matches, playerAffiliations,
  notifications, organizations, players, schedule, teams, guardians, guardianRelationships, guardianConsentGrants,
  CURRENT_USER, MOCK_TODAY,
} from "./mock";
import type {
  GuardianConsentGrant, GuardianDataCategory, JourneyEvent, Match, Membership, Player, PlayerAffiliation,
  JourneySourceDomain, PlayerIdentity, PrimaryPlayerContext,
} from "./types";
import type { RoleId } from "@/config/roles";
import { ageCategoryFor } from "@/lib/format";

const playerUpdates = new Map<string, Partial<Player>>();
const affiliationUpdates = new Map<string, PlayerAffiliation[]>();
const primaryContextPreferences = new Map<string, PrimaryPlayerContext>();
const journeyUpdates = new Map<string, JourneyEvent[]>();
let nextAffiliationId = 1;

export const getCurrentUser = () => CURRENT_USER;
export const getCurrentGuardianId = () => guardians.find((guardian) => guardian.footballId === CURRENT_USER.footballId)?.id;
export interface WorkspaceActor {
  subjectId: string;
  role: RoleId;
  organizationId?: string | undefined;
}

export const getWorkspaceActor = (role: RoleId): WorkspaceActor => ({
  subjectId: CURRENT_USER.footballId,
  role,
  organizationId: role === "org_admin" ? "garuda" : undefined,
});

export const getOrganization = (id?: string) => organizations.find((o) => o.id === id);
export const getTeam = (id?: string) => teams.find((t) => t.id === id);
export const getPlayer = (id?: string) => {
  const player = players.find((p) => p.id === id);
  return player ? { ...player, ...playerUpdates.get(player.id) } : undefined;
};
export const getPlayerIdentity = (playerId: string): PlayerIdentity | undefined => {
  const identityMatches = players.filter((player) => player.id === playerId);
  if (identityMatches.length !== 1) return undefined;
  const player = identityMatches[0]!;
  const normalizedFootballId = player.footballId.trim().toLowerCase();
  if (players.filter((item) => item.footballId.trim().toLowerCase() === normalizedFootballId).length !== 1) {
    return undefined;
  }
  return { id: player.id, footballId: player.footballId };
};
export const getPlayerByFootballId = (fid: string) => {
  const matches = players.filter((player) => player.footballId.toLowerCase() === fid.trim().toLowerCase());
  if (matches.length !== 1 || players.filter((player) => player.id === matches[0]!.id).length !== 1) {
    return undefined;
  }
  return getPlayer(matches[0]!.id);
};
export const getPlayerIdentityByFootballId = (fid: string): PlayerIdentity | undefined => {
  const player = getPlayerByFootballId(fid);
  return player ? { id: player.id, footballId: player.footballId } : undefined;
};
export const getCompetition = (id?: string) => competitions.find((c) => c.id === id);
export const getMatch = (id?: string) => matches.find((m) => m.id === id);

export const listOrganizations = () => organizations;
export const listTeams = (orgId?: string) => (orgId ? teams.filter((t) => t.orgId === orgId) : teams);
export const listPlayers = (filter?: { orgId?: string | undefined; teamId?: string | undefined }) =>
  players
    .map((p) => ({ ...p, ...playerUpdates.get(p.id) }))
    .filter((p) => (!filter?.orgId || p.orgId === filter.orgId) && (!filter?.teamId || p.teamId === filter.teamId));

function allPlayerAffiliations(playerId: string) {
  const updates = affiliationUpdates.get(playerId) ?? [];
  const updatedIds = new Set(updates.map((affiliation) => affiliation.id));
  return [
    ...playerAffiliations.filter((affiliation) => affiliation.playerId === playerId && !updatedIds.has(affiliation.id)),
    ...updates,
  ];
}

function appendAffiliationJourneyEvent(affiliation: PlayerAffiliation, action: "started" | "ended", date: string) {
  const team = affiliation.teamId ? getTeam(affiliation.teamId) : undefined;
  const organization = getOrganization(affiliation.organizationId);
  const title = action === "started"
    ? `Joined ${team?.name ?? organization?.name ?? "organization"}`
    : `Left ${team?.name ?? organization?.name ?? "organization"}`;
  const event: JourneyEvent = {
    id: `${affiliation.id}-${action}`,
    date,
    year: Number(date.slice(0, 4)),
    type: action === "ended" ? "leave" : affiliation.kind === "team" ? "team" : "join",
    title,
    detail: `${affiliation.kind === "team" ? "Team" : "Organization"} affiliation ${action}`,
    orgId: affiliation.organizationId,
    provenance: {
      sourceDomain: affiliation.kind === "team" ? "team_affiliation" : "player_affiliation",
      sourceRecordId: affiliation.id,
      sourceOrganizationId: affiliation.sourceOrganizationId,
      sourceTeamId: affiliation.teamId,
      recordedBy: affiliation.recordedBy,
    },
  };
  journeyUpdates.set(affiliation.playerId, [...(journeyUpdates.get(affiliation.playerId) ?? []), event]);
}

export function listPlayerAffiliations(
  playerId: string,
  options: { status?: PlayerAffiliation["status"] | undefined; includeHistorical?: boolean | undefined } = {},
) {
  if (!getPlayer(playerId)) return [];
  return allPlayerAffiliations(playerId)
    .filter((affiliation) => !options.status || affiliation.status === options.status)
    .filter((affiliation) => options.includeHistorical !== false || affiliation.status !== "ended")
    .map((affiliation) => ({ ...affiliation, legacyTeamNames: affiliation.legacyTeamNames ? [...affiliation.legacyTeamNames] : undefined }))
    .sort((a, b) => (a.effectiveFrom ?? "9999-12-31").localeCompare(b.effectiveFrom ?? "9999-12-31") || a.id.localeCompare(b.id));
}

export type AffiliationMutationResult =
  | { ok: true; affiliation: PlayerAffiliation }
  | { ok: false; reason: "player_not_found" | "organization_not_found" | "team_not_found" | "team_organization_mismatch" | "organization_affiliation_required" | "invalid_scope" | "invalid_effective_date" | "affiliation_overlap" | "affiliation_not_found" | "already_ended" | "active_team_affiliations" };

export type PrimaryContextActor = WorkspaceActor;

export type PrimaryContextResult =
  | { ok: true; context: PrimaryPlayerContext | undefined }
  | { ok: false; reason: "player_not_found" | "forbidden" | "organization_affiliation_not_active" | "team_affiliation_not_active" | "team_organization_mismatch" };

export function getPrimaryPlayerContext(playerId: string): PrimaryPlayerContext | undefined {
  const context = primaryContextPreferences.get(playerId);
  if (!context) return undefined;
  const affiliations = allPlayerAffiliations(playerId);
  const organizationAffiliation = affiliations.find((item) =>
    item.id === context.organizationAffiliationId && item.kind === "organization" && item.status === "active",
  );
  const teamAffiliation = context.teamAffiliationId
    ? affiliations.find((item) => item.id === context.teamAffiliationId && item.kind === "team" && item.status === "active")
    : undefined;
  if (!organizationAffiliation || (context.teamAffiliationId && !teamAffiliation)) {
    primaryContextPreferences.delete(playerId);
    return undefined;
  }
  if (teamAffiliation && teamAffiliation.organizationAffiliationId !== organizationAffiliation.id) {
    primaryContextPreferences.delete(playerId);
    return undefined;
  }
  return { ...context };
}

export function setPrimaryPlayerContext(
  playerId: string,
  context: Omit<PrimaryPlayerContext, "playerId"> | null,
  actor: PrimaryContextActor,
): PrimaryContextResult {
  if (!getPlayer(playerId)) return { ok: false, reason: "player_not_found" };
  if (!actor || actor.subjectId !== CURRENT_USER.footballId) return { ok: false, reason: "forbidden" };
  const authorized = actor.role === "player"
    ? playerId === "p-123"
    : actor.role === "parent" && getCurrentGuardianId() !== undefined &&
      getGuardianAccessDecision(getCurrentGuardianId()!, playerId, "primary_context").allowed;
  if (!authorized) return { ok: false, reason: "forbidden" };
  if (context === null) {
    primaryContextPreferences.delete(playerId);
    return { ok: true, context: undefined };
  }

  const affiliations = allPlayerAffiliations(playerId);
  const organizationAffiliation = affiliations.find((item) =>
    item.id === context.organizationAffiliationId && item.kind === "organization" && item.status === "active",
  );
  if (!organizationAffiliation) return { ok: false, reason: "organization_affiliation_not_active" };
  if (context.teamAffiliationId) {
    const teamAffiliation = affiliations.find((item) =>
      item.id === context.teamAffiliationId && item.kind === "team" && item.status === "active",
    );
    if (!teamAffiliation) return { ok: false, reason: "team_affiliation_not_active" };
    if (teamAffiliation.organizationAffiliationId !== organizationAffiliation.id) {
      return { ok: false, reason: "team_organization_mismatch" };
    }
  }
  const updated = { playerId, ...context };
  primaryContextPreferences.set(playerId, updated);
  return { ok: true, context: { ...updated } };
}

export interface NewPlayerAffiliation {
  playerId: string;
  organizationId: string;
  kind: PlayerAffiliation["kind"];
  teamId?: string | undefined;
  organizationAffiliationId?: string | undefined;
  role: string;
  status?: "active" | "pending" | undefined;
  effectiveFrom: string;
  recordedBy?: string | undefined;
}

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function affiliationTargetMatches(a: PlayerAffiliation, b: NewPlayerAffiliation) {
  return a.kind === b.kind && a.organizationId === b.organizationId && a.teamId === b.teamId;
}

export function addPlayerAffiliation(input: NewPlayerAffiliation): AffiliationMutationResult {
  if (!getPlayer(input.playerId)) return { ok: false, reason: "player_not_found" };
  if (!getOrganization(input.organizationId)) return { ok: false, reason: "organization_not_found" };
  if (!isCalendarDate(input.effectiveFrom)) return { ok: false, reason: "invalid_effective_date" };

  let organizationAffiliation: PlayerAffiliation | undefined;
  if (input.kind === "organization") {
    if (input.teamId || input.organizationAffiliationId) return { ok: false, reason: "invalid_scope" };
  } else {
    if (!input.teamId) return { ok: false, reason: "invalid_scope" };
    const team = getTeam(input.teamId);
    if (!team) return { ok: false, reason: "team_not_found" };
    if (team.orgId !== input.organizationId) return { ok: false, reason: "team_organization_mismatch" };
    organizationAffiliation = allPlayerAffiliations(input.playerId).find((affiliation) =>
      affiliation.id === input.organizationAffiliationId &&
      affiliation.kind === "organization" &&
      affiliation.organizationId === input.organizationId &&
      affiliation.status !== "ended",
    );
    if (!organizationAffiliation) return { ok: false, reason: "organization_affiliation_required" };
    if (organizationAffiliation.effectiveFrom && input.effectiveFrom < organizationAffiliation.effectiveFrom) {
      return { ok: false, reason: "invalid_effective_date" };
    }
  }

  const existing = allPlayerAffiliations(input.playerId).filter((affiliation) => affiliationTargetMatches(affiliation, input));
  if (existing.some((affiliation) => affiliation.status !== "ended")) {
    return { ok: false, reason: "affiliation_overlap" };
  }
  if (existing.some((affiliation) => !affiliation.effectiveTo || input.effectiveFrom <= affiliation.effectiveTo)) {
    return { ok: false, reason: "affiliation_overlap" };
  }

  const affiliation: PlayerAffiliation = {
    id: `player-affiliation-${nextAffiliationId++}`,
    playerId: input.playerId,
    organizationId: input.organizationId,
    kind: input.kind,
    teamId: input.teamId,
    organizationAffiliationId: input.kind === "team" ? organizationAffiliation?.id : undefined,
    role: input.role,
    status: input.status ?? "active",
    effectiveFrom: input.effectiveFrom,
    recordedBy: input.recordedBy,
    sourceOrganizationId: input.organizationId,
  };
  affiliationUpdates.set(input.playerId, [...(affiliationUpdates.get(input.playerId) ?? []), affiliation]);
  if (affiliation.status === "active") appendAffiliationJourneyEvent(affiliation, "started", input.effectiveFrom);
  return { ok: true, affiliation: { ...affiliation } };
}

export function endPlayerAffiliation(
  playerId: string,
  affiliationId: string,
  effectiveTo: string,
  endReason?: string,
): AffiliationMutationResult {
  if (!isCalendarDate(effectiveTo)) return { ok: false, reason: "invalid_effective_date" };
  const affiliation = allPlayerAffiliations(playerId).find((item) => item.id === affiliationId);
  if (!affiliation) return { ok: false, reason: "affiliation_not_found" };
  if (affiliation.status === "ended") return { ok: false, reason: "already_ended" };
  if (affiliation.effectiveFrom && effectiveTo < affiliation.effectiveFrom) {
    return { ok: false, reason: "invalid_effective_date" };
  }
  if (affiliation.kind === "organization" && allPlayerAffiliations(playerId).some((item) =>
    item.kind === "team" && item.organizationAffiliationId === affiliationId && item.status !== "ended",
  )) {
    return { ok: false, reason: "active_team_affiliations" };
  }

  const ended: PlayerAffiliation = { ...affiliation, status: "ended", effectiveTo, endReason };
  const updates = affiliationUpdates.get(playerId) ?? [];
  affiliationUpdates.set(playerId, [...updates.filter((item) => item.id !== affiliationId), ended]);
  if (affiliation.status === "active") appendAffiliationJourneyEvent(ended, "ended", effectiveTo);
  const primaryContext = primaryContextPreferences.get(playerId);
  if (primaryContext?.organizationAffiliationId === affiliationId || primaryContext?.teamAffiliationId === affiliationId) {
    primaryContextPreferences.delete(playerId);
  }
  const player = getPlayer(playerId);
  if (player && affiliation.kind === "team" && player.teamId === affiliation.teamId) {
    playerUpdates.set(playerId, { ...playerUpdates.get(playerId), teamId: undefined, jersey: undefined });
  }
  if (player && affiliation.kind === "organization" && player.orgId === affiliation.organizationId) {
    playerUpdates.set(playerId, { ...playerUpdates.get(playerId), orgId: undefined, teamId: undefined, jersey: undefined, membership: "completed" });
  }
  return { ok: true, affiliation: { ...ended } };
}

export type GuardianAccessDecision =
  | { allowed: true; grant: GuardianConsentGrant }
  | {
      allowed: false;
      reason:
        | "relationship_unverified"
        | "no_grant"
        | "grant_expired"
        | "grant_revoked"
        | "grant_suspended"
        | "invalid_grant"
        | "transition_status_unavailable"
        | "adult_access_suspended"
        | "sensitive_records_excluded";
    };

export function getGuardianAccessDecision(
  guardianId: string,
  playerId: string,
  category: GuardianDataCategory,
): GuardianAccessDecision {
  if (category === "sensitive_records") return { allowed: false, reason: "sensitive_records_excluded" };
  const guardian = guardians.find((item) => item.id === guardianId);
  const player = players.find((item) => item.id === playerId);
  const relationship = guardianRelationships.find((item) =>
    item.guardianId === guardianId && item.playerId === playerId && item.verificationStatus === "verified",
  );
  if (!guardian || !player || !relationship || !guardian.childIds.includes(playerId) || !player.guardianIds.includes(guardianId)) {
    return { allowed: false, reason: "relationship_unverified" };
  }

  const grants = guardianConsentGrants.filter((grant) =>
    grant.guardianId === guardianId && grant.subjectPlayerId === playerId && grant.categories.includes(category),
  );
  if (!grants.length) return { allowed: false, reason: "no_grant" };
  const validGrants = grants.filter((grant) =>
    grant.status === "active" && isCalendarDate(grant.effectiveFrom) &&
    (!grant.effectiveTo || isCalendarDate(grant.effectiveTo)) && grant.effectiveFrom <= MOCK_TODAY &&
    (!grant.effectiveTo || MOCK_TODAY <= grant.effectiveTo) &&
    grant.purpose.trim().length > 0 && grant.grantedBy.trim().length > 0,
  );
  if (!validGrants.length) {
    if (grants.some((grant) => grant.status === "revoked" || grant.revokedAt)) {
      return { allowed: false, reason: "grant_revoked" };
    }
    if (grants.some((grant) => grant.status === "suspended")) {
      return { allowed: false, reason: "grant_suspended" };
    }
    if (grants.some((grant) => grant.effectiveTo && isCalendarDate(grant.effectiveTo) && MOCK_TODAY > grant.effectiveTo)) {
      return { allowed: false, reason: "grant_expired" };
    }
    return { allowed: false, reason: "invalid_grant" };
  }
  if (player.guardianAccessStatus === "adult") return { allowed: false, reason: "adult_access_suspended" };
  if (player.guardianAccessStatus !== "minor_confirmed") {
    return { allowed: false, reason: "transition_status_unavailable" };
  }
  return { allowed: true, grant: validGrants[0]! };
}

export const listGuardianChildren = (guardianId: string) => {
  const guardian = guardians.find((item) => item.id === guardianId);
  if (!guardian) return [];
  return guardian.childIds
    .filter((playerId) =>
      getGuardianAccessDecision(guardian.id, playerId, "profile").allowed &&
      getGuardianAccessDecision(guardian.id, playerId, "affiliations").allowed,
    )
    .map((playerId) => getPlayer(playerId))
    .filter((player): player is Player => player !== undefined)
    .map((player) => ({
      ...player,
      stats: { matches: 0, goals: 0, assists: 0, minutes: 0 },
      attendance: 0,
      guardianIds: [],
    }));
};

export const listCurrentGuardianChildren = () => {
  const guardian = guardians.find((item) => item.footballId === CURRENT_USER.footballId);
  return guardian ? listGuardianChildren(guardian.id) : [];
};

export const assignPlayerToTeam = (playerId: string, teamId: string, actor: WorkspaceActor) => {
  const player = getPlayer(playerId);
  const team = getTeam(teamId);
  if (
    !actor || actor.subjectId !== CURRENT_USER.footballId || actor.role !== "org_admin" ||
    actor.organizationId !== "garuda" || !team || team.orgId !== actor.organizationId
  ) return false;
  if (!player || !team || player.orgId !== team.orgId || player.membership !== "active" || ageCategoryFor(player.birthYear) !== team.ageCategory) return false;
  if (player.teamId === teamId) return false;
  const organizationAffiliation = allPlayerAffiliations(playerId).find((affiliation) =>
    affiliation.kind === "organization" && affiliation.organizationId === team.orgId && affiliation.status === "active",
  );
  if (!organizationAffiliation) return false;
  const targetTeamAffiliations = allPlayerAffiliations(playerId).filter((affiliation) =>
    affiliation.kind === "team" && affiliation.teamId === teamId,
  );
  if (targetTeamAffiliations.some((affiliation) =>
    affiliation.status !== "ended" || !affiliation.effectiveTo || MOCK_TODAY <= affiliation.effectiveTo,
  )) return false;
  const currentTeamAffiliation = player.teamId
    ? allPlayerAffiliations(playerId).find((affiliation) =>
        affiliation.kind === "team" && affiliation.teamId === player.teamId && affiliation.status !== "ended",
      )
    : undefined;
  if (currentTeamAffiliation?.effectiveFrom && MOCK_TODAY < currentTeamAffiliation.effectiveFrom) return false;
  const takenNumbers = new Set(listPlayers({ teamId }).map((member) => member.jersey).filter((number): number is number => number !== undefined));
  let jersey = 1;
  while (takenNumbers.has(jersey) && jersey <= 99) jersey++;
  if (jersey > 99) return false;
  if (currentTeamAffiliation && !endPlayerAffiliation(playerId, currentTeamAffiliation.id, MOCK_TODAY, "Reassigned to another team").ok) return false;
  const addedAffiliation = addPlayerAffiliation({
    playerId,
    organizationId: team.orgId,
    kind: "team",
    teamId: team.id,
    organizationAffiliationId: organizationAffiliation.id,
    role: "Player",
    effectiveFrom: MOCK_TODAY,
    recordedBy: getCurrentUser().name,
  });
  if (!addedAffiliation.ok) return false;
  playerUpdates.set(playerId, { ...playerUpdates.get(playerId), teamId, jersey });
  return true;
};

export const removePlayerFromTeam = (playerId: string, teamId: string, actor: WorkspaceActor) => {
  const player = getPlayer(playerId);
  const team = getTeam(teamId);
  if (
    !actor || actor.subjectId !== CURRENT_USER.footballId || actor.role !== "org_admin" ||
    actor.organizationId !== "garuda" || !team || team.orgId !== actor.organizationId ||
    !player || player.orgId !== actor.organizationId || player.teamId !== teamId
  ) return false;
  const affiliation = allPlayerAffiliations(playerId).find((item) =>
    item.kind === "team" && item.teamId === teamId && item.status !== "ended",
  );
  return affiliation ? endPlayerAffiliation(playerId, affiliation.id, MOCK_TODAY, "Removed from team").ok : false;
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

export function listPlayerJourney(
  playerId: string,
  options: { from?: string | undefined; to?: string | undefined; sourceDomain?: JourneySourceDomain | undefined } = {},
): JourneyEvent[] {
  if (!getPlayer(playerId)) return [];
  return [...(journeys[playerId] ?? []), ...(journeyUpdates.get(playerId) ?? [])]
    .filter((event) =>
      isCalendarDate(event.date) &&
      event.id.trim().length > 0 &&
      event.title.trim().length > 0 &&
      (!event.provenance || event.provenance.sourceRecordId.trim().length > 0),
    )
    .filter((event) => !options.from || event.date >= options.from)
    .filter((event) => !options.to || event.date <= options.to)
    .filter((event) => !options.sourceDomain || event.provenance?.sourceDomain === options.sourceDomain)
    .map((event) => ({ ...event, provenance: event.provenance ? { ...event.provenance } : undefined }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}

export interface PlayerAccessProjection {
  player: Player;
  scope: { kind: "player" } | { kind: "guardian"; guardianId: string } |
    { kind: "organization"; organizationId: string } | { kind: "team"; teamId: string };
  affiliations: PlayerAffiliation[];
  journey: JourneyEvent[];
  permissions: {
    canViewDevelopment: boolean;
    canViewMatches: boolean;
    canViewPlayerStats: boolean;
    canViewSchedule: boolean;
    canViewAchievements: boolean;
    canViewDocuments: boolean;
  };
}

export type PlayerAccessResult =
  | { ok: true; access: PlayerAccessProjection }
  | { ok: false; reason: "player_not_found" | "forbidden" | "scope_unavailable" | Extract<GuardianAccessDecision, { allowed: false }>["reason"] };

function normalizedActorName(name: string) {
  return name.trim().replace(/^coach\s+/i, "").toLowerCase();
}

function assignedTeamIdsForCurrentCoach() {
  const coachName = normalizedActorName(CURRENT_USER.name);
  return new Set(teams.filter((team) =>
    [team.coach, team.assistant].some((name) => name && normalizedActorName(name) === coachName),
  ).map((team) => team.id));
}

function journeyForCoach(playerId: string, teamId: string) {
  const affiliations = allPlayerAffiliations(playerId);
  return listPlayerJourney(playerId).filter((event) => {
    const provenance = event.provenance;
    if (!provenance) return false;
    const sourceTeamId = provenance.sourceTeamId ?? affiliations.find((affiliation) =>
      affiliation.id === provenance.sourceRecordId && affiliation.kind === "team",
    )?.teamId;
    return sourceTeamId === teamId;
  });
}

function journeyForOrganization(playerId: string, organizationId: string) {
  return listPlayerJourney(playerId).filter((event) =>
    event.provenance?.sourceOrganizationId === organizationId ||
    (!event.provenance?.sourceOrganizationId && event.provenance?.sourceDomain === "player_identity"),
  );
}

function guardianJourneyCategory(event: JourneyEvent): GuardianDataCategory | undefined {
  switch (event.provenance?.sourceDomain) {
    case "player_identity": return "profile";
    case "player_affiliation":
    case "team_affiliation": return "affiliations";
    case "match": return "matches";
    case "competition": return "competitions";
    case "achievement": return "achievements";
    case "training_session": return "schedule";
    case "attendance_record": return "attendance";
    case "development_assessment": return "development_assessments";
    case "coach_observation": return "coach_observations";
    default:
      if (event.type === "identity" || event.type === "verification") return "profile";
      if (event.type === "join" || event.type === "leave" || event.type === "team") return "affiliations";
      if (event.type === "competition") return "competitions";
      if (event.type === "achievement") return "achievements";
      return undefined;
  }
}

export function getPlayerAccessForActor(playerId: string, actor: WorkspaceActor): PlayerAccessResult {
  const recordExists = players.some((player) => player.id === playerId);
  if (!recordExists) return { ok: false, reason: "player_not_found" };
  if (actor.subjectId !== CURRENT_USER.footballId) return { ok: false, reason: "forbidden" };

  let scope: PlayerAccessProjection["scope"];
  let affiliations: PlayerAffiliation[];
  let journey: JourneyEvent[];
  let permissions: PlayerAccessProjection["permissions"];

  if (actor.role === "player") {
    if (playerId !== "p-123") return { ok: false, reason: "forbidden" };
    scope = { kind: "player" };
    affiliations = listPlayerAffiliations(playerId);
    journey = listPlayerJourney(playerId);
    permissions = {
      canViewDevelopment: true,
      canViewMatches: true,
      canViewPlayerStats: true,
      canViewSchedule: true,
      canViewAchievements: true,
      canViewDocuments: true,
    };
  } else if (actor.role === "parent") {
    const guardianId = getCurrentGuardianId();
    if (!guardianId) return { ok: false, reason: "forbidden" };
    for (const category of ["profile", "journey", "affiliations"] as const) {
      const decision = getGuardianAccessDecision(guardianId, playerId, category);
      if (!decision.allowed) return { ok: false, reason: decision.reason };
    }
    scope = { kind: "guardian", guardianId };
    affiliations = listPlayerAffiliations(playerId).filter((affiliation) => affiliation.status === "active");
    journey = listPlayerJourney(playerId).filter((event) => {
      const category = guardianJourneyCategory(event);
      return category !== undefined && getGuardianAccessDecision(guardianId, playerId, category).allowed;
    });
    permissions = {
      canViewDevelopment: false,
      canViewMatches: getGuardianAccessDecision(guardianId, playerId, "matches").allowed,
      canViewPlayerStats: false,
      canViewSchedule: getGuardianAccessDecision(guardianId, playerId, "schedule").allowed,
      canViewAchievements: false,
      canViewDocuments: false,
    };
  } else if (actor.role === "coach") {
    const player = getPlayer(playerId);
    const assignedTeamIds = assignedTeamIdsForCurrentCoach();
    const activeTeamAffiliation = allPlayerAffiliations(playerId).find((affiliation) =>
      affiliation.kind === "team" && affiliation.status === "active" &&
      Boolean(player?.teamId && affiliation.teamId === player.teamId && assignedTeamIds.has(player.teamId)),
    );
    if (!activeTeamAffiliation?.teamId) return { ok: false, reason: "forbidden" };
    scope = { kind: "team", teamId: activeTeamAffiliation.teamId };
    affiliations = listPlayerAffiliations(playerId).filter((affiliation) =>
      affiliation.kind === "team" && affiliation.status === "active" && affiliation.teamId === activeTeamAffiliation.teamId,
    );
    journey = journeyForCoach(playerId, activeTeamAffiliation.teamId);
    permissions = {
      canViewDevelopment: true,
      canViewMatches: true,
      canViewPlayerStats: true,
      canViewSchedule: true,
      canViewAchievements: false,
      canViewDocuments: false,
    };
  } else if (actor.role === "org_admin") {
    const organizationId = actor.organizationId;
    if (organizationId !== "garuda") return { ok: false, reason: "scope_unavailable" };
    const activeOrganizationAffiliation = allPlayerAffiliations(playerId).find((affiliation) =>
      affiliation.kind === "organization" && affiliation.organizationId === organizationId && affiliation.status !== "ended",
    );
    if (!activeOrganizationAffiliation) return { ok: false, reason: "forbidden" };
    scope = { kind: "organization", organizationId };
    affiliations = listPlayerAffiliations(playerId).filter((affiliation) =>
      affiliation.organizationId === organizationId && affiliation.status !== "ended",
    );
    journey = journeyForOrganization(playerId, organizationId);
    permissions = {
      canViewDevelopment: false,
      canViewMatches: false,
      canViewPlayerStats: false,
      canViewSchedule: false,
      canViewAchievements: false,
      canViewDocuments: false,
    };
  } else {
    return { ok: false, reason: "forbidden" };
  }

  const player = getPlayer(playerId);
  if (!player) return { ok: false, reason: "scope_unavailable" };
  return { ok: true, access: { player, scope, affiliations, journey, permissions } };
}

export const getJourney = (playerId: string): JourneyEvent[] => listPlayerJourney(playerId);
export const getMemberships = (playerId: string) => {
  const affiliations = listPlayerAffiliations(playerId);
  const teamAffiliations = affiliations.filter((affiliation) => affiliation.kind === "team");
  return affiliations
    .filter((affiliation) => affiliation.kind === "organization")
    .map((organizationAffiliation): Membership => ({
      orgId: organizationAffiliation.organizationId,
      role: organizationAffiliation.role,
      from: organizationAffiliation.effectiveFrom,
      to: organizationAffiliation.effectiveTo,
      status: organizationAffiliation.status === "ended" ? "completed" : organizationAffiliation.status,
      teams: [
        ...(organizationAffiliation.legacyTeamNames ?? []),
        ...teamAffiliations
          .filter((teamAffiliation) => teamAffiliation.organizationAffiliationId === organizationAffiliation.id)
          .map((teamAffiliation) => getTeam(teamAffiliation.teamId)?.name)
          .filter((name): name is string => name !== undefined),
      ],
    }));
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
