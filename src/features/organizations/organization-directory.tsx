import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, ShieldAlert, SlidersHorizontal, Sparkles, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { FilterSelect, SearchInput } from "@/components/ds/filter-bar";
import { EmptyState, ErrorState, LoadingState, PermissionState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { listOrganizations } from "@/data/repository";
import { useRole } from "@/lib/role-context";

const orgTypeOptions = [
  { value: "all", label: "All types" },
  { value: "SSB", label: "SSB" },
  { value: "Academy", label: "Academy" },
  { value: "Club", label: "Club" },
  { value: "Community", label: "Community" },
];

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "archived", label: "Archived" },
];

const locationOptions = [
  { value: "all", label: "All locations" },
  { value: "Makassar", label: "Makassar" },
  { value: "Gowa", label: "Gowa" },
  { value: "Maros", label: "Maros" },
  { value: "Rantepao", label: "Rantepao" },
];

const mockOrganizations = [
  { id: "garuda", name: "SSB Garuda Makassar", type: "SSB", city: "Makassar", province: "South Sulawesi", registration: "ORG-SS-00124", status: "Active", verification: "Verified", attention: false },
  { id: "phinisi", name: "Akademi Phinisi Muda", type: "Academy", city: "Makassar", province: "South Sulawesi", registration: "ORG-SS-00131", status: "Active", verification: "Verified", attention: false },
  { id: "gowa", name: "Gowa Football Academy", type: "Academy", city: "Gowa", province: "South Sulawesi", registration: "ORG-SS-00098", status: "Pending", verification: "Pending", attention: true },
  { id: "alpha", name: "SSB Alpha Maros", type: "SSB", city: "Maros", province: "South Sulawesi", registration: "ORG-SS-00107", status: "Active", verification: "Verified", attention: false },
  { id: "toraja", name: "SSB Toraja Raya", type: "SSB", city: "Rantepao", province: "South Sulawesi", registration: "ORG-SS-00092", status: "Active", verification: "Verified", attention: false },
  { id: "losari", name: "SSB Losari Putra", type: "SSB", city: "Makassar", province: "South Sulawesi", registration: "ORG-SS-00081", status: "Review", verification: "Pending", attention: true },
];

export function OrganizationDirectory({
  loading = false,
  partialError = false,
  empty = false,
}: {
  loading?: boolean;
  partialError?: boolean;
  empty?: boolean;
}) {
  const navigate = useNavigate();
  const { role } = useRole();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const visibleOrganizations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mockOrganizations.filter((org) => {
      const matchQuery =
        !normalized ||
        org.name.toLowerCase().includes(normalized) ||
        org.registration.toLowerCase().includes(normalized) ||
        org.city.toLowerCase().includes(normalized) ||
        org.province.toLowerCase().includes(normalized);
      const matchType = typeFilter === "all" || org.type === typeFilter;
      const matchStatus = statusFilter === "all" || org.status.toLowerCase() === statusFilter.toLowerCase();
      const matchLocation = locationFilter === "all" || org.city === locationFilter;
      return matchQuery && matchType && matchStatus && matchLocation;
    });
  }, [locationFilter, query, statusFilter, typeFilter]);

  const filterSummary = [
    typeFilter !== "all" ? orgTypeOptions.find((option) => option.value === typeFilter)?.label : undefined,
    statusFilter !== "all" ? statusOptions.find((option) => option.value === statusFilter)?.label : undefined,
    locationFilter !== "all" ? locationOptions.find((option) => option.value === locationFilter)?.label : undefined,
  ].filter(Boolean) as string[];

  if (role !== "association") {
    return (
      <PermissionState
        title="Access limited"
        description="This organization directory is reserved for authorized Association roles."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Organizations" description="Discover and monitor authorized organizations within your Association scope." />
        <LoadingState rows={5} />
      </div>
    );
  }

  if (partialError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Organizations" description="Discover and monitor authorized organizations within your Association scope." />
        <ErrorState title="Organizations could not be loaded" description="Please check your connection and try again." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="South Sulawesi Association"
        title="Organizations"
        description="Discover and monitor authorized organizations within your Association scope."
        actions={<Button variant="outline" size="sm"><Sparkles className="size-4" /> Organization insights</Button>}
      />

      <div className="surface space-y-4 p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SearchInput value={query} onChange={setQuery} placeholder="Search by organization name or registration number" className="w-full" />
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end lg:w-auto">
            <FilterSelect value={typeFilter} onChange={setTypeFilter} placeholder="Organization type" options={orgTypeOptions} className="sm:w-44" />
            <FilterSelect value={statusFilter} onChange={setStatusFilter} placeholder="Status" options={statusOptions} className="sm:w-36" />
            <FilterSelect value={locationFilter} onChange={setLocationFilter} placeholder="Location" options={locationOptions} className="sm:w-36" />
            <Button variant="outline" size="sm" className="sm:w-auto">
              <SlidersHorizontal className="size-4" /> More filters
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex flex-wrap items-center gap-2 text-small text-muted-foreground">
            <span className="font-semibold text-foreground">Showing {visibleOrganizations.length} organizations</span>
            {filterSummary.length > 0 && <span>·</span>}
            {filterSummary.map((label) => (
              <span key={label} className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                {label}
                <button type="button" aria-label={`Clear ${label}`} onClick={() => setStatusFilter("all")} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
          {filterSummary.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setTypeFilter("all"); setStatusFilter("all"); setLocationFilter("all"); }}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      <section className="surface overflow-hidden rounded-lg">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <div className="text-label text-primary">Organization overview</div>
            <h2 className="text-sm font-semibold text-foreground">Active filters</h2>
          </div>
          <Button variant="ghost" size="sm">Bulk actions</Button>
        </div>

        {empty ? (
          <div className="p-5">
            <EmptyState
              icon={UserRound}
              title="No organizations available"
              description="Organizations will appear here when they are registered or become available within your authorized Association scope."
            />
          </div>
        ) : visibleOrganizations.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Search}
              title="No organizations found"
              description="We couldn't find organizations matching your search or filters."
              action={<Button variant="outline" size="sm" onClick={() => { setQuery(""); setTypeFilter("all"); setStatusFilter("all"); setLocationFilter("all"); }}>Clear filters</Button>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-muted/50 text-small text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Organization</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visibleOrganizations.map((org) => (
                  <tr
                    key={org.id}
                    className="cursor-pointer align-middle hover:bg-muted/40"
                    onClick={() => navigate({ to: "/organizations/$orgId", params: { orgId: org.id } })}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10"><AvatarFallback>{org.name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</AvatarFallback></Avatar>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-foreground">{org.name}</div>
                          <div className="text-small text-muted-foreground">{org.registration}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{org.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{org.city}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={org.verification === "Verified" ? "verified" : org.verification === "Pending" ? "pending" : "archived"} label={org.status} />
                        {org.attention && <ShieldAlert className="size-4 text-warning" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
