import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Download, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { DataTable, type Column } from "@/components/ds/data-table";
import { FilterBar, FilterChips, FilterSelect, SearchInput } from "@/components/ds/filter-bar";
import { PersonAvatar } from "@/components/ds/avatars";
import { StatusBadge } from "@/components/ds/status-badge";
import { VerifiedMark } from "@/components/ds/football-id";
import { EmptyState, PermissionState } from "@/components/ds/states";
import { getTeam, getWorkspaceActor, listPlayers, listTeams } from "@/data/repository";
import type { Player } from "@/data/types";
import { ageCategoryFor, fmtDate } from "@/lib/format";
import { getCoachAssignedPlayers, getCoachAssignedTeams } from "@/lib/coach-access";
import { useRole } from "@/lib/role-context";
import {
  countDirectoryPlayers,
  directoryAgeCategories,
  filterDirectoryPlayers,
  type PlayerDirectoryStatus,
} from "./player-directory-model";

export function PlayerDirectory() {
  const navigate = useNavigate();
  const { role, ready } = useRole();
  const [search, setSearch] = useState("");
  const [membership, setMembership] = useState<PlayerDirectoryStatus>("all");
  const [teamId, setTeamId] = useState("all");
  const [ageCategory, setAgeCategory] = useState("all");
  const [verification, setVerification] = useState("all");
  if (!ready || (role !== "coach" && role !== "org_admin")) {
    return <PermissionState title="Player directory unavailable" description="This view requires a resolved coach assignment or organization-admin scope." />;
  }
  const coachWorkspace = role === "coach";
  const organizationId = getWorkspaceActor(role).organizationId;
  const allPlayers = coachWorkspace
    ? getCoachAssignedPlayers()
    : organizationId ? listPlayers({ orgId: organizationId }) : [];
  const teams = coachWorkspace ? getCoachAssignedTeams() : organizationId ? listTeams(organizationId) : [];
  const rows = filterDirectoryPlayers(allPlayers, {
    search,
    membership,
    teamId,
    ageCategory,
    verification,
  });
  const ageCategories = directoryAgeCategories(allPlayers);

  const columns: Column<Player>[] = [
    {
      key: "player",
      header: "Player",
      cell: (player) => (
        <div className="flex items-center gap-3">
          <PersonAvatar name={player.name} src={player.photo} size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-1 font-semibold">
              {player.name}
              <VerifiedMark verified={player.verification === "verified"} className="size-3.5" />
            </div>
            <div className="text-id text-xs text-muted-foreground">{player.footballId}</div>
          </div>
        </div>
      ),
    },
    {
      key: "age",
      header: "Age cat.",
      cell: (player) => <span className="font-semibold">{ageCategoryFor(player.birthYear)}</span>,
      hideBelow: "lg",
    },
    { key: "team", header: "Team", cell: (player) => getTeam(player.teamId)?.name ?? "—" },
    {
      key: "pos",
      header: "Position",
      cell: (player) => <span className="text-muted-foreground">{player.positionLabel}</span>,
      hideBelow: "lg",
    },
    {
      key: "status",
      header: "Membership",
      cell: (player) => (
        <StatusBadge
          status={player.membership}
          label={player.membership === "active" ? "Current member" : undefined}
        />
      ),
    },
    {
      key: "verif",
      header: "Football ID",
      cell: (player) => <StatusBadge status={player.verification} />,
    },
    {
      key: "since",
      header: "Member since",
      cell: (player) => (
        <span className="text-muted-foreground">
          {player.memberSince ? fmtDate(player.memberSince, "MMM yyyy") : "—"}
        </span>
      ),
      hideBelow: "lg",
    },
  ];

  const clearFilters = () => {
    setSearch("");
    setTeamId("all");
    setAgeCategory("all");
    setVerification("all");
    setMembership("all");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={coachWorkspace ? "Coach · assigned teams" : "SSB Garuda Makassar"}
        title={coachWorkspace ? "Assigned Players" : "Players"}
        description={
          coachWorkspace
            ? "Players in teams assigned to you. Player identity and history remain player-owned."
            : "Players with a relationship with your organization. Each player keeps their own Football ID and history."
        }
        actions={
          !coachWorkspace && (
            <>
              <Button variant="outline" onClick={() => toast("Export prepared (prototype)")}>
                <Download /> Export
              </Button>
              <Button
                onClick={() =>
                  toast.success("Invitation link copied", {
                    description: "Guardians approve the membership from their account.",
                  })
                }
              >
                <UserPlus /> Invite player
              </Button>
            </>
          )
        }
      />

      <FilterChips<PlayerDirectoryStatus>
        value={membership}
        onChange={setMembership}
        options={[
          { value: "all", label: "All", count: countDirectoryPlayers(allPlayers, "all") },
          {
            value: "active",
            label: "Current members",
            count: countDirectoryPlayers(allPlayers, "active"),
          },
          {
            value: "pending",
            label: "Pending",
            count: countDirectoryPlayers(allPlayers, "pending"),
          },
          {
            value: "archived",
            label: "Former",
            count: countDirectoryPlayers(allPlayers, "archived"),
          },
        ]}
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search name or Football ID"
          className="sm:w-72"
        />
        <FilterSelect
          value={teamId}
          onChange={setTeamId}
          placeholder="Team"
          options={[
            { value: "all", label: "All teams" },
            ...teams.map((team) => ({ value: team.id, label: team.name })),
          ]}
        />
        <FilterSelect
          value={ageCategory}
          onChange={setAgeCategory}
          placeholder="Age category"
          options={[
            { value: "all", label: "All ages" },
            ...ageCategories.map((age) => ({ value: age, label: age })),
          ]}
        />
        <FilterSelect
          value={verification}
          onChange={setVerification}
          placeholder="Verification"
          options={[
            { value: "all", label: "Any verification" },
            { value: "verified", label: "Verified" },
            { value: "pending", label: "Pending" },
          ]}
        />
      </FilterBar>

      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(player) => player.id}
        getRowLabel={(player) => player.name}
        onRowClick={(player) =>
          navigate({ to: "/players/$playerId", params: { playerId: player.id } })
        }
        mobileRow={(player) => (
          <div className="flex items-center gap-3">
            <PersonAvatar name={player.name} src={player.photo} size="md" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{player.name}</div>
              <div className="text-small text-muted-foreground">
                {getTeam(player.teamId)?.name} · {ageCategoryFor(player.birthYear)}
              </div>
            </div>
            <StatusBadge status={player.membership} />
          </div>
        )}
        empty={
          <EmptyState
            title="No players match these filters"
            description="Try clearing the search or choosing a different team."
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        }
      />
    </div>
  );
}
