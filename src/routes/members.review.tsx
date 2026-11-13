import { createFileRoute } from "@tanstack/react-router";
import { MembershipReviewQueue } from "@/features/members/membership-review-queue";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/members/review")({
  head: () => pageHead("Membership review", "Review and process membership requests within your authorized scope."),
  component: MembersReviewPage,
});

function MembersReviewPage() {
  return <MembershipReviewQueue />;
}
