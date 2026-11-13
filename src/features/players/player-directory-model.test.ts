import { describe, expect, it } from "vitest";
import { listPlayers } from "@/data/repository";
import {
  countDirectoryPlayers,
  directoryAgeCategories,
  filterDirectoryPlayers,
  type PlayerDirectoryFilters,
} from "@/features/players/player-directory-model";

const players = listPlayers({ orgId: "garuda" });
const defaultFilters: PlayerDirectoryFilters = {
  search: "",
  membership: "all",
  teamId: "all",
  ageCategory: "all",
  verification: "all",
};

describe("player directory model", () => {
  it("combines the current directory filters", () => {
    const rows = filterDirectoryPlayers(players, {
      ...defaultFilters,
      search: "IDN-FB-2016-000123",
      membership: "active",
      teamId: "garuda-u10",
      ageCategory: "U10",
      verification: "verified",
    });

    expect(rows.map((player) => player.id)).toEqual(["p-123"]);
  });

  it("counts membership filters and returns available age groups", () => {
    expect(countDirectoryPlayers(players, "all")).toBe(players.length);
    expect(countDirectoryPlayers(players, "pending")).toBe(3);
    expect(directoryAgeCategories(players)).toContain("U10");
  });
});
