import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { MessageSquare, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ds/page-header";
import {
  PageTabs,
  PageTabsContent,
  PageTabsList,
  PageTabsTrigger,
} from "@/components/ds/page-tabs";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { EmptyState, PermissionState } from "@/components/ds/states";
import { getPlayer } from "@/data/repository";
import { pageHead } from "@/lib/seo";
import { PlayerHeader } from "@/features/players/player-header";
import {
  AchievementList,
  PlayerDevelopmentTab,
  PlayerDocumentsTab,
  PlayerJourneyTab,
  PlayerMatchesTab,
  PlayerOverviewTab,
  PlayerTeamsTab,
} from "@/features/players/player-tabs";
import { useRole } from "@/lib/role-context";
import { coachCanAccessPlayer } from "@/lib/coach-access";
import { z } from "zod";

const profileSearch = z.object({
  view: z
    .enum(["overview", "teams", "matches", "development", "journey", "achievements", "documents"])
    .optional(),
});

export const Route = createFileRoute("/players/$playerId")({
  loader: ({ params }) => {
    const player = getPlayer(params.playerId);
    if (!player) throw notFound();
    return { player };
  },
  validateSearch: profileSearch,
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(
          loaderData.player.name,
          `${loaderData.player.positionLabel} · Football ID ${loaderData.player.footballId}`,
        )
      : {
          meta: [
            { title: "Player unavailable · Football ID" },
            { name: "robots", content: "noindex" },
          ],
        },
  notFoundComponent: () => (
    <EmptyState
      title="Player not found"
      description="This Football ID doesn't exist or isn't shared with you."
      action={
        <Button asChild variant="outline">
          <Link to="/players">Back to players</Link>
        </Button>
      }
    />
  ),
  component: PlayerProfile,
});

function PlayerProfile() {
  const { player } = Route.useLoaderData();
  const { role } = useRole();
  const { view } = Route.useSearch();
  if (role === "coach" && !coachCanAccessPlayer(player)) {
    return (
      <PermissionState
        title="Player access restricted"
        description="Coach access is limited to players in your assigned teams."
        action={
          <Button asChild variant="outline">
            <Link to="/teams">Back to My Teams</Link>
          </Button>
        }
      />
    );
  }
  if (role === "player" && player.id !== "p-123") {
    return (
      <PermissionState
        title="Player profile unavailable"
        description="You can only view the profile connected to your Football ID."
      />
    );
  }
  const playerWorkspace = role === "player";
  const coachWorkspace = role === "coach";
  const selectedView =
    playerWorkspace && (view === "achievements" || view === "documents")
      ? "overview"
      : (view ?? "overview");
  const tabs = playerWorkspace
    ? [
        { value: "overview", label: "My Profile" },
        { value: "teams", label: "My Team" },
        { value: "matches", label: "Match History" },
        { value: "development", label: "Development Summary" },
        { value: "journey", label: "Football Journey" },
      ]
    : coachWorkspace
      ? [
          { value: "overview", label: "Overview" },
          { value: "journey", label: "Journey" },
          { value: "teams", label: "Teams" },
          { value: "matches", label: "Matches" },
          { value: "development", label: "Development" },
        ]
    : [
        { value: "overview", label: "Overview" },
        { value: "journey", label: "Journey" },
        { value: "teams", label: "Teams" },
        { value: "matches", label: "Matches" },
        { value: "achievements", label: "Achievements" },
        { value: "documents", label: "Documents" },
      ];
  return (
    <div className="space-y-6">
      <Breadcrumbs
        crumbs={
          playerWorkspace
            ? [{ label: "Player Home", to: "/" }, { label: "My Profile" }]
            : [{ label: "Players", to: "/players" }, { label: player.name }]
        }
      />
      <PlayerHeader
        player={player}
        actions={
          role === "org_admin" && (
            <>
              <Button
                variant="outline"
                onClick={() => toast("Message sent to guardian (prototype)")}
              >
                <MessageSquare /> Contact guardian
              </Button>
              <ConfirmDialog
                trigger={
                  <Button variant="ghost" size="icon" aria-label="End membership">
                    <UserMinus />
                  </Button>
                }
                title="End membership with SSB Garuda Makassar?"
                description={
                  <>
                    The relationship will be marked as ended. <b>{player.name}</b> keeps their
                    Football ID, match history and achievements.
                  </>
                }
                confirmLabel="End membership"
                destructive
                onConfirm={() =>
                  toast.success("Membership ended", {
                    description: "The guardian has been notified.",
                  })
                }
              />
            </>
          )
        }
      />
      <PageTabs key={selectedView} defaultValue={selectedView}>
        <PageTabsList>
          {tabs.map((tab) => (
            <PageTabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </PageTabsTrigger>
          ))}
        </PageTabsList>
        <PageTabsContent value="overview">
          <PlayerOverviewTab player={player} />
        </PageTabsContent>
        <PageTabsContent value="journey">
          <PlayerJourneyTab player={player} />
        </PageTabsContent>
        <PageTabsContent value="teams">
          <PlayerTeamsTab player={player} />
        </PageTabsContent>
        <PageTabsContent value="matches">
          <PlayerMatchesTab player={player} />
        </PageTabsContent>
        {(playerWorkspace || coachWorkspace) && (
          <PageTabsContent value="development">
            <PlayerDevelopmentTab player={player} />
          </PageTabsContent>
        )}
        {!playerWorkspace && (
          <PageTabsContent value="achievements">
            <AchievementList playerId={player.id} />
          </PageTabsContent>
        )}
        {!playerWorkspace && !coachWorkspace && (
          <PageTabsContent value="documents">
            <PlayerDocumentsTab player={player} />
          </PageTabsContent>
        )}
      </PageTabs>
    </div>
  );
}
