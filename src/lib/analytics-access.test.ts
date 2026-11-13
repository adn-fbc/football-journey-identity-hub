import { describe, expect, it } from "vitest";
import { canViewCompetitionAnalytics, canViewOrganizationAnalytics, getAnalyticsScope } from "./analytics-access";

describe("analytics access", () => {
  it("lets an org admin see their own organization", () => {
    expect(canViewOrganizationAnalytics("org_admin", "garuda")).toBe(true);
  });

  it("stops an org admin from seeing another organization", () => {
    expect(canViewOrganizationAnalytics("org_admin", "phinisi")).toBe(false);
  });

  it("lets an organizer see only the competition they run", () => {
    expect(canViewCompetitionAnalytics("competition_organizer", "myc-2027")).toBe(true);
    expect(canViewCompetitionAnalytics("competition_organizer", "other-cup")).toBe(false);
  });

  it("does not give organizers organization analytics", () => {
    expect(canViewOrganizationAnalytics("competition_organizer", "garuda")).toBe(false);
  });

  it("gives players, guardians, coaches, referees, scouts and associations no analytics scope", () => {
    for (const role of ["player", "parent", "coach", "referee", "scout", "association"] as const) {
      expect(getAnalyticsScope(role).kind, role).toBe("none");
    }
  });
});
