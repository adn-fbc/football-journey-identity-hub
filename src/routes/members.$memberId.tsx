import { createFileRoute, notFound } from "@tanstack/react-router";
import { MemberDetail } from "@/features/members/member-detail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/members/$memberId")({
  loader: ({ params }) => {
    if (!params.memberId) throw notFound();
    return { memberId: params.memberId };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead("Unified member detail", "Authorized member context across identity, membership, roles and credentials.")
      : { meta: [{ title: "Member detail unavailable · Football ID" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <MemberDetail notFound />
  ),
  component: MemberDetailPage,
});

function MemberDetailPage() {
  return <MemberDetail />;
}
