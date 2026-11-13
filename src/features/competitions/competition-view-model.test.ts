import { describe, expect, it } from "vitest";
import { getCompetition, listMatches } from "@/data/repository";
import type { CompetitionCategory } from "@/data/types";
import {
  completedResults,
  getCoachCompetitionContext,
  groupMatchesByDate,
  matchesForCategory,
  scheduledMatches,
  teamGroupsForCategory,
} from "@/features/competitions/competition-view-model";

describe("competition view model", () => {
  const matches = listMatches({ competitionId: "myc-2027" });

  it("scopes matches to a category without assuming a tournament format", () => {
    const categoryMatches = matchesForCategory(matches, "u10");

    expect(categoryMatches.length).toBeGreaterThan(0);
    expect(categoryMatches.every((match) => match.categoryId === "u10")).toBe(true);
  });

  it("separates scheduled fixtures from completed results", () => {
    const categoryMatches = matchesForCategory(matches, "u10");
    const schedule = scheduledMatches(categoryMatches);
    const results = completedResults(categoryMatches);

    expect(schedule.length).toBeGreaterThan(0);
    expect(schedule.every((match) => match.status === "scheduled" || match.status === "live")).toBe(
      true,
    );
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((match) => match.status === "completed" && match.score !== undefined),
    ).toBe(true);
  });

  it("groups dates in either chronological direction", () => {
    const results = completedResults(matches);
    const oldestFirst = groupMatchesByDate(results);
    const newestFirst = groupMatchesByDate(results, "newest-first");

    expect(oldestFirst.map((group) => group.date)).toEqual(
      [...oldestFirst.map((group) => group.date)].sort(),
    );
    expect(newestFirst.map((group) => group.date)).toEqual(
      [...oldestFirst.map((group) => group.date)].reverse(),
    );
  });

  it("supports flat categories without tournament groups", () => {
    const category: CompetitionCategory = {
      id: "open",
      label: "Open",
      birthYear: "2015–2017",
      format: "Festival",
      teamIds: ["garuda-u10"],
      groups: [],
    };

    expect(teamGroupsForCategory(category)).toEqual([{ name: "Teams", teamIds: ["garuda-u10"] }]);
  });

  it("projects the shared competition into the coach's assigned-team context", () => {
    const competition = getCompetition("myc-2027");
    if (!competition) throw new Error("Expected competition fixture");

    const context = getCoachCompetitionContext(
      competition,
      listMatches({ competitionId: competition.id }),
      ["garuda-u8"],
    );

    expect(context.competition.categories.length).toBeGreaterThan(0);
    expect(context.competition.categories.flatMap((category) => category.teamIds)).toEqual([
      "garuda-u8",
    ]);
    expect(
      context.matches.every(
        (match) => match.homeId === "garuda-u8" || match.awayId === "garuda-u8",
      ),
    ).toBe(true);
  });
});
