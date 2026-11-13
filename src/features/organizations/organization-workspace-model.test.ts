import { describe, expect, it } from "vitest";
import { listOrganizations } from "@/data/repository";
import { getOrganizationWorkspaceSnapshot } from "@/features/organizations/organization-workspace-model";

describe("organization workspace model", () => {
  it("keeps teams, players, schedules, and competitions within each organization context", () => {
    for (const organization of listOrganizations()) {
      const workspace = getOrganizationWorkspaceSnapshot(organization);
      const teamIds = new Set(workspace.teams.map((team) => team.id));

      expect(workspace.teams.every((team) => team.orgId === organization.id)).toBe(true);
      expect(workspace.players.every((player) => player.orgId === organization.id)).toBe(true);
      expect(
        workspace.schedule.every((item) => item.teamId !== undefined && teamIds.has(item.teamId)),
      ).toBe(true);
      expect(
        workspace.competitions.every(
          (competition) =>
            competition.organizer.toLowerCase() === organization.name.toLowerCase() ||
            competition.categories.some((category) =>
              category.teamIds.some((teamId) => teamIds.has(teamId)),
            ),
        ),
      ).toBe(true);
    }
  });

  it("collects team staff assignments without duplicating a coach", () => {
    const garuda = listOrganizations().find((organization) => organization.id === "garuda");
    expect(garuda).toBeDefined();
    const workspace = getOrganizationWorkspaceSnapshot(garuda!);

    expect(new Set(workspace.staff.map((member) => member.id)).size).toBe(workspace.staff.length);
    expect(workspace.staff.some((member) => member.roles.includes("Head coach"))).toBe(true);
  });

  it("counts each player once in the dashboard attention list", () => {
    const garuda = listOrganizations().find((organization) => organization.id === "garuda");
    expect(garuda).toBeDefined();
    const { attention } = getOrganizationWorkspaceSnapshot(garuda!);

    expect(attention).toHaveLength(4);
    expect(new Set(attention.map((item) => item.player.id)).size).toBe(attention.length);
  });
});
