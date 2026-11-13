import type { Competition } from "@/data/types";
import {
  computeStandings,
  getCompetition,
  getOrganization,
  getTeam,
  listMatches,
} from "@/data/repository";
import { MOCK_TODAY } from "@/data/mock";

export interface PublicMatchSummary {
  id: string;
  date: string;
  time: string;
  venue: string;
  round: string;
  category: string;
  status: string;
  score?: { home: number; away: number } | undefined;
  home: { id: string; name: string };
  away: { id: string; name: string };
}

export type PublicCompetitionDetails = Pick<
  Competition,
  | "id"
  | "name"
  | "short"
  | "organizer"
  | "city"
  | "status"
  | "start"
  | "end"
  | "format"
  | "description"
  | "venues"
  | "registrationDeadline"
> & {
  categories: Array<{ id: string; label: string; format: string; teamIds: string[] }>;
};

export function getPublicCompetitionSnapshot(competitionId: string) {
  const source = getCompetition(competitionId);
  if (!source || source.publicVisibility !== "public") return undefined;

  const categoriesById = new Map(
    source.categories.map((category) => [category.id, category.label]),
  );
  const competition: PublicCompetitionDetails = {
    id: source.id,
    name: source.name,
    short: source.short,
    organizer: source.organizer,
    city: source.city,
    status: source.status,
    start: source.start,
    end: source.end,
    format: source.format,
    description: source.description,
    venues: source.venues,
    registrationDeadline: source.registrationDeadline,
    categories: source.categories.map((category) => ({
      id: category.id,
      label: category.label,
      format: category.format,
      teamIds: category.teamIds,
    })),
  };
  const sourceMatches = listMatches({ competitionId: source.id });
  const matches: PublicMatchSummary[] = sourceMatches.map((match) => ({
    id: match.id,
    date: match.date,
    time: match.time,
    venue: match.venue,
    round: match.round,
    category: categoriesById.get(match.categoryId) ?? match.categoryId,
    status: match.status,
    score: match.score,
    home: { id: match.homeId, name: getTeam(match.homeId)?.name ?? "Team" },
    away: { id: match.awayId, name: getTeam(match.awayId)?.name ?? "Team" },
  }));
  const completed = matches
    .filter((match) => match.status === "completed")
    .sort((left, right) => (right.date + right.time).localeCompare(left.date + left.time));
  const upcoming = matches
    .filter(
      (match) =>
        (match.status === "scheduled" || match.status === "live") && match.date >= MOCK_TODAY,
    )
    .sort((left, right) => (left.date + left.time).localeCompare(right.date + right.time));
  const featuredMatch =
    matches.find((match) => match.status === "live") ?? upcoming[0] ?? completed[0];
  const standingsCategory =
    source.categories.find((category) =>
      sourceMatches.some(
        (match) => match.categoryId === category.id && match.status === "completed",
      ),
    ) ?? source.categories[0];
  const standingsGroup = standingsCategory?.groups[0];
  const standingsTeamIds = standingsGroup?.teamIds ?? standingsCategory?.teamIds ?? [];
  const standingsPreview = standingsCategory
    ? computeStandings(
        standingsTeamIds,
        sourceMatches.filter((match) => match.categoryId === standingsCategory.id),
      ).map((row, index) => ({
        rank: index + 1,
        teamId: row.teamId,
        teamName: getTeam(row.teamId)?.name ?? "Team",
        played: row.p,
        won: row.w,
        drawn: row.d,
        lost: row.l,
        points: row.pts,
      }))
    : [];
  const teamIds = [...new Set(competition.categories.flatMap((category) => category.teamIds))];

  return {
    competition,
    matches,
    todayMatches: matches.filter((match) => match.date === MOCK_TODAY),
    upcomingMatches: upcoming,
    latestResults: completed.slice(0, 3),
    featuredMatch,
    standingsPreview,
    standingsCategory: standingsCategory?.label,
    standingsGroup: standingsGroup?.name,
    teams: teamIds.flatMap((id) => {
      const team = getTeam(id);
      if (!team) return [];
      return [
        {
          id: team.id,
          name: team.name,
          ageCategory: team.ageCategory,
          organization: getOrganization(team.orgId)?.name ?? "",
        },
      ];
    }),
  };
}
