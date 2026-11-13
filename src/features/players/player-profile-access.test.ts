import { describe, expect, it } from "vitest";
import { getWorkspaceActor } from "@/data/repository";
import { loadChildProfileRouteData } from "@/routes/children.$playerId";
import {
  loadPlayerProfileRouteData,
  resolvePlayerProfileAccess,
} from "@/routes/players.$playerId";

describe("player profile route authorization", () => {
  it("keeps protected player data out of route loader results", () => {
    const playerLoaderData = loadPlayerProfileRouteData("p-123");

    expect(playerLoaderData).toEqual({ playerId: "p-123" });
    expect(playerLoaderData).not.toHaveProperty("player");
    expect(Object.keys(playerLoaderData)).toEqual(["playerId"]);

    const childLoaderData = loadChildProfileRouteData("p-123");
    expect(childLoaderData).toEqual({ playerId: "p-123" });
    expect(childLoaderData).not.toHaveProperty("child");
  });

  it("denies before the persisted workspace role is ready", () => {
    expect(resolvePlayerProfileAccess("p-123", getWorkspaceActor("player"), false)).toEqual({
      ok: false,
      reason: "actor_not_ready",
    });
  });

  it("denies an unrelated guardian direct profile URL", () => {
    expect(resolvePlayerProfileAccess("p-148", getWorkspaceActor("parent"), true)).toEqual({
      ok: false,
      reason: "relationship_unverified",
    });
  });

  it("uses the viewer organization rather than the target player's organization", () => {
    expect(resolvePlayerProfileAccess("p-123", {
      ...getWorkspaceActor("org_admin"),
      organizationId: "phinisi",
    }, true)).toEqual({ ok: false, reason: "scope_unavailable" });
  });

  it("requires a coach's exact current team assignment", () => {
    expect(resolvePlayerProfileAccess("p-123", getWorkspaceActor("coach"), true)).toEqual({
      ok: false,
      reason: "forbidden",
    });
    const assigned = resolvePlayerProfileAccess("p-142", getWorkspaceActor("coach"), true);
    expect(assigned.ok && assigned.access.scope).toEqual({ kind: "team", teamId: "garuda-u8" });
  });

  it("returns one permission projection for profile tabs and overview content", () => {
    const result = resolvePlayerProfileAccess("p-123", getWorkspaceActor("parent"), true);

    expect(result.ok).toBe(true);
    expect(result.ok && result.access.permissions).toMatchObject({
      canViewMatches: true,
      canViewDocuments: false,
      canViewPlayerStats: false,
      canViewSchedule: false,
      canViewAchievements: false,
    });
  });
});
