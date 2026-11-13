import { createFileRoute } from "@tanstack/react-router";
import { PermissionState } from "@/components/ds/states";
import { useRole } from "@/lib/role-context";
import { OrgAdminOverview } from "@/features/overview/org-admin-overview";
import { ParentOverview } from "@/features/overview/parent-overview";
import { PlayerOverview } from "@/features/overview/player-overview";
import { CoachOverview } from "@/features/overview/coach-overview";
import { OrganizerOverview } from "@/features/overview/organizer-overview";
import { AssociationOverview } from "@/features/overview/association-overview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · Football ID" },
      { name: "description", content: "Your role-aware home for players, guardians, coaches, clubs and competitions." },
      { property: "og:title", content: "Overview · Football ID" },
      { property: "og:description", content: "Your role-aware home for players, guardians, coaches, clubs and competitions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { role, ready } = useRole();
  if (!ready) {
    return <PermissionState title="Overview unavailable" description="The active workspace scope has not been resolved." />;
  }
  switch (role) {
    case "parent": return <ParentOverview />;
    case "player": return <PlayerOverview />;
    case "coach": return <CoachOverview />;
    case "competition_organizer": return <OrganizerOverview />;
    case "association": return <AssociationOverview />;
    default: return <OrgAdminOverview />;
  }
}
