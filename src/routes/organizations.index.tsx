import { createFileRoute } from "@tanstack/react-router";
import { OrganizationDirectory } from "@/features/organizations/organization-directory";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/organizations/")({
  head: () => pageHead("Organizations", "Association organization discovery and oversight within scope."),
  component: OrganizationsPage,
});

function OrganizationsPage() {
  return <OrganizationDirectory />;
}
