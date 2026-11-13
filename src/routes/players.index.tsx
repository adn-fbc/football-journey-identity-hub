import { createFileRoute } from "@tanstack/react-router";
import { PlayerDirectory } from "@/features/players/player-directory";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/players/")({
  head: () =>
    pageHead(
      "Players",
      "Players with a current relationship with your organization — search, filter and review memberships.",
    ),
  component: PlayersRoute,
});

function PlayersRoute() {
  return <PlayerDirectory />;
}
