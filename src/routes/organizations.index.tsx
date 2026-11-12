import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { OrgCard } from "@/components/ds/org-card";
import { FilterBar, FilterSelect, SearchInput } from "@/components/ds/filter-bar";
import { EmptyState } from "@/components/ds/states";
import { listOrganizations } from "@/data/repository";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/organizations/")({
  head: () => pageHead("Organizations", "Football schools, academies and clubs across South Sulawesi."),
  component: OrganizationsPage,
});

function OrganizationsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const orgs = listOrganizations().filter((o) => (type === "all" || o.type === type) && o.name.toLowerCase().includes(q.toLowerCase()));
  const mine = orgs.filter((o) => o.id === "garuda");
  const others = orgs.filter((o) => o.id !== "garuda");
  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizations"
        description="SSBs, academies and clubs in the ecosystem. Players connect to organizations — they're never owned by them."
        actions={<Button variant="outline" onClick={() => toast("Organization onboarding (prototype)")}><Plus /> Register organization</Button>}
      />
      <FilterBar>
        <SearchInput value={q} onChange={setQ} placeholder="Search organizations" className="sm:w-72" />
        <FilterSelect value={type} onChange={setType} placeholder="Type" options={[{ value: "all", label: "All types" }, { value: "SSB", label: "SSB" }, { value: "Academy", label: "Academy" }, { value: "Club", label: "Club" }]} />
      </FilterBar>
      {mine.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-label text-muted-foreground">Your organization</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{mine.map((o) => <OrgCard key={o.id} org={o} />)}</div>
        </div>
      )}
      <div className="space-y-3">
        <h2 className="text-label text-muted-foreground">Directory</h2>
        {others.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{others.map((o) => <OrgCard key={o.id} org={o} />)}</div>
        ) : (
          <EmptyState title="No organizations found" description="Try another name or type." />
        )}
      </div>
    </div>
  );
}
