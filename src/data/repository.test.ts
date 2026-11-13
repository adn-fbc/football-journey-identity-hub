import { describe, expect, it } from "vitest";
import {
  getPlayerByFootballId,
  getPlayerIdentity,
  getPlayerIdentityByFootballId,
  addPlayerAffiliation,
  assignPlayerToTeam,
  endPlayerAffiliation,
  getPrimaryPlayerContext,
  getMemberships,
  getPlayer,
  getJourney,
  listPlayerJourney,
  listPlayerAffiliations,
  listCurrentGuardianChildren,
  listGuardianChildren,
  removePlayerFromTeam,
  setPrimaryPlayerContext,
} from "@/data/repository";

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
    expect(listGuardianChildren("g-1").map((child) => child.id)).toEqual(["p-123", "p-125"]);
  });

  it("returns no children for an unknown guardian", () => {
    expect(listGuardianChildren("unknown")).toEqual([]);
  });

  it("resolves children for the current guardian without exposing fixture lookup to routes", () => {
    expect(listCurrentGuardianChildren().map((child) => child.id)).toEqual(["p-123", "p-125"]);
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
    }, { role: "player", playerId: "p-148" }).ok).toBe(true);
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
    expect(assignPlayerToTeam("p-148", "garuda-u10")).toBe(true);
    const assigned = listPlayerAffiliations("p-148").find(
      (affiliation) => affiliation.kind === "team" && affiliation.teamId === "garuda-u10",
    );
    expect(assigned).toEqual(expect.objectContaining({ status: "active", organizationAffiliationId: "p-148-org-garuda" }));
    expect(removePlayerFromTeam("p-148", "garuda-u10")).toBe(true);

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
    const selected = setPrimaryPlayerContext("p-125", {
      organizationAffiliationId: "p-125-org-garuda",
      teamAffiliationId: "p-125-team-garuda-putri-u9",
    }, { role: "player", playerId: "p-125" });

    expect(selected).toEqual({ ok: true, context: {
      playerId: "p-125",
      organizationAffiliationId: "p-125-org-garuda",
      teamAffiliationId: "p-125-team-garuda-putri-u9",
    } });
    expect(getPrimaryPlayerContext("p-125")).toEqual(selected.ok ? selected.context : undefined);
    expect(listPlayerAffiliations("p-125").filter((affiliation) => affiliation.status === "active")).toHaveLength(2);

    expect(setPrimaryPlayerContext("p-125", null, { role: "player", playerId: "p-125" }))
      .toEqual({ ok: true, context: undefined });
    expect(getPrimaryPlayerContext("p-125")).toBeUndefined();
  });

  it("rejects ended, mismatched, and unlinked affiliation contexts", () => {
    expect(setPrimaryPlayerContext("p-123", {
      organizationAffiliationId: "p-123-org-alpha",
    }, { role: "player", playerId: "p-123" })).toEqual({ ok: false, reason: "organization_affiliation_not_active" });

    expect(setPrimaryPlayerContext("p-123", {
      organizationAffiliationId: "p-123-org-garuda",
      teamAffiliationId: "p-125-team-garuda-putri-u9",
    }, { role: "player", playerId: "p-123" })).toEqual({ ok: false, reason: "team_affiliation_not_active" });

    expect(setPrimaryPlayerContext("p-148", {
      organizationAffiliationId: "p-148-org-garuda",
    }, { role: "parent", guardianId: "g-1" })).toEqual({ ok: false, reason: "forbidden" });
  });

  it("allows a linked guardian in the mock workspace and clears selection when the selected team ends", () => {
    expect(setPrimaryPlayerContext("p-125", {
      organizationAffiliationId: "p-125-org-garuda",
      teamAffiliationId: "p-125-team-garuda-putri-u9",
    }, { role: "parent", guardianId: "g-1" }).ok).toBe(true);

    expect(endPlayerAffiliation("p-125", "p-125-team-garuda-putri-u9", "2027-02-14").ok).toBe(true);
    expect(getPrimaryPlayerContext("p-125")).toBeUndefined();
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
    });
    expect(listPlayerJourney("p-123", { sourceDomain: "player_affiliation" })
      .map((event) => event.id)).toEqual(["j2", "j5", "j6"]);
  });

  it("does not synthesize identity or affiliation events from current profile fields", () => {
    expect(getJourney("p-146")).toEqual([]);
    expect(listPlayerJourney("unknown")).toEqual([]);
  });
});