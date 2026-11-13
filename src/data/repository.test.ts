import { describe, expect, it } from "vitest";
import {
  getPlayerByFootballId,
  getPlayerAccessForActor,
  getGuardianAccessDecision,
  getPlayerIdentity,
  getPlayerIdentityByFootballId,
  addPlayerAffiliation,
  assignPlayerToTeam,
  endPlayerAffiliation,
  getPrimaryPlayerContext,
  getMemberships,
  getPlayer,
  getWorkspaceActor,
  getJourney,
  listPlayerJourney,
  listPlayerAffiliations,
  listCurrentGuardianChildren,
  listGuardianChildren,
  removePlayerFromTeam,
  setPrimaryPlayerContext,
} from "@/data/repository";
import { players, teams } from "@/data/mock";

describe("global player identity repository", () => {
  it("resolves the same stable identity by player ID and Football ID", () => {
    expect(getPlayerIdentity("p-123")).toEqual({ id: "p-123", footballId: "IDN-FB-2016-000123" });
    expect(getPlayerIdentityByFootballId(" idn-fb-2016-000123 ")).toEqual({
      id: "p-123",
      footballId: "IDN-FB-2016-000123",
    });
  });

  it("does not resolve an unknown or duplicate Football ID to an arbitrary player", () => {
    expect(getPlayerIdentity("unknown")).toBeUndefined();
    expect(getPlayerIdentityByFootballId("unknown")).toBeUndefined();
    expect(getPlayerByFootballId(" ")).toBeUndefined();
  });
});

describe("guardian child repository", () => {
  it("returns only children linked to the requested guardian", () => {
    const children = listGuardianChildren("g-1");
    expect(children.map((child) => child.id)).toEqual(["p-123", "p-125"]);
    expect(children.find((child) => child.id === "p-123")).toMatchObject({
      stats: { matches: 0, goals: 0, assists: 0, minutes: 0 },
      attendance: 0,
      guardianIds: [],
    });
  });

  it("returns no children for an unknown guardian", () => {
    expect(listGuardianChildren("unknown")).toEqual([]);
  });

  it("resolves children for the current guardian without exposing fixture lookup to routes", () => {
    expect(listCurrentGuardianChildren().map((child) => child.id)).toEqual(["p-123", "p-125"]);
  });

  it("denies missing, expired, revoked, and relationship-only access", () => {
    expect(getPlayerAccessForActor("p-148", getWorkspaceActor("parent"))).toEqual({ ok: false, reason: "relationship_unverified" });
    expect(getPlayerAccessForActor("p-125", getWorkspaceActor("parent"))).toEqual({ ok: false, reason: "grant_expired" });
    expect(getGuardianAccessDecision("g-1", "p-125", "matches")).toEqual({ allowed: false, reason: "grant_revoked" });
    expect(getGuardianAccessDecision("g-1", "p-123", "sensitive_records")).toEqual({
      allowed: false,
      reason: "sensitive_records_excluded",
    });
  });

  it("fails closed when adult-transition status is missing or indicates adulthood", () => {
    const player = players.find((item) => item.id === "p-123");
    if (!player) throw new Error("Expected the p-123 fixture");
    const originalStatus = player.guardianAccessStatus;
    try {
      player.guardianAccessStatus = undefined;
      expect(getGuardianAccessDecision("g-1", "p-123", "journey")).toEqual({
        allowed: false,
        reason: "transition_status_unavailable",
      });
      player.guardianAccessStatus = "adult";
      expect(getGuardianAccessDecision("g-1", "p-123", "journey")).toEqual({
        allowed: false,
        reason: "adult_access_suspended",
      });
    } finally {
      player.guardianAccessStatus = originalStatus;
    }
  });

  it("keeps player and guardian projections distinct and denies unrelated direct profiles", () => {
    const playerView = getPlayerAccessForActor("p-123", getWorkspaceActor("player"));
    const guardianView = getPlayerAccessForActor("p-123", getWorkspaceActor("parent"));

    expect(playerView.ok && playerView.access.scope.kind).toBe("player");
    expect(guardianView.ok && guardianView.access.scope.kind).toBe("guardian");
    expect(playerView.ok && playerView.access.affiliations.some((item) => item.status === "ended")).toBe(true);
    expect(guardianView.ok && guardianView.access.affiliations.every((item) => item.status === "active")).toBe(true);
    expect(guardianView.ok && guardianView.access.permissions).toMatchObject({
      canViewPlayerStats: false,
      canViewSchedule: false,
      canViewAchievements: false,
      canViewMatches: true,
    });
    expect(guardianView.ok && guardianView.access.journey.map((event) => event.id)).toEqual([
      "j1", "j2", "j5", "j6", "j8",
    ]);
    expect(playerView.ok && playerView.access.journey.map((event) => event.id)).toContain("j7");
    expect(getPlayerAccessForActor("p-148", getWorkspaceActor("parent"))).toEqual({
      ok: false,
      reason: "relationship_unverified",
    });
    expect(getPlayerAccessForActor("p-123", {
      role: "parent",
      subjectId: "unrecognized-client-identity",
    })).toEqual({ ok: false, reason: "forbidden" });
  });

  it("requires an explicit primary-context grant for guardians", () => {
    expect(setPrimaryPlayerContext("p-125", null, getWorkspaceActor("parent"))).toEqual({
      ok: false,
      reason: "forbidden",
    });
    expect(setPrimaryPlayerContext("p-123", {
      organizationAffiliationId: "p-123-org-garuda",
    }, getWorkspaceActor("parent")).ok).toBe(true);
  });
});

describe("player affiliation repository", () => {
  it("returns organization and team affiliation history without collapsing the player identity", () => {
    const affiliations = listPlayerAffiliations("p-123");

    expect(affiliations).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "p-123-org-alpha", kind: "organization", status: "ended" }),
      expect.objectContaining({ id: "p-123-org-garuda", kind: "organization", status: "active" }),
      expect.objectContaining({ id: "p-123-team-garuda-u10", kind: "team", status: "active" }),
    ]));
    expect(getMemberships("p-123")).toEqual(expect.arrayContaining([
      expect.objectContaining({ orgId: "alpha", status: "completed", teams: ["Alpha U6", "Alpha U8", "Alpha U10"] }),
      expect.objectContaining({ orgId: "garuda", status: "active", teams: ["Garuda U10"] }),
    ]));
  });

  it("allows distinct active organization affiliations while rejecting a duplicate active target", () => {
    const input = {
      playerId: "p-148",
      organizationId: "phinisi",
      kind: "organization" as const,
      role: "Player",
      effectiveFrom: "2027-01-01",
    };
    const added = addPlayerAffiliation(input);

    expect(added.ok).toBe(true);
    expect(listPlayerAffiliations("p-148", { status: "active" })
      .filter((affiliation) => affiliation.kind === "organization"))
      .toHaveLength(2);
    expect(listPlayerJourney("p-148").at(-1)?.provenance).toEqual({
      sourceDomain: "player_affiliation",
      sourceRecordId: added.ok ? added.affiliation.id : "",
      sourceOrganizationId: "phinisi",
    });
    expect(addPlayerAffiliation(input)).toEqual({ ok: false, reason: "affiliation_overlap" });

    if (!added.ok) throw new Error("Expected the Phinisi affiliation to be added");
    expect(setPrimaryPlayerContext("p-148", {
      organizationAffiliationId: added.affiliation.id,
    }, getWorkspaceActor("player"))).toEqual({ ok: false, reason: "forbidden" });
    expect(endPlayerAffiliation("p-148", added.affiliation.id, "2027-02-14").ok).toBe(true);
    expect(getPrimaryPlayerContext("p-148")).toBeUndefined();
    expect(getPlayerIdentity("p-148")).toEqual({ id: "p-148", footballId: "IDN-FB-2016-000148" });
    expect(listPlayerAffiliations("p-148")).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: added.affiliation.id, status: "ended", effectiveTo: "2027-02-14" }),
    ]));
  });

  it("rejects invalid team scope and invalid effective dates", () => {
    expect(addPlayerAffiliation({
      playerId: "p-148",
      organizationId: "garuda",
      kind: "team",
      teamId: "phinisi-u10",
      organizationAffiliationId: "p-148-org-garuda",
      role: "Player",
      effectiveFrom: "2027-01-01",
    })).toEqual({ ok: false, reason: "team_organization_mismatch" });

    expect(addPlayerAffiliation({
      playerId: "p-148",
      organizationId: "phinisi",
      kind: "organization",
      role: "Player",
      effectiveFrom: "2027-02-30",
    })).toEqual({ ok: false, reason: "invalid_effective_date" });
  });

  it("ends an affiliation without deleting it or ending a separate organization relationship", () => {
    const ended = endPlayerAffiliation("p-123", "p-123-team-garuda-u10", "2027-02-14", "Team change");

    expect(ended.ok).toBe(true);
    expect(listPlayerAffiliations("p-123", { includeHistorical: false }))
      .not.toEqual(expect.arrayContaining([expect.objectContaining({ id: "p-123-team-garuda-u10" })]));
    expect(listPlayerAffiliations("p-123")).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "p-123-team-garuda-u10", status: "ended", effectiveTo: "2027-02-14" }),
      expect.objectContaining({ id: "p-123-org-garuda", status: "active" }),
    ]));
    expect(getPlayerIdentity("p-123")).toEqual({ id: "p-123", footballId: "IDN-FB-2016-000123" });
  });

  it("keeps history when existing roster operations assign and remove a team", () => {
    expect(assignPlayerToTeam("p-148", "garuda-u10", getWorkspaceActor("org_admin"))).toBe(true);
    const assigned = listPlayerAffiliations("p-148").find(
      (affiliation) => affiliation.kind === "team" && affiliation.teamId === "garuda-u10",
    );
    expect(assigned).toEqual(expect.objectContaining({ status: "active", organizationAffiliationId: "p-148-org-garuda" }));
    expect(removePlayerFromTeam("p-148", "garuda-u10", getWorkspaceActor("org_admin"))).toBe(true);

    expect(listPlayerAffiliations("p-148")).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: assigned?.id, status: "ended", effectiveTo: "2027-02-14" }),
    ]));
    expect(getPlayer("p-148")?.teamId).toBeUndefined();
    expect(getPlayerIdentity("p-148")).toEqual({ id: "p-148", footballId: "IDN-FB-2016-000148" });
    expect(getJourney("p-148").filter((event) => event.provenance?.sourceRecordId === assigned?.id))
      .toHaveLength(2);
  });
});

describe("primary player context repository", () => {
  it("sets and clears a player-selected context without changing affiliation state", () => {
    const selected = setPrimaryPlayerContext("p-123", {
      organizationAffiliationId: "p-123-org-garuda",
    }, getWorkspaceActor("player"));

    expect(selected).toEqual({ ok: true, context: {
      playerId: "p-123",
      organizationAffiliationId: "p-123-org-garuda",
    } });
    expect(getPrimaryPlayerContext("p-123")).toEqual(selected.ok ? selected.context : undefined);
    expect(listPlayerAffiliations("p-123").filter((affiliation) => affiliation.status === "active")).toHaveLength(1);

    expect(setPrimaryPlayerContext("p-123", null, getWorkspaceActor("player")))
      .toEqual({ ok: true, context: undefined });
    expect(getPrimaryPlayerContext("p-123")).toBeUndefined();
  });

  it("rejects ended, mismatched, and unlinked affiliation contexts", () => {
    expect(setPrimaryPlayerContext("p-123", {
      organizationAffiliationId: "p-123-org-alpha",
    }, getWorkspaceActor("player"))).toEqual({ ok: false, reason: "organization_affiliation_not_active" });

    expect(setPrimaryPlayerContext("p-123", {
      organizationAffiliationId: "p-123-org-garuda",
      teamAffiliationId: "p-125-team-garuda-putri-u9",
    }, getWorkspaceActor("player"))).toEqual({ ok: false, reason: "team_affiliation_not_active" });

    expect(setPrimaryPlayerContext("p-148", {
      organizationAffiliationId: "p-148-org-garuda",
    }, getWorkspaceActor("parent"))).toEqual({ ok: false, reason: "forbidden" });
  });

  it("allows a guardian with explicit primary-context authorization", () => {
    expect(setPrimaryPlayerContext("p-123", {
      organizationAffiliationId: "p-123-org-garuda",
    }, getWorkspaceActor("parent")).ok).toBe(true);
    expect(getPrimaryPlayerContext("p-123")).toEqual({
      playerId: "p-123",
      organizationAffiliationId: "p-123-org-garuda",
    });
  });
});

describe("player journey repository", () => {
  it("returns only stored journey records in stable chronological order", () => {
    const journey = listPlayerJourney("p-123");

    expect(journey.map((event) => event.id)).toEqual([
      "j1", "j2", "j3", "j4", "j5", "j6", "j7", "j8", "j9", "p-123-team-garuda-u10-ended",
    ]);
    expect(journey.find((event) => event.id === "j8")?.provenance).toEqual({
      sourceDomain: "team_affiliation",
      sourceRecordId: "p-123-team-garuda-u10",
      sourceOrganizationId: "garuda",
      sourceTeamId: "garuda-u10",
    });
    expect(listPlayerJourney("p-123", { sourceDomain: "player_affiliation" })
      .map((event) => event.id)).toEqual(["j2", "j5", "j6"]);
  });

  it("does not synthesize identity or affiliation events from current profile fields", () => {
    expect(getJourney("p-146")).toEqual([]);
    expect(listPlayerJourney("unknown")).toEqual([]);
  });

  it("limits coach journey events to the exact assigned team and rechecks assignment changes", () => {
    const currentCoach = getWorkspaceActor("coach");
    const team = teams.find((item) => item.id === "garuda-u8");
    if (!team) throw new Error("Expected the Garuda U8 fixture");
    const originalCoach = team.coach;

    const assignedAccess = getPlayerAccessForActor("p-142", currentCoach);
    expect(assignedAccess.ok).toBe(true);
    expect(assignedAccess.ok && assignedAccess.access.scope).toEqual({ kind: "team", teamId: "garuda-u8" });
    expect(assignedAccess.ok && assignedAccess.access.journey).toEqual([]);

    team.coach = "Coach Assignment Ended";
    try {
      expect(getPlayerAccessForActor("p-142", currentCoach)).toEqual({ ok: false, reason: "forbidden" });
    } finally {
      team.coach = originalCoach;
    }
  });
});

describe("roster mutation authorization", () => {
  it("denies unsupported actors and wrong organization or team scope without changing history", () => {
    const beforeAffiliations = listPlayerAffiliations("p-148");
    const beforeJourney = getJourney("p-148");
    const unauthorizedRoles = ["parent", "player", "scout", "coach", "association", "competition_organizer"] as const;

    for (const role of unauthorizedRoles) {
      expect(assignPlayerToTeam("p-148", "garuda-u10", getWorkspaceActor(role))).toBe(false);
      expect(removePlayerFromTeam("p-123", "garuda-u10", getWorkspaceActor(role))).toBe(false);
    }
    expect(assignPlayerToTeam("p-148", "phinisi-u10", getWorkspaceActor("org_admin"))).toBe(false);
    expect(assignPlayerToTeam("p-148", "garuda-u10", {
      ...getWorkspaceActor("org_admin"),
      organizationId: "phinisi",
    })).toBe(false);
    expect(removePlayerFromTeam("p-123", "garuda-u10", {
      ...getWorkspaceActor("org_admin"),
      organizationId: "phinisi",
    })).toBe(false);

    expect(listPlayerAffiliations("p-148")).toEqual(beforeAffiliations);
    expect(getJourney("p-148")).toEqual(beforeJourney);
  });

  it("denies organization admins access to a player scoped only to another organization", () => {
    expect(endPlayerAffiliation("p-148", "p-148-org-garuda", "2027-02-14").ok).toBe(true);
    const added = addPlayerAffiliation({
      playerId: "p-148",
      organizationId: "phinisi",
      kind: "organization",
      role: "Player",
      effectiveFrom: "2027-02-15",
    });
    expect(added.ok).toBe(true);
    expect(getPlayerAccessForActor("p-148", getWorkspaceActor("org_admin"))).toEqual({
      ok: false,
      reason: "forbidden",
    });
  });
});