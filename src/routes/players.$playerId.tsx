import { createFileRoute, Link } from "@tanstack/react-router";
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
import {
  getPlayerAccessForActor,
  getWorkspaceActor,
  type PlayerAccessResult,
  type WorkspaceActor,
} from "@/data/repository";
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
import { z } from "zod";

const profileSearch = z.object({
  view: z
    .enum(["overview", "teams", "matches", "development", "journey", "achievements", "documents"])
    .optional(),
});

export function loadPlayerProfileRouteData(playerId: string) {
  return { playerId };
}

export function resolvePlayerProfileAccess(
  playerId: string,
  actor: WorkspaceActor,
  ready: boolean,
): PlayerAccessResult | { ok: false; reason: "actor_not_ready" } {
  if (!ready) return { ok: false, reason: "actor_not_ready" };
  return getPlayerAccessForActor(playerId, actor);
}

export const Route = createFileRoute("/players/$playerId")({
  loader: ({ params }) => loadPlayerProfileRouteData(params.playerId),
  validateSearch: profileSearch,
  head: () => ({ meta: [{ title: "Player profile · Football ID" }, { name: "robots", content: "noindex" }] }),
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
  const { playerId } = Route.useLoaderData();
  const { role, ready } = useRole();
  const { view } = Route.useSearch();
  const decision = resolvePlayerProfileAccess(playerId, getWorkspaceActor(role), ready);
  if (!decision.ok) {
    return (
      <PermissionState
        title={decision.reason === "actor_not_ready" ? "Player access unavailable" : "Player access restricted"}
        description={decision.reason === "actor_not_ready"
          ? "The active workspace scope has not been resolved."
          : "This player is not available in the active workspace scope."}
        action={
          role === "coach" ? <Button asChild variant="outline"><Link to="/teams">Back to My Teams</Link></Button> : undefined
        }
      />
    );
  }
  const { player, permissions } = decision.access;
  const playerWorkspace = role === "player";
  const coachWorkspace = role === "coach";
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
          ...(permissions.canViewDevelopment ? [{ value: "development", label: "Development" }] : []),
        ]
    : role === "parent"
      ? [
          { value: "overview", label: "Overview" },
          { value: "journey", label: "Journey" },
          { value: "teams", label: "Teams" },
          ...(permissions.canViewMatches ? [{ value: "matches", label: "Matches" }] : []),
        ]
      : [
          { value: "overview", label: "Overview" },
          { value: "journey", label: "Journey" },
          { value: "teams", label: "Teams" },
          ...(permissions.canViewMatches ? [{ value: "matches", label: "Matches" }] : []),
          ...(permissions.canViewAchievements ? [{ value: "achievements", label: "Achievements" }] : []),
          ...(permissions.canViewDocuments ? [{ value: "documents", label: "Documents" }] : []),
        ];
  const selectedView = tabs.some((tab) => tab.value === view) ? view! : "overview";
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
             <PlayerOverviewTab
               player={player}
               showStats={permissions.canViewPlayerStats}
               showMatches={permissions.canViewMatches}
               showSchedule={permissions.canViewSchedule}
               showAchievements={permissions.canViewAchievements}
             />
        </PageTabsContent>
        <PageTabsContent value="journey">
          <PlayerJourneyTab player={player} />
        </PageTabsContent>
        <PageTabsContent value="teams">
          <PlayerTeamsTab player={player} />
        </PageTabsContent>
        {permissions.canViewMatches && (
          <PageTabsContent value="matches">
            <PlayerMatchesTab player={player} />
          </PageTabsContent>
        )}
        {permissions.canViewDevelopment && (
          <PageTabsContent value="development">
            <PlayerDevelopmentTab player={player} />
          </PageTabsContent>
        )}
        {permissions.canViewAchievements && (
          <PageTabsContent value="achievements">
            <AchievementList playerId={player.id} />
          </PageTabsContent>
        )}
        {permissions.canViewDocuments && (
          <PageTabsContent value="documents">
            <PlayerDocumentsTab player={player} actor={getWorkspaceActor(role)} />
          </PageTabsContent>
        )}
      </PageTabs>
    </div>
  );
}
