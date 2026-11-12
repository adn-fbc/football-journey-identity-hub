import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { MessageSquare, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ds/page-header";
import { PageTabs, PageTabsContent, PageTabsList, PageTabsTrigger } from "@/components/ds/page-tabs";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { EmptyState } from "@/components/ds/states";
import { getPlayer } from "@/data/repository";
import { pageHead } from "@/lib/seo";
import { PlayerHeader } from "@/features/players/player-header";
import {
  AchievementList, PlayerDocumentsTab, PlayerJourneyTab, PlayerMatchesTab, PlayerOverviewTab, PlayerTeamsTab,
} from "@/features/players/player-tabs";

export const Route = createFileRoute("/players/$playerId")({
  loader: ({ params }) => {
    const player = getPlayer(params.playerId);
    if (!player) throw notFound();
    return { player };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(loaderData.player.name, `${loaderData.player.positionLabel} · Football ID ${loaderData.player.footballId}`)
      : { meta: [{ title: "Player unavailable · Football ID" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <EmptyState title="Player not found" description="This Football ID doesn't exist or isn't shared with you." action={<Button asChild variant="outline"><Link to="/players">Back to players</Link></Button>} />
  ),
  component: PlayerProfile,
});

function PlayerProfile() {
  const { player } = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Players", to: "/players" }, { label: player.name }]} />
      <PlayerHeader
        player={player}
        actions={
          <>
            <Button variant="outline" onClick={() => toast("Message sent to guardian (prototype)")}><MessageSquare /> Contact guardian</Button>
            <ConfirmDialog
              trigger={<Button variant="ghost" size="icon" aria-label="End membership"><UserMinus /></Button>}
              title="End membership with SSB Garuda Makassar?"
              description={<>The relationship will be marked as ended. <b>{player.name}</b> keeps their Football ID, match history and achievements.</>}
              confirmLabel="End membership"
              destructive
              onConfirm={() => toast.success("Membership ended", { description: "The guardian has been notified." })}
            />
          </>
        }
      />
      <PageTabs defaultValue="overview">
        <PageTabsList>
          {["Overview", "Journey", "Teams", "Matches", "Achievements", "Documents"].map((t) => (
            <PageTabsTrigger key={t} value={t.toLowerCase()}>{t}</PageTabsTrigger>
          ))}
        </PageTabsList>
        <PageTabsContent value="overview"><PlayerOverviewTab player={player} /></PageTabsContent>
        <PageTabsContent value="journey"><PlayerJourneyTab player={player} /></PageTabsContent>
        <PageTabsContent value="teams"><PlayerTeamsTab player={player} /></PageTabsContent>
        <PageTabsContent value="matches"><PlayerMatchesTab player={player} /></PageTabsContent>
        <PageTabsContent value="achievements"><AchievementList playerId={player.id} /></PageTabsContent>
        <PageTabsContent value="documents"><PlayerDocumentsTab player={player} /></PageTabsContent>
      </PageTabs>
    </div>
  );
}
