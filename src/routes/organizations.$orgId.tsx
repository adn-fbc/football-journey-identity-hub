import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ds/states";
import { getOrganization } from "@/data/repository";
import { pageHead } from "@/lib/seo";
import { z } from "zod";
import { OrganizationDetail } from "@/features/organizations/organization-detail";
import { ORGANIZATION_WORKSPACE_VIEWS } from "@/features/organizations/organization-workspace.types";

const organizationSearch = z.object({
  view: z.enum(ORGANIZATION_WORKSPACE_VIEWS).optional(),
});

export const Route = createFileRoute("/organizations/$orgId")({
  loader: ({ params }) => {
    const org = getOrganization(params.orgId);
    if (!org) throw notFound();
    return { org };
  },
  validateSearch: organizationSearch,
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(loaderData.org.name, loaderData.org.description)
      : { meta: [{ title: "Unavailable · Football ID" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <EmptyState
      title="Organization not found"
      action={
        <Button asChild variant="outline">
          <Link to="/organizations">Back</Link>
        </Button>
      }
    />
  ),
  component: OrgDashboard,
});

function OrgDashboard() {
  const { org } = Route.useLoaderData();

  return <OrganizationDetail organization={org} />;
}
