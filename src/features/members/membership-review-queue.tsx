import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CalendarClock, FileText, Inbox, Search, ShieldAlert, SlidersHorizontal, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { SearchInput, FilterSelect } from "@/components/ds/filter-bar";
import { EmptyState, ErrorState, LoadingState, PermissionState } from "@/components/ds/states";
import { StatusBadge } from "@/components/ds/status-badge";
import { useRole } from "@/lib/role-context";

type ReviewTab = "Open" | "In Review" | "Waiting" | "Completed";
type ReviewType = "Membership Renewal" | "New Member" | "Information Update" | "Reinstatement";
type ReviewPriority = "High" | "Normal" | "Low";

type ReviewItem = {
  reviewId: string;
  reviewType: ReviewType;
  memberName: string;
  memberNumber: string;
  reviewStatus: ReviewTab;
  priority: ReviewPriority;
  submittedLabel: string;
  assignedTo: string;
  dueSoon: boolean;
};

const reviewTypes = [
  { value: "all", label: "All review types" },
  { value: "Membership Renewal", label: "Membership Renewal" },
  { value: "New Member", label: "New Member" },
  { value: "Information Update", label: "Information Update" },
  { value: "Reinstatement", label: "Reinstatement" },
];

const priorityOptions = [
  { value: "all", label: "All priorities" },
  { value: "High", label: "High" },
  { value: "Normal", label: "Normal" },
  { value: "Low", label: "Low" },
];

const assignmentOptions = [
  { value: "all", label: "All assignments" },
  { value: "Me", label: "Me" },
  { value: "Unassigned", label: "Unassigned" },
  { value: "Aisyah Rahma", label: "Aisyah Rahma" },
];

const dateOptions = [
  { value: "all", label: "All submitted dates" },
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
];

const mockReviews: ReviewItem[] = [
  { reviewId: "RV-000124", reviewType: "Membership Renewal", memberName: "Ahmad Rahman", memberNumber: "APSSI-00000124", reviewStatus: "Open", priority: "High", submittedLabel: "2 days ago", assignedTo: "Me", dueSoon: true },
  { reviewId: "RV-000125", reviewType: "New Member", memberName: "Budi Santoso", memberNumber: "APSSI-00000125", reviewStatus: "In Review", priority: "Normal", submittedLabel: "4 days ago", assignedTo: "Aisyah Rahma", dueSoon: false },
  { reviewId: "RV-000126", reviewType: "Information Update", memberName: "Rudi Permana", memberNumber: "APSSI-00000126", reviewStatus: "Waiting", priority: "Normal", submittedLabel: "1 week ago", assignedTo: "Unassigned", dueSoon: true },
  { reviewId: "RV-000127", reviewType: "Reinstatement", memberName: "Slamet Wijaya", memberNumber: "APSSI-00000127", reviewStatus: "Completed", priority: "Low", submittedLabel: "3 weeks ago", assignedTo: "Me", dueSoon: false },
  { reviewId: "RV-000128", reviewType: "Membership Renewal", memberName: "Dewi Lestari", memberNumber: "APSSI-00000128", reviewStatus: "Open", priority: "High", submittedLabel: "5 hours ago", assignedTo: "Me", dueSoon: true },
  { reviewId: "RV-000129", reviewType: "New Member", memberName: "Fajar Kurnia", memberNumber: "APSSI-00000129", reviewStatus: "Open", priority: "Normal", submittedLabel: "6 days ago", assignedTo: "Unassigned", dueSoon: false },
];

const tabOptions: ReviewTab[] = ["Open", "In Review", "Waiting", "Completed"];

const priorityClasses: Record<ReviewPriority, string> = {
  High: "border-destructive/20 bg-destructive/10 text-destructive",
  Normal: "border-info/20 bg-info/10 text-info",
  Low: "border-success/20 bg-success/10 text-success",
};

const statusClasses: Record<ReviewTab, string> = {
  Open: "border-warning/25 bg-warning/12 text-warning",
  "In Review": "border-info/20 bg-info/10 text-info",
  Waiting: "border-neutral/40 bg-muted text-muted-foreground",
  Completed: "border-success/20 bg-success/10 text-success",
};

function ReviewPriorityBadge({ priority }: { priority: ReviewPriority }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${priorityClasses[priority]}`}>
      {priority}
    </span>
  );
}

function ReviewStatusBadge({ status }: { status: ReviewTab }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  );
}

export function MembershipReviewQueue({
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
  const [activeTab, setActiveTab] = useState<ReviewTab>("Open");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const visibleReviews = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mockReviews.filter((review) => {
      const matchTab = review.reviewStatus === activeTab;
      const matchQuery =
        !normalized ||
        review.memberName.toLowerCase().includes(normalized) ||
        review.memberNumber.toLowerCase().includes(normalized) ||
        review.reviewId.toLowerCase().includes(normalized) ||
        review.reviewType.toLowerCase().includes(normalized);
      const matchType = typeFilter === "all" || review.reviewType === typeFilter;
      const matchPriority = priorityFilter === "all" || review.priority === priorityFilter;
      const matchAssignment = assignmentFilter === "all" || review.assignedTo === assignmentFilter;
      const matchDate = dateFilter === "all" || review.submittedLabel.includes("day") || review.submittedLabel.includes("hour");
      return matchTab && matchQuery && matchType && matchPriority && matchAssignment && matchDate;
    });
  }, [activeTab, assignmentFilter, dateFilter, priorityFilter, query, typeFilter]);

  const activeFilters = [
    typeFilter !== "all" ? { key: "type", label: reviewTypes.find((option) => option.value === typeFilter)?.label ?? "Type", clear: () => setTypeFilter("all") } : null,
    priorityFilter !== "all" ? { key: "priority", label: priorityOptions.find((option) => option.value === priorityFilter)?.label ?? "Priority", clear: () => setPriorityFilter("all") } : null,
    assignmentFilter !== "all" ? { key: "assignment", label: assignmentOptions.find((option) => option.value === assignmentFilter)?.label ?? "Assignment", clear: () => setAssignmentFilter("all") } : null,
    dateFilter !== "all" ? { key: "date", label: dateOptions.find((option) => option.value === dateFilter)?.label ?? "Date", clear: () => setDateFilter("all") } : null,
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const clearAllFilters = () => {
    setTypeFilter("all");
    setPriorityFilter("all");
    setAssignmentFilter("all");
    setDateFilter("all");
    setQuery("");
  };

  if (role !== "association") {
    return (
      <PermissionState
        title="Review access limited"
        description="You do not currently have access to membership reviews in this Association scope."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Membership review" description="Review and process membership requests within your authorized scope." />
        <LoadingState rows={6} />
      </div>
    );
  }

  if (partialError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Membership review" description="Review and process membership requests within your authorized scope." />
        <ErrorState title="Assignment information unavailable" description="Review items are still available, but some supporting assignment details could not be loaded." />
      </div>
    );
  }

  const openReviewsCount = mockReviews.filter((item) => item.reviewStatus === "Open").length;
  const highPriorityCount = mockReviews.filter((item) => item.priority === "High").length;
  const dueSoonCount = mockReviews.filter((item) => item.dueSoon).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="South Sulawesi Association"
        title="Membership review"
        description="Review and process membership requests within your authorized scope."
      />

      <div className="surface p-4 md:p-5">
        <div className="text-label text-muted-foreground">Current review scope</div>
        <div className="mt-1 text-h3">APSSI South Sulawesi</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Open reviews", value: openReviewsCount, action: () => setActiveTab("Open") },
          { label: "High priority", value: highPriorityCount, action: () => setPriorityFilter("High") },
          { label: "Due soon", value: dueSoonCount, action: () => setDateFilter("7d") },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className="surface flex items-center justify-between rounded-xl p-4 text-left transition hover:border-primary/40"
          >
            <div>
              <div className="text-label text-muted-foreground">{item.label}</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{item.value}</div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <div className="surface space-y-4 p-4 md:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex-1">
            <SearchInput value={query} onChange={setQuery} placeholder="Search member name, Member Number or Review ID" className="w-full" />
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end xl:w-auto">
            <FilterSelect value={typeFilter} onChange={setTypeFilter} placeholder="Review type" options={reviewTypes} className="sm:w-40" />
            <FilterSelect value={priorityFilter} onChange={setPriorityFilter} placeholder="Priority" options={priorityOptions} className="sm:w-32" />
            <FilterSelect value={assignmentFilter} onChange={setAssignmentFilter} placeholder="Assigned to" options={assignmentOptions} className="sm:w-40" />
            <FilterSelect value={dateFilter} onChange={setDateFilter} placeholder="Submitted" options={dateOptions} className="sm:w-36" />
            <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto">
              <SlidersHorizontal className="size-4" /> More filters
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex flex-wrap items-center gap-2 text-small text-muted-foreground">
            <span className="font-semibold text-foreground">Showing {visibleReviews.length} review items</span>
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

      <div className="surface overflow-hidden rounded-xl">
        <div className="flex flex-wrap gap-2 border-b p-3">
          {tabOptions.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {empty ? (
          <div className="p-5">
            <EmptyState
              icon={Inbox}
              title="No reviews require attention"
              description="There are currently no membership reviews within your authorized scope."
            />
          </div>
        ) : visibleReviews.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Search}
              title="No review items found"
              description="Try changing your search or filters."
              action={<Button variant="outline" size="sm" onClick={clearAllFilters}>Clear filters</Button>}
            />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-muted/50 text-small text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Review Item</th>
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium">Assigned</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visibleReviews.map((review) => (
                    <tr
                      key={review.reviewId}
                      className="cursor-pointer align-middle hover:bg-muted/40"
                      onClick={() => navigate({ to: "/members/review/$reviewId", params: { reviewId: review.reviewId } })}
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-foreground">{review.reviewId}</div>
                        <div className="text-small text-muted-foreground">{review.reviewType}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-foreground">{review.memberName}</div>
                        <div className="text-small text-muted-foreground">{review.memberNumber}</div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{review.reviewType}</td>
                      <td className="px-4 py-4"><ReviewPriorityBadge priority={review.priority} /></td>
                      <td className="px-4 py-4"><ReviewStatusBadge status={review.reviewStatus} /></td>
                      <td className="px-4 py-4 text-muted-foreground">{review.submittedLabel}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <UserRound className="size-4" />
                          <span>{review.assignedTo}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-3 md:hidden">
              {visibleReviews.map((review) => (
                <div key={review.reviewId} className="rounded-xl border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-small font-semibold uppercase tracking-wide text-muted-foreground">{review.reviewType}</div>
                      <div className="mt-1 font-semibold text-foreground">{review.memberName}</div>
                    </div>
                    <ReviewPriorityBadge priority={review.priority} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-small text-muted-foreground">
                    <span>{review.memberNumber}</span>
                    <ReviewStatusBadge status={review.reviewStatus} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-small text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><CalendarClock className="size-4" /> {review.submittedLabel}</span>
                    <span className="inline-flex items-center gap-1"><FileText className="size-4" /> {review.reviewId}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-small text-muted-foreground"><UserRound className="size-4" /> {review.assignedTo}</span>
                    <Button variant="outline" size="sm" onClick={() => navigate({ to: "/members/review/$reviewId", params: { reviewId: review.reviewId } })}>Open review</Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {!empty && visibleReviews.length > 0 && (
        <div className="flex items-center justify-center">
          <Button variant="outline" size="sm">
            Load more
          </Button>
        </div>
      )}

      {visibleReviews.some((review) => review.dueSoon) && !empty && 
        <div className="surface flex items-start gap-3 rounded-xl p-4">
          <ShieldAlert className="mt-0.5 size-4 text-warning" />
          <div>
            <div className="font-semibold text-foreground">Due soon</div>
            <p className="text-small text-muted-foreground">Some review items require attention within the next 7 days.</p>
          </div>
        </div>
      }

      {partialError && (
        <div className="surface bg-warning/5 border border-warning/20 rounded-xl p-4 text-small text-warning-foreground">
          <div className="flex items-center gap-2"><AlertTriangle className="size-4" /> Assignment information unavailable</div>
        </div>
      )}
    </div>
  );
}
