import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BellRing, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ds/states";
import { getModule } from "@/config/modules";
import { pageHead } from "@/lib/seo";

/** Placeholder route for every future module registered in config/modules.ts with status "soon". */
export const Route = createFileRoute("/modules/$moduleId")({
  loader: ({ params }) => {
    const mod = getModule(params.moduleId);
    if (!mod || mod.status !== "soon") throw notFound();
    return { id: mod.id };
  },
  head: ({ loaderData }) => {
    const mod = loaderData ? getModule(loaderData.id) : undefined;
    return mod ? pageHead(mod.title, `${mod.description} — coming soon to Football ID.`) : { meta: [{ title: "Unavailable · Football ID" }, { name: "robots", content: "noindex" }] };
  },
  notFoundComponent: () => <EmptyState title="Module not found" action={<Button asChild variant="outline"><Link to="/">Go to overview</Link></Button>} />,
  component: ModulePlaceholder,
});

const PLANNED: Record<string, string[]> = {
  training: ["Session planner & drill library", "Assign sessions to teams", "Share plans with assistant coaches"],
  attendance: ["One-tap check-in at the pitch", "Attendance trends per player", "Automatic guardian notifications"],
  development: ["Skill goals per player", "Coach progress notes", "Season reviews shared with guardians"],
  finance: ["Membership fees & invoices", "Digital payments", "Club income reports"],
  coach: ["Coaching licences on your Football ID", "Coaching career history", "Courses & certifications"],
  referee: ["Match assignments", "Digital match reports", "Referee assessments"],
  scouting: ["Consent-based talent discovery", "Verified scout accounts", "Guardian-approved contact"],
  opportunities: ["Trials and selection camps", "Scholarships", "Applications with your Football ID"],
  analytics: ["Club & competition insights", "Player pathway analytics", "Exportable reports"],
  association: ["Regional club registry", "Competition sanctioning", "Licensing"],
  federation: ["National player registry", "Transfers & eligibility", "Federation-wide reporting"],
  ai: ["Ask questions about your data", "Session & lineup suggestions", "Smart summaries for guardians"],
};

function ModulePlaceholder() {
  const { id } = Route.useLoaderData();
  const mod = getModule(id)!;
  return (
    <div className="mx-auto max-w-2xl py-6 text-center md:py-12">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-ink text-signal shadow-elevated"><mod.icon className="size-7" /></span>
      <div className="mt-6 text-label text-primary">Coming soon</div>
      <h1 className="mt-2 text-h1">{mod.title}</h1>
      <p className="mt-2 text-body text-muted-foreground">{mod.description}. This module will plug into the same Football ID, roles and navigation you use today.</p>
      <ul className="surface mx-auto mt-8 max-w-md divide-y text-left">
        {(PLANNED[mod.id] ?? []).map((p) => (
          <li key={p} className="flex items-center gap-3 px-5 py-3 text-sm"><Check className="size-4 text-primary" />{p}</li>
        ))}
      </ul>
      <Button className="mt-8" onClick={() => toast.success("We'll let you know", { description: `${mod.title} early access` })}><BellRing /> Notify me</Button>
    </div>
  );
}
