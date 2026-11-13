import { createFileRoute } from "@tanstack/react-router";
import { MemberDirectory } from "@/features/members/member-directory";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/members/")({
  head: () => pageHead("Member directory", "Find and review members within your authorized Association scope."),
  component: MembersPage,
});

function MembersPage() {
  return <MemberDirectory />;
}
