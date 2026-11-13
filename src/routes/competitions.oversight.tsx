import { createFileRoute } from "@tanstack/react-router";
import { CompetitionOversight } from "@/features/competitions/competition-oversight";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/competitions/oversight")({
  head: () => pageHead("Competition Oversight", "Monitor authorized competitions and governance context within your Association scope."),
  component: CompetitionOversightPage,
});

function CompetitionOversightPage() {
  return <CompetitionOversight />;
}
