import { createFileRoute } from "@tanstack/react-router";
import { DigitalKta } from "@/features/members/digital-kta";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/members/$memberId/kta")({
  component: MembersKtaPage,
  head: () => pageHead("Digital KTA", "Official digital membership identity and verification status."),
  loader: ({ params }) => ({ memberId: params.memberId }),
});

function MembersKtaPage() {
  return <DigitalKta />;
}
