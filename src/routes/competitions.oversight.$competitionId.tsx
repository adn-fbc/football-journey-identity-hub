import { createFileRoute, notFound } from "@tanstack/react-router";
import { CompetitionOversightDetail } from "@/features/competitions/competition-oversight-detail";
import { getCompetition } from "@/data/repository";

export const Route = createFileRoute("/competitions/oversight/$competitionId")({
  loader: ({ params }) => {
    const competition = getCompetition(params.competitionId);

    if (!competition) {
      throw notFound();
    }

    return { competition };
  },
  component: CompetitionOversightDetailRoute,
});

function CompetitionOversightDetailRoute() {
  const { competition } = Route.useLoaderData();

  return <CompetitionOversightDetail competition={competition} />;
}
