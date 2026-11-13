import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Building2, CalendarDays, MapPin, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { FilterBar, FilterChips, FilterSelect, SearchInput } from "@/components/ds/filter-bar";
import { EmptyState, ErrorState, LoadingState, PermissionState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { listCompetitions } from "@/data/repository";
import type { Competition, Status } from "@/data/types";
import { useRole } from "@/lib/role-context";
import { fmtDate } from "@/lib/format";

const lifecycleOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Upcoming" },
  { value: "draft", label: "Draft" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

const typeOptions = [
  { value: "all", label: "All types" },
  { value: "League", label: "League" },
  { value: "Festival", label: "Festival" },
  { value: "Cup", label: "Cup" },
  { value: "Tournament", label: "Tournament" },
] as const;

const locationOptions = [
  { value: "all", label: "All locations" },
  { value: "Makassar", label: "Makassar" },
  { value: "Sungguminasa", label: "Sungguminasa" },
  { value: "Maros", label: "Maros" },
] as const;

const GOVERNANCE_LABELS = {
  normal: "Normal",
  attention: "Attention required",
  "under-review": "Under review",
} as const;

const SOLID_STATUS: Record<string, Status> = {
  active: "active",
  pending: "pending",
  draft: "draft",
  completed: "completed",
  cancelled: "cancelled",
};

const lifecycleLabel = (status: Status) => {
  switch (status) {
    case "active":
      return "Active";
    case "pending":
      return "Upcoming";
    case "completed":
      return "Completed";
    case "draft":
      return "Draft";
    case "cancelled":
      return "Cancelled";
    default:
      return "Scheduled";
  }
};

function getOversightStatus(competition: Competition) {
  if (competition.status === "draft" || competition.name.toLowerCase().includes("gowa")) {
    return "attention";
  }
  if (competition.status === "cancelled") {
    return "under-review";
  }
  return "normal";
}

function getSignal(competition: Competition) {
  if (competition.status === "draft") return "Registration";
  if (competition.status === "cancelled") return "Compliance";
  if (competition.status === "active") return "Eligibility";
  return "Credential";
}

export function CompetitionOversight({
  loading = false,
  partialError = false,
}: {
  loading?: boolean;
  partialError?: boolean;
}) {
  const { role } = useRole();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof lifecycleOptions)[number]["value"]>("all");
  const [typeFilter, setTypeFilter] = useState<(typeof typeOptions)[number]["value"]>("all");
  const [locationFilter, setLocationFilter] = useState<(typeof locationOptions)[number]["value"]>("all");

  const allCompetitions = useMemo(() => {
    return listCompetitions().map((competition) => ({
      ...competition,
      governanceStatus: getOversightStatus(competition),
      governanceSignal: getSignal(competition),
    }));
  }, []);

  const filteredCompetitions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allCompetitions.filter((competition) => {
      const matchesQuery =
        !normalized ||
        competition.name.toLowerCase().includes(normalized) ||
        competition.organizer.toLowerCase().includes(normalized) ||
        competition.format.toLowerCase().includes(normalized);
      const matchesStatus = statusFilter === "all" || competition.status === statusFilter;
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "League" && competition.format.toLowerCase().includes("league")) ||
        (typeFilter === "Festival" && competition.format.toLowerCase().includes("festival")) ||
        (typeFilter === "Cup" && competition.format.toLowerCase().includes("cup")) ||
        (typeFilter === "Tournament" && competition.format.toLowerCase().includes("tournament"));
      const matchesLocation = locationFilter === "all" || competition.city === locationFilter;
      return matchesQuery && matchesStatus && matchesType && matchesLocation;
    });
  }, [allCompetitions, locationFilter, query, statusFilter, typeFilter]);

  const activeCompetitions = allCompetitions.filter((competition) => competition.status === "active").length;
  const upcomingCompetitions = allCompetitions.filter((competition) => competition.status === "pending").length;
  const requiresAttention = allCompetitions.filter((competition) => competition.governanceStatus !== "normal").length;
  const completedThisSeason = allCompetitions.filter((competition) => competition.status === "completed").length;

  const alerts = filteredCompetitions.filter((competition) => competition.governanceStatus !== "normal").slice(0, 3);
  const activeFilterSummary = [
    statusFilter !== "all" ? lifecycleOptions.find((item) => item.value === statusFilter)?.label : undefined,
    typeFilter !== "all" ? typeOptions.find((item) => item.value === typeFilter)?.label : undefined,
    locationFilter !== "all" ? locationOptions.find((item) => item.value === locationFilter)?.label : undefined,
  ].filter(Boolean) as string[];

  if (role !== "association" && role !== "org_admin") {
    return (
      <PermissionState
        title="Limited competition access"
        description="Some competition information is not available for your current role or Association scope."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Competition Oversight" description="Monitor competitions within your authorized Association scope." />
        <LoadingState rows={5} />
      </div>
    );
  }

  if (partialError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Competition Oversight" description="Monitor competitions within your authorized Association scope." />
        <ErrorState title="Attention data could not be loaded" description="Competition information is still available. Try again." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="South Sulawesi Association"
        title="Competition Oversight"
        description="Monitor competitions within your authorized Association scope."
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active competitions", value: activeCompetitions, icon: Trophy },
          { label: "Upcoming", value: upcomingCompetitions, icon: CalendarDays },
          { label: "Requires attention", value: requiresAttention, icon: AlertTriangle },
          { label: "Completed this season", value: completedThisSeason, icon: ShieldCheck },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="surface p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-label text-muted-foreground">{label}</div>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-foreground">{value}</div>
          </div>
        ))}
      </div>

      <section className="surface p-5 md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-label text-muted-foreground">Requires attention</div>
            <h2 className="text-h3">{alerts.length} competitions require governance review</h2>
          </div>
          <Button variant="outline" size="sm">
            View competitions <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {alerts.map((competition) => (
            <div key={competition.id} className="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-foreground">{competition.name}</div>
                  <div className="text-small text-muted-foreground">{competition.organizer} · {competition.city}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={SOLID_STATUS[competition.status] ?? "pending"} label={lifecycleLabel(competition.status)} />
                  <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/competitions/oversight/$competitionId", params: { competitionId: competition.id } })}>
                    Review
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="rounded-lg border border-dashed p-4 text-small text-muted-foreground">
              No competitions need governance attention right now.
            </div>
          )}
        </div>
      </section>

      <section className="surface p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterBar className="flex-1">
            <SearchInput value={query} onChange={setQuery} placeholder="Search competition or organizer" className="w-full lg:max-w-md" />
          </FilterBar>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-auto">
            <FilterSelect value={statusFilter} onChange={setStatusFilter} options={lifecycleOptions as any} placeholder="Status" className="sm:w-36" />
            <FilterSelect value={typeFilter} onChange={setTypeFilter} options={typeOptions as any} placeholder="Type" className="sm:w-36" />
            <FilterSelect value={locationFilter} onChange={setLocationFilter} options={locationOptions as any} placeholder="Location" className="sm:w-36" />
          </div>
        </div>

        {activeFilterSummary.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-small text-muted-foreground">Showing {filteredCompetitions.length} competitions</span>
            {activeFilterSummary.map((filter) => (
              <span key={filter} className="rounded-full border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                {filter}
              </span>
            ))}
            <button type="button" className="text-small font-medium text-primary" onClick={() => { setQuery(""); setStatusFilter("all"); setTypeFilter("all"); setLocationFilter("all"); }}>
              Clear all
            </button>
          </div>
        )}
      </section>

      <div className="surface overflow-hidden">
        {filteredCompetitions.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No competitions found" description="We couldn’t find competitions matching your search or filters." action={<Button variant="outline" size="sm" onClick={() => { setQuery(""); setStatusFilter("all"); setTypeFilter("all"); setLocationFilter("all"); }}>Clear filters</Button>} />
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/50 text-small text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Competition</th>
                    <th className="px-4 py-3 font-medium">Organizer</th>
                    <th className="px-4 py-3 font-medium">Period</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Oversight</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCompetitions.map((competition) => (
                    <tr key={competition.id} className="cursor-pointer transition-colors hover:bg-muted/30" onClick={() => navigate({ to: "/competitions/oversight/$competitionId", params: { competitionId: competition.id } })}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                            <Trophy className="size-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{competition.name}</div>
                            <div className="text-small text-muted-foreground">{competition.categories[0]?.label ?? "Youth"} · {competition.city}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{competition.organizer}</td>
                      <td className="px-4 py-3 text-muted-foreground">{fmtDate(competition.start, "d MMM")} – {fmtDate(competition.end, "d MMM yyyy")}</td>
                      <td className="px-4 py-3"><StatusBadge status={SOLID_STATUS[competition.status] ?? "pending"} label={lifecycleLabel(competition.status)} /></td>
                      <td className="px-4 py-3">
                        <StatusBadge status={competition.governanceStatus === "attention" ? "pending" : competition.governanceStatus === "under-review" ? "draft" : "active"} label={GOVERNANCE_LABELS[competition.governanceStatus]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 md:hidden">
              {filteredCompetitions.map((competition) => (
                <button key={competition.id} type="button" className="rounded-xl border bg-card p-4 text-left" onClick={() => navigate({ to: "/competitions/oversight/$competitionId", params: { competitionId: competition.id } })}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-foreground">{competition.name}</div>
                      <div className="mt-1 text-small text-muted-foreground">{competition.organizer}</div>
                    </div>
                    <StatusBadge status={competition.governanceStatus === "attention" ? "pending" : competition.governanceStatus === "under-review" ? "draft" : "active"} label={GOVERNANCE_LABELS[competition.governanceStatus]} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-small text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" /> {fmtDate(competition.start, "d MMM")} – {fmtDate(competition.end, "d MMM yyyy")}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {competition.city}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <StatusBadge status={SOLID_STATUS[competition.status] ?? "pending"} label={lifecycleLabel(competition.status)} />
                    <span className="inline-flex items-center gap-1 text-small font-medium text-primary">Review <ArrowRight className="size-3.5" /></span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <section className="surface p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-h3">Governance signals</h2>
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-2.5 py-1 text-small text-muted-foreground">
            <Sparkles className="size-3.5" /> Future ready
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from(new Set(filteredCompetitions.map((competition) => competition.governanceSignal))).map((signal) => (
            <span key={signal} className="rounded-full border bg-card px-3 py-1.5 text-small font-medium text-foreground">
              {signal}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
