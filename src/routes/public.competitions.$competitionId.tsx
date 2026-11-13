import { createFileRoute, notFound } from "@tanstack/react-router";
import { EmptyState } from "@/components/ds/states";
import { PublicCompetitionPortal } from "@/features/competition-public/public-competition-portal";
import { getPublicCompetitionSnapshot } from "@/features/competition-public/public-competition-model";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/public/competitions/$competitionId")({
  loader: ({ params }) => {
    const snapshot = getPublicCompetitionSnapshot(params.competitionId);
    if (!snapshot) throw notFound();
    return snapshot;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(
          loaderData.competition.name,
          "Public competition schedule, results, standings and team information.",
        )
      : {
          meta: [
            { title: "Competition unavailable · Football ID" },
            { name: "robots", content: "noindex" },
          ],
        },
  notFoundComponent: () => (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4">
      <EmptyState
        title="Competition unavailable"
        description="This competition is not published for public viewing."
      />
    </main>
  ),
  component: PublicCompetitionRoute,
});

function PublicCompetitionRoute() {
  const snapshot = Route.useLoaderData();
  return <PublicCompetitionPortal snapshot={snapshot} />;
}
