import type { Competition, CompetitionCategory, Match } from "@/data/types";

export function getCoachCompetitionContext(
  competition: Competition,
  matches: Match[],
  assignedTeamIds: string[],
) {
  const assigned = new Set(assignedTeamIds);

  return {
    competition: {
      ...competition,
      categories: competition.categories
        .filter((category) => category.teamIds.some((teamId) => assigned.has(teamId)))
        .map((category) => ({
          ...category,
          teamIds: category.teamIds.filter((teamId) => assigned.has(teamId)),
        })),
    },
    matches: matches.filter((match) => assigned.has(match.homeId) || assigned.has(match.awayId)),
    assignedTeamIds: [...assigned],
  };
}

export interface CompetitionDateGroup {
  date: string;
  matches: Match[];
}

export function matchesForCategory(matches: Match[], categoryId: string) {
  return matches.filter((match) => match.categoryId === categoryId);
}

export function scheduledMatches(matches: Match[]) {
  return matches.filter((match) => match.status === "scheduled" || match.status === "live");
}

export function completedResults(matches: Match[]) {
  return matches.filter((match) => match.status === "completed");
}

export function groupMatchesByDate(
  matches: Match[],
  order: "oldest-first" | "newest-first" = "oldest-first",
): CompetitionDateGroup[] {
  const groups = new Map<string, Match[]>();
  for (const match of matches) {
    const group = groups.get(match.date) ?? [];
    group.push(match);
    groups.set(match.date, group);
  }

  return [...groups.entries()]
    .sort(([left], [right]) =>
      order === "oldest-first" ? left.localeCompare(right) : right.localeCompare(left),
    )
    .map(([date, groupedMatches]) => ({ date, matches: groupedMatches }));
}

export function teamGroupsForCategory(category: CompetitionCategory) {
  if (category.groups.length || !category.teamIds.length) return category.groups;
  return [{ name: "Teams", teamIds: category.teamIds }];
}
