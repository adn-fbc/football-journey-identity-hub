import { createFileRoute } from "@tanstack/react-router";
import { IdentityOnboarding } from "@/features/identity/identity-onboarding";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/identity")({
  head: () =>
    pageHead(
      "Identity setup",
      "Create a Football ID preview and select the roles that belong to one person.",
    ),
  component: IdentityRoute,
});

function IdentityRoute() {
  return <IdentityOnboarding />;
}
