import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { DataTable, type Column } from "@/components/ds/data-table";
import { FilterChips } from "@/components/ds/filter-bar";
import { StatusBadge } from "@/components/ds/status-badge";
import { listCompetitions } from "@/data/repository";
import type { Competition, Status } from "@/data/types";
import { fmtDate } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/competitions/")({
  head: () => pageHead("Competitions", "Youth tournaments, festivals and leagues — categories, teams, schedules and standings."),
  component: CompetitionsPage,
});

const STATUS_LABEL: Partial<Record<Status, string>> = { active: "In progress", pending: "Registration open" };
const teamsIn = (c: Competition) => c.categories.reduce((s, k) => s + k.teamIds.length, 0);

function CompetitionsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"all" | Status>("all");
  const all = listCompetitions();
  const rows = all.filter((c) => status === "all" || c.status === status);

  const columns: Column<Competition>[] = [
    { key: "name", header: "Competition", cell: (c) => <div><div className="font-semibold">{c.name}</div><div className="text-small text-muted-foreground">{c.organizer}</div></div> },
    { key: "status", header: "Status", cell: (c) => <StatusBadge status={c.status} label={STATUS_LABEL[c.status]} /> },
    { key: "cats", header: "Categories", cell: (c) => <div className="flex flex-wrap gap-1">{c.categories.map((k) => <span key={k.id} className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold">{k.label}</span>)}</div>, hideBelow: "md" },
    { key: "teams", header: "Teams", cell: (c) => <span className="tabular-nums font-semibold">{teamsIn(c) || "—"}</span>, hideBelow: "md" },
    { key: "dates", header: "Dates", cell: (c) => <span className="whitespace-nowrap text-muted-foreground">{fmtDate(c.start, "d MMM")} – {fmtDate(c.end, "d MMM yyyy")}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Competitions"
        description="Tournaments, festivals and leagues across South Sulawesi."
        actions={<Button onClick={() => toast("Create competition (prototype)")}><Plus /> New competition</Button>}
      />
      <FilterChips
        value={status}
        onChange={setStatus}
        options={[
          { value: "all", label: "All", count: all.length },
          { value: "active", label: "In progress" },
          { value: "pending", label: "Registration open" },
          { value: "draft", label: "Draft" },
          { value: "completed", label: "Completed" },
          { value: "cancelled", label: "Cancelled" },
        ]}
      />
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(c) => c.id}
        onRowClick={(c) => navigate({ to: "/competitions/$competitionId", params: { competitionId: c.id } })}
        mobileRow={(c) => (
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2"><span className="text-sm font-semibold">{c.name}</span><StatusBadge status={c.status} label={STATUS_LABEL[c.status]} /></div>
            <div className="text-small text-muted-foreground">{fmtDate(c.start, "d MMM")} – {fmtDate(c.end, "d MMM yyyy")} · {c.categories.map((k) => k.label).join(", ")} · {teamsIn(c)} teams</div>
          </div>
        )}
      />
    </div>
  );
}
