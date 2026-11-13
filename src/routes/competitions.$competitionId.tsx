import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { EmptyState, PermissionState } from "@/components/ds/states";
import { getCompetition, listMatches } from "@/data/repository";
import {
  COMPETITION_DETAIL_VIEWS,
  CompetitionDetail,
  type CompetitionDetailView,
} from "@/features/competitions/competition-detail";
import { pageHead } from "@/lib/seo";
import { coachCanAccessCompetition, getCoachAssignedTeams } from "@/lib/coach-access";
import { useRole } from "@/lib/role-context";
import { getCoachCompetitionContext } from "@/features/competitions/competition-view-model";

const competitionSearch = z.object({
  view: z.enum(COMPETITION_DETAIL_VIEWS).optional(),
  category: z.string().optional(),
});

export const Route = createFileRoute("/competitions/$competitionId")({
  loader: ({ params }) => {
    const competition = getCompetition(params.competitionId);
    if (!competition) throw notFound();
    return { competition };
  },
  validateSearch: competitionSearch,
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(loaderData.competition.name, loaderData.competition.description)
      : { meta: [{ title: "Unavailable · Football ID" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <EmptyState
      title="Competition not found"
      action={
        <Button asChild variant="outline">
          <Link to="/competitions">Back</Link>
        </Button>
      }
    />
  ),
  component: CompetitionDetailRoute,
});

function CompetitionDetailRoute() {
  const { competition } = Route.useLoaderData();
  const { role } = useRole();
  const { view, category } = Route.useSearch();
  const navigate = Route.useNavigate();

  if (role === "coach" && !coachCanAccessCompetition(competition)) {
    return (
      <PermissionState
        title="Access restricted"
        description="Coach competition access is limited to competitions involving your assigned teams."
        action={
          <Button asChild variant="outline">
            <Link to="/teams">Back to My Teams</Link>
          </Button>
        }
      />
    );
  }

  const assignedTeamIds =
    role === "coach" ? getCoachAssignedTeams().map((team) => team.id) : undefined;
  const coachContext = assignedTeamIds
    ? getCoachCompetitionContext(
        competition,
        listMatches({ competitionId: competition.id }),
        assignedTeamIds,
      )
    : undefined;

  const onNavigate = (nextView: CompetitionDetailView, categoryId: string) => {
    void navigate({ search: { view: nextView, category: categoryId || undefined } });
  };

  return (
    <CompetitionDetail
      competition={coachContext?.competition ?? competition}
      view={role === "coach" && view === "standings" ? "overview" : (view ?? "overview")}
      categoryId={category}
      matches={coachContext?.matches}
      assignedTeamIds={coachContext?.assignedTeamIds}
      onNavigate={onNavigate}
    />
  );
}
