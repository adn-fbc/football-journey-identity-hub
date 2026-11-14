import { createFileRoute } from "@tanstack/react-router";
import { AssociationPage } from "@/features/association/association-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/association")({
  head: () => pageHead("Association (preview)", "Organization registration, renewals and competition sanctioning with a provincial football association."),
  component: AssociationPage,
});
