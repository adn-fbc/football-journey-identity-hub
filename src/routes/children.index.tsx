import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { EmptyState } from "@/components/ds/states";
import { listCurrentGuardianChildren } from "@/data/repository";
import { ChildCard } from "@/features/children/child-card";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/children/")({
  loader: () => ({ children: listCurrentGuardianChildren() }),
  head: () => pageHead("My Children", "See your children's teams, schedules, attendance and football journey — and control their consent."),
  component: ChildrenPage,
});

function ChildrenPage() {
  const { children } = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Guardian"
        title="My Children"
        description="You manage each child's Football ID until they turn 18. Nothing is shared without your consent."
        actions={<Button variant="outline" onClick={() => toast("Add child — start a new Football ID (prototype)")}><UserPlus /> Add child</Button>}
      />
      {children.length ? (
        <div className="grid gap-4 md:grid-cols-2">{children.map((child) => <ChildCard key={child.id} child={child} />)}</div>
      ) : <EmptyState title="No children linked yet" description="Children linked to your guardian relationship will appear here." />}
    </div>
  );
}
