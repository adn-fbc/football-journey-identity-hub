import { describe, expect, it } from "vitest";
import { getCurrentUser } from "@/data/repository";
import { getCoachDashboardSnapshot } from "@/features/overview/coach-dashboard-model";

describe("coach dashboard model", () => {
  it("derives assigned teams, roster, training, and matches from the active coach", () => {
    const snapshot = getCoachDashboardSnapshot(getCurrentUser().name);

    expect(snapshot.teams.map((team) => team.id)).toEqual(["garuda-u8"]);
    expect(snapshot.players.length).toBeGreaterThan(0);
    expect(snapshot.upcomingTraining.map((session) => session.id)).toContain("s3");
    expect(snapshot.upcomingMatches.map((match) => match.id)).toContain("m-109");
  });

  it("returns empty collections for a coach with no assignments", () => {
    const snapshot = getCoachDashboardSnapshot("Unknown Coach");

    expect(snapshot).toEqual({
      teams: [],
      players: [],
      upcomingTraining: [],
      upcomingMatches: [],
    });
  });
});
