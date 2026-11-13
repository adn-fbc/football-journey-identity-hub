import { describe, expect, it } from "vitest";
import { modulesForRole } from "@/config/modules";
import {
  coachCanAccessCompetition,
  coachCanAccessMatch,
  coachCanAccessNotification,
  coachCanAccessPlayer,
  coachCanAccessTeam,
  getCoachAccessibleCompetitions,
  getCoachAccessibleMatches,
  getCoachAccessibleNotifications,
  getCoachAssignedPlayers,
  getCoachAssignedTeams,
} from "@/lib/coach-access";

describe("Coach assignment access", () => {
  it("limits teams and players to the coach's current assignments", () => {
    expect(getCoachAssignedTeams().map((team) => team.id)).toEqual(["garuda-u8"]);
    expect(getCoachAssignedPlayers().every((player) => player.teamId === "garuda-u8")).toBe(true);
    expect(coachCanAccessPlayer("p-142")).toBe(true);
    expect(coachCanAccessPlayer("p-123")).toBe(false);
    expect(coachCanAccessTeam("garuda-u8")).toBe(true);
    expect(coachCanAccessTeam("garuda-u10")).toBe(false);
  });

  it("limits match access to fixtures involving an assigned team", () => {
    const matches = getCoachAccessibleMatches();
    expect(matches.length).toBeGreaterThan(0);
    expect(
      matches.every((match) => match.homeId === "garuda-u8" || match.awayId === "garuda-u8"),
    ).toBe(true);
    expect(coachCanAccessMatch("m-109")).toBe(true);
    expect(coachCanAccessMatch("m-103")).toBe(false);
    expect(coachCanAccessMatch("missing")).toBe(false);
  });

  it("limits competition access to competitions involving an assigned team", () => {
    expect(getCoachAccessibleCompetitions().map((competition) => competition.id)).toContain(
      "myc-2027",
    );
    expect(coachCanAccessCompetition("myc-2027")).toBe(true);
    expect(coachCanAccessCompetition("maros-open-2026")).toBe(false);
  });

  it("returns no assigned data when a coach has no team assignment", () => {
    expect(getCoachAssignedTeams("Unknown Coach")).toEqual([]);
    expect(getCoachAssignedPlayers("Unknown Coach")).toEqual([]);
    expect(coachCanAccessTeam("garuda-u8", "Unknown Coach")).toBe(false);
  });

  it("keeps Coach navigation focused on team operations", () => {
    const moduleIds = modulesForRole("coach").map((module) => module.id);

    expect(moduleIds).toContain("teams");
    expect(moduleIds).toContain("players");
    expect(moduleIds).toContain("schedule");
    expect(moduleIds).toContain("matches");
    expect(moduleIds).not.toContain("organizations");
  });

  it("keeps notifications within the Coach's assigned team context", () => {
    expect(getCoachAccessibleNotifications()).toEqual([]);
    expect(
      coachCanAccessNotification({
        id: "notice",
        type: "match",
        title: "Other team result",
        body: "A result for an unassigned team.",
        time: "2027-02-14T11:08",
        read: false,
        roles: ["coach"],
        href: "/matches/m-103",
      }),
    ).toBe(false);
  });
});
