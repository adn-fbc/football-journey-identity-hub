import { createFileRoute } from "@tanstack/react-router";
import { ModuleRoadmapPage } from "@/features/modules/module-roadmap-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/modules/")({
  head: () => pageHead("Product roadmap", "Upcoming Football ID modules for clubs, families, coaches, referees, scouts and associations."),
  component: ModuleRoadmapPage,
});
