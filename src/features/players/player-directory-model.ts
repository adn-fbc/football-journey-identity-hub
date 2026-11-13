import type { Player } from "@/data/types";
import { ageCategoryFor } from "@/lib/format";

export type PlayerDirectoryStatus = "all" | "active" | "pending" | "archived";

export interface PlayerDirectoryFilters {
  search: string;
  membership: PlayerDirectoryStatus;
  teamId: string;
  ageCategory: string;
  verification: string;
}

export function filterDirectoryPlayers(players: Player[], filters: PlayerDirectoryFilters) {
  const query = filters.search.trim().toLowerCase();

  return players.filter(
    (player) =>
      (filters.membership === "all" || player.membership === filters.membership) &&
      (filters.teamId === "all" || player.teamId === filters.teamId) &&
      (filters.ageCategory === "all" || ageCategoryFor(player.birthYear) === filters.ageCategory) &&
      (filters.verification === "all" || player.verification === filters.verification) &&
      (!query || `${player.name} ${player.footballId}`.toLowerCase().includes(query)),
  );
}

export function countDirectoryPlayers(players: Player[], membership: PlayerDirectoryStatus) {
  return membership === "all"
    ? players.length
    : players.filter((player) => player.membership === membership).length;
}

export function directoryAgeCategories(players: Player[]) {
  return [...new Set(players.map((player) => ageCategoryFor(player.birthYear)))].sort();
}
