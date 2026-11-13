import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { EmptyState, PermissionState } from "@/components/ds/states";
import { listCurrentGuardianChildren } from "@/data/repository";
import { ChildCard } from "@/features/children/child-card";
import { useRole } from "@/lib/role-context";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/children/")({
  loader: () => null,
  head: () => pageHead("My Children", "Review child identity and consent-scoped information."),
  component: ChildrenPage,
});

function ChildrenPage() {
  const { role, ready } = useRole();
  if (!ready || role !== "parent") {
    return <PermissionState title="Parent workspace only" description="Resolve the Parent / Guardian workspace before requesting child data." />;
  }
  const children = listCurrentGuardianChildren();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Guardian"
        title="My Children"
        description="Child information is limited by separate relationship and category grants."
        actions={<Button variant="outline" onClick={() => toast("Add child — start a new Football ID (prototype)")}><UserPlus /> Add child</Button>}
      />
      {children.length ? (
        <div className="grid gap-4 md:grid-cols-2">{children.map((child) => <ChildCard key={child.id} child={child} />)}</div>
      ) : <EmptyState title="No children linked yet" description="Children linked to your guardian relationship will appear here." />}
    </div>
  );
}
