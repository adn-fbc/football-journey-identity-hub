import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ds/states";
import { getModule } from "@/config/modules";
import { getBlueprint } from "@/config/module-blueprints";
import { ModuleBlueprintPage } from "@/features/modules/module-blueprint-page";
import { pageHead } from "@/lib/seo";

/** Blueprint page for every future module registered in config/modules.ts with status "soon". */
export const Route = createFileRoute("/modules/$moduleId")({
  loader: ({ params }) => {
    const mod = getModule(params.moduleId);
    if (!mod || mod.status !== "soon" || !getBlueprint(mod.id)) throw notFound();
    return { id: mod.id };
  },
  head: ({ loaderData }) => {
    const mod = loaderData ? getModule(loaderData.id) : undefined;
    const bp = loaderData ? getBlueprint(loaderData.id) : undefined;
    return mod && bp
      ? pageHead(`${mod.title} (coming soon)`, bp.summary)
      : { meta: [{ title: "Unavailable · Football ID" }, { name: "robots", content: "noindex" }] };
  },
  notFoundComponent: () => (
    <EmptyState
      title="Module not found"
      action={<Button asChild variant="outline"><Link to="/modules">See the roadmap</Link></Button>}
    />
  ),
  component: ModuleRoute,
});

function ModuleRoute() {
  const { id } = Route.useLoaderData();
  return <ModuleBlueprintPage module={getModule(id)!} blueprint={getBlueprint(id)!} />;
}
