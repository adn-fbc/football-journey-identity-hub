import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CheckInPage } from "@/features/check-in/check-in-page";
import { useRole } from "@/lib/role-context";
import { pageHead } from "@/lib/seo";

const checkInSearch = z.object({
  view: z.enum(["home", "history"]).optional(),
  activityId: z.string().optional(),
  childId: z.string().optional(),
});

export const Route = createFileRoute("/check-in")({
  validateSearch: checkInSearch,
  head: () => pageHead("Check-in", "Check-in for activities in your authorized team context."),
  component: CheckInRoute,
});

function CheckInRoute() {
  const { role } = useRole();
  const { view, activityId, childId } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <CheckInPage
      role={role}
      view={view ?? "home"}
      activityId={activityId}
      childId={childId}
      onShowHistory={(selectedChildId) => {
        void navigate({ search: { view: "history", childId: selectedChildId } });
      }}
      onShowHome={(selectedChildId) => {
        void navigate({ search: { view: "home", childId: selectedChildId } });
      }}
      onSelectChild={(selectedChildId) => {
        void navigate({ search: { view: view ?? "home", activityId, childId: selectedChildId } });
      }}
      onReturnToSchedule={() => {
        void navigate({ to: "/schedule" });
      }}
    />
  );
}
