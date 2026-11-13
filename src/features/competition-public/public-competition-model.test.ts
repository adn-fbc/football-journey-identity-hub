import { describe, expect, it } from "vitest";
import { getPublicCompetitionSnapshot } from "@/features/competition-public/public-competition-model";

describe("public competition model", () => {
  it("projects public competition data without private match event details", () => {
    const snapshot = getPublicCompetitionSnapshot("myc-2027");

    expect(snapshot?.competition.name).toBe("Makassar Youth Cup 2027");
    expect(snapshot?.featuredMatch?.status).toBe("live");
    expect(snapshot?.matches.length).toBeGreaterThan(0);
    expect(snapshot?.matches.some((match) => "events" in match)).toBe(false);
    expect(snapshot?.standingsPreview.every((row) => !("events" in row))).toBe(true);
    expect(snapshot?.standingsPreview.some((row) => row.played > 0)).toBe(true);
    expect(snapshot?.upcomingMatches.length).toBeGreaterThan(0);
  });

  it("does not return unpublished competitions from the public route", () => {
    expect(getPublicCompetitionSnapshot("gowa-cup-2027")).toBeUndefined();
    expect(getPublicCompetitionSnapshot("maros-open-2026")).toBeUndefined();
  });
});
