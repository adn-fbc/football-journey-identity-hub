import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, ShieldAlert, SlidersHorizontal, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { FilterSelect, SearchInput } from "@/components/ds/filter-bar";
import { EmptyState, ErrorState, LoadingState, PermissionState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { listOrganizations } from "@/data/repository";
import { useRole } from "@/lib/role-context";

const MEMBER_STATUS_LOOKUP = {
  active: "active",
  pending: "pending",
  inactive: "archived",
  expired: "cancelled",
  suspended: "archived",
} as const;

const roleOptions = [
  { value: "all", label: "All roles" },
  { value: "player", label: "Player" },
  { value: "coach", label: "Coach" },
  { value: "referee", label: "Referee" },
  { value: "official", label: "Official" },
];

const statusOptions = [
  { value: "all", label: "All membership statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending Review" },
  { value: "inactive", label: "Inactive" },
  { value: "expired", label: "Expired" },
  { value: "suspended", label: "Suspended" },
];

const credentialOptions = [
  { value: "all", label: "All credential statuses" },
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "expiring", label: "Expiring soon" },
  { value: "expired", label: "Expired" },
];

const orgOptions = [
  { value: "all", label: "All organizations" },
  ...listOrganizations().map((org) => ({ value: org.id, label: org.name })),
];

const mockMembers = [
  { id: "p-001", name: "Muhammad Rizky Pratama", footballId: "IDN-FB-2016-000123", memberNumber: "APSSI-00000124", roles: ["Player", "Coach"], membership: "active", organization: "SSB Garuda Makassar", credential: "verified", verification: "verified", status: "Active", attention: false },
  { id: "p-002", name: "Andi Fadhil Ramadhan", footballId: "IDN-FB-2016-000284", memberNumber: "APSSI-00000145", roles: ["Coach"], membership: "active", organization: "SSB Garuda Makassar", credential: "expiring", verification: "verified", status: "Active", attention: true },
  { id: "p-003", name: "Arya Wicaksono", footballId: "IDN-FB-2018-000882", memberNumber: "APSSI-00000186", roles: ["Player"], membership: "pending", organization: "Garuda U10 Academy", credential: "pending", verification: "pending", status: "Pending Review", attention: true },
  { id: "p-004", name: "Sulaeman Hadi", footballId: "IDN-FB-2015-001114", memberNumber: "APSSI-00000251", roles: ["Referee"], membership: "active", organization: "South Sulawesi Referee Academy", credential: "verified", verification: "verified", status: "Active", attention: false },
  { id: "p-005", name: "Rizki Mardiansyah", footballId: "IDN-FB-2017-000512", memberNumber: "APSSI-00000390", roles: ["Coach"], membership: "expired", organization: "Gowa Football Academy", credential: "expired", verification: "pending", status: "Expired", attention: true },
  { id: "p-006", name: "Aldo Pratama", footballId: "IDN-FB-2014-000990", memberNumber: "APSSI-00000426", roles: ["Official"], membership: "active", organization: "Makassar Youth League", credential: "verified", verification: "verified", status: "Active", attention: false },
];

export function MemberDirectory({
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
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [credentialFilter, setCredentialFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState("all");

  const visibleMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mockMembers.filter((member) => {
      const matchQuery =
        !normalized ||
        member.name.toLowerCase().includes(normalized) ||
        member.memberNumber.toLowerCase().includes(normalized) ||
        member.footballId.toLowerCase().includes(normalized) ||
        member.organization.toLowerCase().includes(normalized);
      const matchRole = roleFilter === "all" || member.roles.some((memberRole) => memberRole.toLowerCase() === roleFilter.toLowerCase());
      const matchStatus = statusFilter === "all" || member.membership === statusFilter;
      const matchCredential = credentialFilter === "all" || member.credential === credentialFilter;
      const matchOrg = orgFilter === "all" || member.organization === orgOptions.find((option) => option.value === orgFilter)?.label;
      return matchQuery && matchRole && matchStatus && matchCredential && matchOrg;
    });
  }, [credentialFilter, orgFilter, query, roleFilter, statusFilter]);

  const activeFilters = [
    roleFilter !== "all" ? { key: "role", label: roleOptions.find((option) => option.value === roleFilter)?.label, clear: () => setRoleFilter("all") } : null,
    statusFilter !== "all" ? { key: "membership", label: statusOptions.find((option) => option.value === statusFilter)?.label, clear: () => setStatusFilter("all") } : null,
    credentialFilter !== "all" ? { key: "credential", label: credentialOptions.find((option) => option.value === credentialFilter)?.label, clear: () => setCredentialFilter("all") } : null,
    orgFilter !== "all" ? { key: "organization", label: orgOptions.find((option) => option.value === orgFilter)?.label, clear: () => setOrgFilter("all") } : null,
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const clearAllFilters = () => {
    setQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCredentialFilter("all");
    setOrgFilter("all");
  };

  if (role !== "association") {
    return (
      <PermissionState
        title="Limited directory access"
        description="This member directory is reserved for authorized Association roles."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Member directory" description="Find and review members within your authorized Association scope." />
        <LoadingState rows={5} />
      </div>
    );
  }

  if (partialError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Member directory" description="Find and review members within your authorized Association scope." />
        <ErrorState title="Member directory could not be loaded" description="Some member information is unavailable right now." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="South Sulawesi Association"
        title="Member directory"
        description="Find and review members within your authorized Association scope."
      />

      <div className="surface p-4 md:p-5">
        <div className="text-label text-muted-foreground">Current scope</div>
        <div className="mt-1 text-h3">APSSI South Sulawesi</div>
      </div>

      <div className="surface space-y-4 p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SearchInput value={query} onChange={setQuery} placeholder="Search member name or Member Number" className="w-full" />
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end lg:w-auto">
            <FilterSelect value={roleFilter} onChange={setRoleFilter} placeholder="Role" options={roleOptions} className="sm:w-32" />
            <FilterSelect value={statusFilter} onChange={setStatusFilter} placeholder="Membership status" options={statusOptions} className="sm:w-44" />
            <FilterSelect value={credentialFilter} onChange={setCredentialFilter} placeholder="Credential status" options={credentialOptions} className="sm:w-44" />
            <FilterSelect value={orgFilter} onChange={setOrgFilter} placeholder="Organization" options={orgOptions} className="sm:w-44" />
            <Button type="button" variant="outline" size="sm" className="sm:w-auto">
              <SlidersHorizontal className="size-4" /> More filters
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex flex-wrap items-center gap-2 text-small text-muted-foreground">
            <span className="font-semibold text-foreground">Showing {visibleMembers.length} members</span>
            {activeFilters.length > 0 && <span>·</span>}
            {activeFilters.map((filter) => (
              <span key={filter.key} className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                {filter.label}
                <button type="button" aria-label={`Clear ${filter.label}`} onClick={filter.clear} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>Clear all</Button>
          )}
        </div>
      </div>

      <section className="surface overflow-hidden rounded-lg">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <div className="text-label text-primary">Member overview</div>
            <h2 className="text-sm font-semibold text-foreground">Active filters</h2>
          </div>
          <div className="text-small text-muted-foreground">{visibleMembers.length} matches</div>
        </div>

        {empty ? (
          <div className="p-5">
            <EmptyState
              icon={UserRound}
              title="No members available in your current scope"
              description="Member records will appear here when they are authorized within your current Association scope."
            />
          </div>
        ) : visibleMembers.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Search}
              title="No members found"
              description="We couldn't find members matching your search or active filters."
              action={<Button variant="outline" size="sm" onClick={clearAllFilters}>Clear filters</Button>}
            />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/50 text-small text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium">Member Number</th>
                    <th className="px-4 py-3 font-medium">Primary Role</th>
                    <th className="px-4 py-3 font-medium">Membership</th>
                    <th className="px-4 py-3 font-medium">Attention</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visibleMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="cursor-pointer align-middle hover:bg-muted/40"
                      onClick={() => navigate({ to: "/members/$memberId", params: { memberId: member.id } })}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10"><AvatarFallback>{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</AvatarFallback></Avatar>
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-foreground">{member.name}</div>
                            <div className="text-small text-muted-foreground">{member.footballId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{member.memberNumber}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border bg-background px-2 py-1 text-[11px] font-medium text-foreground">{member.roles[0]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={MEMBER_STATUS_LOOKUP[member.membership as keyof typeof MEMBER_STATUS_LOOKUP] ?? "active"} label={member.status} />
                      </td>
                      <td className="px-4 py-3">
                        {member.attention ? (
                          <div className="flex items-center gap-2 text-warning">
                            <ShieldAlert className="size-4" />
                            <span className="text-small font-medium">Review required</span>
                          </div>
                        ) : (
                          <span className="text-small text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {visibleMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => navigate({ to: "/members/$memberId", params: { memberId: member.id } })}
                  className="w-full rounded-lg border bg-card p-3 text-left shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10"><AvatarFallback>{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</AvatarFallback></Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-foreground">{member.name}</div>
                      <div className="mt-1 text-small text-muted-foreground">{member.memberNumber}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-small text-muted-foreground">
                    <span className="rounded-full border bg-background px-2 py-1 text-[11px] font-medium text-foreground">{member.roles[0]}</span>
                    <StatusBadge status={MEMBER_STATUS_LOOKUP[member.membership as keyof typeof MEMBER_STATUS_LOOKUP] ?? "active"} label={member.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-small text-muted-foreground">{member.footballId}</span>
                    {member.attention ? (
                      <div className="flex items-center gap-1 text-warning">
                        <ShieldAlert className="size-4" />
                        <span className="text-[11px] font-medium">Review</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">No attention</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
