import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { DataTable, type Column } from "@/components/ds/data-table";
import { FilterBar, FilterChips, FilterSelect, SearchInput } from "@/components/ds/filter-bar";
import { PersonAvatar } from "@/components/ds/avatars";
import { StatusBadge } from "@/components/ds/status-badge";
import { VerifiedMark } from "@/components/ds/football-id";
import { EmptyState } from "@/components/ds/states";
import { getTeam, listPlayers, listTeams } from "@/data/repository";
import type { Player } from "@/data/types";
import { ageCategoryFor, fmtDate } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/players/")({
  head: () => pageHead("Players", "Players with a current relationship with your organization — search, filter and review memberships."),
  component: PlayersPage,
});

const ORG_ID = "garuda";
type StatusFilter = "all" | "active" | "pending" | "archived";

function PlayersPage() {
  const navigate = useNavigate();
  const all = listPlayers({ orgId: ORG_ID });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [team, setTeam] = useState("all");
  const [age, setAge] = useState("all");
  const [verif, setVerif] = useState("all");

  const rows = useMemo(
    () =>
      all.filter((p) =>
        (status === "all" || p.membership === status) &&
        (team === "all" || p.teamId === team) &&
        (age === "all" || ageCategoryFor(p.birthYear) === age) &&
        (verif === "all" || p.verification === verif) &&
        (!q || `${p.name} ${p.footballId}`.toLowerCase().includes(q.toLowerCase()))),
    [all, q, status, team, age, verif],
  );

  const ages = [...new Set(all.map((p) => ageCategoryFor(p.birthYear)))].sort();
  const count = (s: StatusFilter) => (s === "all" ? all.length : all.filter((p) => p.membership === s).length);

  const columns: Column<Player>[] = [
    {
      key: "player", header: "Player",
      cell: (p) => (
        <div className="flex items-center gap-3">
          <PersonAvatar name={p.name} src={p.photo} size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-1 font-semibold">{p.name}<VerifiedMark verified={p.verification === "verified"} className="size-3.5" /></div>
            <div className="text-id text-xs text-muted-foreground">{p.footballId}</div>
          </div>
        </div>
      ),
    },
    { key: "age", header: "Age cat.", cell: (p) => <span className="font-semibold">{ageCategoryFor(p.birthYear)}</span>, hideBelow: "lg" },
    { key: "team", header: "Team", cell: (p) => getTeam(p.teamId)?.name ?? "—" },
    { key: "pos", header: "Position", cell: (p) => <span className="text-muted-foreground">{p.positionLabel}</span>, hideBelow: "lg" },
    { key: "status", header: "Membership", cell: (p) => <StatusBadge status={p.membership} label={p.membership === "active" ? "Current member" : undefined} /> },
    { key: "verif", header: "Football ID", cell: (p) => <StatusBadge status={p.verification} /> },
    { key: "since", header: "Member since", cell: (p) => <span className="text-muted-foreground">{p.memberSince ? fmtDate(p.memberSince, "MMM yyyy") : "—"}</span>, hideBelow: "lg" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SSB Garuda Makassar"
        title="Players"
        description="Players with a relationship with your organization. Each player keeps their own Football ID and history."
        actions={
          <>
            <Button variant="outline" onClick={() => toast("Export prepared (prototype)")}><Download /> Export</Button>
            <Button onClick={() => toast.success("Invitation link copied", { description: "Guardians approve the membership from their account." })}><UserPlus /> Invite player</Button>
          </>
        }
      />

      <FilterChips<StatusFilter>
        value={status}
        onChange={setStatus}
        options={[
          { value: "all", label: "All", count: count("all") },
          { value: "active", label: "Current members", count: count("active") },
          { value: "pending", label: "Pending", count: count("pending") },
          { value: "archived", label: "Former", count: count("archived") },
        ]}
      />

      <FilterBar>
        <SearchInput value={q} onChange={setQ} placeholder="Search name or Football ID" className="sm:w-72" />
        <FilterSelect value={team} onChange={setTeam} placeholder="Team" options={[{ value: "all", label: "All teams" }, ...listTeams(ORG_ID).map((t) => ({ value: t.id, label: t.name }))]} />
        <FilterSelect value={age} onChange={setAge} placeholder="Age category" options={[{ value: "all", label: "All ages" }, ...ages.map((a) => ({ value: a, label: a }))]} />
        <FilterSelect value={verif} onChange={setVerif} placeholder="Verification" options={[{ value: "all", label: "Any verification" }, { value: "verified", label: "Verified" }, { value: "pending", label: "Pending" }]} />
      </FilterBar>

      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(p) => p.id}
        onRowClick={(p) => navigate({ to: "/players/$playerId", params: { playerId: p.id } })}
        mobileRow={(p) => (
          <div className="flex items-center gap-3">
            <PersonAvatar name={p.name} src={p.photo} size="md" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{p.name}</div>
              <div className="text-small text-muted-foreground">{getTeam(p.teamId)?.name} · {ageCategoryFor(p.birthYear)}</div>
            </div>
            <StatusBadge status={p.membership} />
          </div>
        )}
        empty={<EmptyState title="No players match these filters" description="Try clearing the search or choosing a different team." action={<Button variant="outline" onClick={() => { setQ(""); setTeam("all"); setAge("all"); setVerif("all"); setStatus("all"); }}>Clear filters</Button>} />}
      />
    </div>
  );
}
