import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { guardians } from "@/data/mock";
import { getPlayer } from "@/data/repository";
import type { Player } from "@/data/types";
import { ChildCard } from "@/features/children/child-card";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/children/")({
  head: () => pageHead("My Children", "See your children's teams, schedules, attendance and football journey — and control their consent."),
  component: ChildrenPage,
});

function ChildrenPage() {
  const kids = (guardians[0]?.childIds ?? []).map((id) => getPlayer(id)).filter(Boolean) as Player[];
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Guardian"
        title="My Children"
        description="You manage each child's Football ID until they turn 18. Nothing is shared without your consent."
        actions={<Button variant="outline" onClick={() => toast("Add child — start a new Football ID (prototype)")}><UserPlus /> Add child</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2">{kids.map((c) => <ChildCard key={c.id} child={c} />)}</div>
    </div>
  );
}
