import { createFileRoute, notFound } from "@tanstack/react-router";
import { MembershipReviewDetail } from "@/features/members/membership-review-detail";

export const Route = createFileRoute("/members/review/$reviewId")({
  component: MembersReviewDetailPage,
  loader: ({ params }) => {
    if (!params.reviewId) {
      throw notFound();
    }

    return { reviewId: params.reviewId };
  },
  notFoundComponent: () => (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Review item not available</h1>
      <p className="text-muted-foreground">This review item could not be found or is outside your current authorized scope.</p>
    </div>
  ),
  head: () => ({
    meta: [
      { title: "Membership review detail" },
      { name: "description", content: "Association review detail for a membership review item." },
    ],
  }),
});

function MembersReviewDetailPage() {
  return <MembershipReviewDetail />;
}
