import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "@/features/analytics/analytics-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/analytics")({
  head: () => pageHead("Analytics (preview)", "Membership, retention, attendance and competition insights for the organizations and competitions you manage."),
  component: AnalyticsPage,
});
