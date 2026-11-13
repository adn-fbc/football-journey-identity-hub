import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CreditCard, Users, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Section } from "@/components/ds/section";
import { DataTable, type Column } from "@/components/ds/data-table";
import { FilterBar, FilterChips, FilterSelect, SearchInput } from "@/components/ds/filter-bar";
import { EmptyState } from "@/components/ds/states";
import { PersonAvatar } from "@/components/ds/avatars";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { StatusBadge } from "@/components/ds/status-badge";
import { TeamCrest } from "@/components/ds/team-crest";
import { VerifiedMark } from "@/components/ds/football-id";
import type { Competition, Player, Team } from "@/data/types";
import { useOrganizationWorkspace } from "./organization-context";
import type { OrganizationStaffMember } from "./organization-workspace-model";
import { OrganizationSectionHeading } from "./organization-section-heading";
import { ageCategoryFor, fmtDate } from "@/lib/format";

type PlayerRelationship = "all" | "active" | "pending" | "archived";
type AttendanceFilter = "all" | "below-80";
type CompetitionFilter = "all" | "active" | "pending";

export function OrganizationPlayers() {
  const navigate = useNavigate();
  const { workspace } = useOrganizationWorkspace();
  const [query, setQuery] = useState("");
  const [relationship, setRelationship] = useState<PlayerRelationship>("all");
  const rows = workspace.players.filter(
    (player) =>
      (relationship === "all" || player.membership === relationship) &&
      (!query ||
        `${player.name} ${player.footballId} ${player.positionLabel}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  const columns: Column<Player>[] = [
    {
      key: "player",
      header: "Player",
      cell: (player) => (
        <div className="flex min-w-48 items-center gap-3">
          <PersonAvatar name={player.name} src={player.photo} size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-1 truncate font-semibold">
              {player.name}
              <VerifiedMark verified={player.verification === "verified"} className="size-3.5" />
            </div>
            <div className="truncate text-id text-xs text-muted-foreground">
              {player.footballId}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "age",
      header: "Age group",
      cell: (player) => ageCategoryFor(player.birthYear),
      hideBelow: "md",
    },
    {
      key: "team",
      header: "Team",
      cell: (player) =>
        workspace.teams.find((team) => team.id === player.teamId)?.name ?? "Unassigned",
    },
    {
      key: "relationship",
      header: "Relationship",
      cell: (player) => <StatusBadge status={player.membership} />,
    },
  ];

  return (
    <div className="space-y-5">
      <OrganizationSectionHeading
        title="Players"
        description="Organization relationships and player identity records."
      />
      <FilterBar>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search players or Football ID"
          className="sm:w-80"
        />
      </FilterBar>
      <FilterChips
        value={relationship}
        onChange={setRelationship}
        options={[
          { value: "all", label: "All", count: workspace.players.length },
          {
            value: "active",
            label: "Current",
            count: workspace.players.filter((player) => player.membership === "active").length,
          },
          {
            value: "pending",
            label: "Pending",
            count: workspace.players.filter((player) => player.membership === "pending").length,
          },
          {
            value: "archived",
            label: "Former",
            count: workspace.players.filter((player) => player.membership === "archived").length,
          },
        ]}
      />
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
            <PersonAvatar name={player.name} src={player.photo} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{player.name}</span>
              <span className="block truncate text-small text-muted-foreground">
                {player.footballId} · {ageCategoryFor(player.birthYear)}
              </span>
            </span>
            <StatusBadge status={player.membership} />
          </div>
        )}
        empty={
          <EmptyState
            title={workspace.players.length ? "No players match" : "No player records available"}
            description={
              workspace.players.length
                ? "Try another relationship filter or search."
                : "Player records for this organization will appear here when available."
            }
          />
        }
      />
    </div>
  );
}

export function OrganizationTeams() {
  const navigate = useNavigate();
  const { workspace } = useOrganizationWorkspace();
  const [query, setQuery] = useState("");
  const [age, setAge] = useState("all");
  const ages = [...new Set(workspace.teams.map((team) => team.ageCategory))].sort();
  const rows = workspace.teams.filter(
    (team) =>
      (age === "all" || team.ageCategory === age) &&
      (!query ||
        `${team.name} ${team.coach} ${team.ageCategory}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  const columns: Column<Team>[] = [
    {
      key: "team",
      header: "Team",
      cell: (team) => (
        <div className="flex min-w-40 items-center gap-3">
          <TeamCrest teamId={team.id} size="sm" />
          <span className="font-semibold">{team.name}</span>
        </div>
      ),
    },
    { key: "age", header: "Age group", cell: (team) => team.ageCategory },
    { key: "coach", header: "Head coach", cell: (team) => team.coach, hideBelow: "md" },
    {
      key: "roster",
      header: "Players",
      cell: (team) => workspace.players.filter((player) => player.teamId === team.id).length,
    },
    { key: "status", header: "Status", cell: (team) => <StatusBadge status={team.status} /> },
  ];

  return (
    <div className="space-y-5">
      <OrganizationSectionHeading
        title="Teams"
        description="Squads, age categories, coaches, and rosters."
      />
      <FilterBar>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search teams or coaches"
          className="sm:w-72"
        />
        <FilterSelect
          value={age}
          onChange={setAge}
          placeholder="Age category"
          options={[
            { value: "all", label: "All age groups" },
            ...ages.map((value) => ({ value, label: value })),
          ]}
        />
      </FilterBar>
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(team) => team.id}
        getRowLabel={(team) => team.name}
        onRowClick={(team) => navigate({ to: "/teams/$teamId", params: { teamId: team.id } })}
        mobileRow={(team) => (
          <div className="flex items-center gap-3">
            <TeamCrest teamId={team.id} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{team.name}</span>
              <span className="block truncate text-small text-muted-foreground">
                {team.ageCategory} · {team.coach}
              </span>
            </span>
            <StatusBadge status={team.status} />
          </div>
        )}
        empty={
          <EmptyState title="No teams match" description="Try another age category or search." />
        }
      />
    </div>
  );
}

export function OrganizationTraining() {
  const { workspace } = useOrganizationWorkspace();
  const [teamId, setTeamId] = useState("all");
  const [query, setQuery] = useState("");
  const items = workspace.trainings.filter(
    (item) =>
      (teamId === "all" || item.teamId === teamId) &&
      (!query || `${item.title} ${item.venue}`.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="space-y-5">
      <OrganizationSectionHeading
        title="Training"
        description="Scheduled training sessions for this organization."
      />
      <FilterBar>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search sessions or venue"
          className="sm:w-72"
        />
        <FilterSelect
          value={teamId}
          onChange={setTeamId}
          placeholder="Team"
          options={[
            { value: "all", label: "All teams" },
            ...workspace.teams.map((team) => ({ value: team.id, label: team.name })),
          ]}
        />
      </FilterBar>
      {items.length ? (
        <Section title={`${items.length} upcoming sessions`} flush>
          <div className="divide-y">
            {items.map((item) => (
              <ScheduleRow key={item.id} item={item} />
            ))}
          </div>
        </Section>
      ) : (
        <EmptyState
          title="No training sessions"
          description="Scheduled sessions for this organization will appear here."
        />
      )}
    </div>
  );
}

export function OrganizationAttendance() {
  const { workspace } = useOrganizationWorkspace();
  const [teamId, setTeamId] = useState("all");
  const [filter, setFilter] = useState<AttendanceFilter>("all");
  const rows = workspace.attendance.filter(
    (player) =>
      (teamId === "all" || player.teamId === teamId) &&
      (filter === "all" || player.attendance < 80),
  );
  const columns: Column<Player>[] = [
    {
      key: "player",
      header: "Player",
      cell: (player) => (
        <div className="flex items-center gap-3">
          <PersonAvatar name={player.name} src={player.photo} size="sm" />
          <span className="font-semibold">{player.name}</span>
        </div>
      ),
    },
    {
      key: "team",
      header: "Team",
      cell: (player) =>
        workspace.teams.find((team) => team.id === player.teamId)?.name ?? "Unassigned",
      hideBelow: "md",
    },
    {
      key: "attendance",
      header: "Attendance · 30 days",
      cell: (player) => (
        <div className="flex min-w-32 items-center gap-3">
          <Progress value={player.attendance} className="h-2" />
          <span className="w-10 text-right font-semibold tabular-nums">{player.attendance}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <OrganizationSectionHeading
        title="Attendance"
        description="Recorded player attendance over the last 30 days."
      />
      <FilterBar>
        <FilterSelect
          value={teamId}
          onChange={setTeamId}
          placeholder="Team"
          options={[
            { value: "all", label: "All teams" },
            ...workspace.teams.map((team) => ({ value: team.id, label: team.name })),
          ]}
        />
      </FilterBar>
      <FilterChips
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All active players", count: workspace.attendance.length },
          {
            value: "below-80",
            label: "Below 80%",
            count: workspace.attendance.filter((player) => player.attendance < 80).length,
          },
        ]}
      />
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(player) => player.id}
        mobileRow={(player) => (
          <div className="flex items-center gap-3">
            <PersonAvatar name={player.name} src={player.photo} size="sm" />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{player.name}</span>
            <span className="font-semibold tabular-nums">{player.attendance}%</span>
          </div>
        )}
        empty={
          <EmptyState
            title="No attendance records"
            description="Attendance appears when a player has a record for the selected period."
          />
        }
      />
    </div>
  );
}

export function OrganizationCompetitions() {
  const navigate = useNavigate();
  const { workspace } = useOrganizationWorkspace();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CompetitionFilter>("all");
  const teamIds = new Set(workspace.teams.map((team) => team.id));
  const rows = workspace.competitions.filter(
    (competition) =>
      (filter === "all" || competition.status === filter) &&
      (!query ||
        `${competition.name} ${competition.organizer} ${competition.city}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  const teamCount = (competition: Competition) =>
    new Set(
      competition.categories
        .flatMap((category) => category.teamIds)
        .filter((id) => teamIds.has(id)),
    ).size;
  const columns: Column<Competition>[] = [
    {
      key: "competition",
      header: "Competition",
      cell: (competition) => (
        <div>
          <div className="font-semibold">{competition.name}</div>
          <div className="text-small text-muted-foreground">{competition.organizer}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (competition) => <StatusBadge status={competition.status} />,
    },
    {
      key: "categories",
      header: "Categories",
      cell: (competition) => competition.categories.map((category) => category.label).join(", "),
      hideBelow: "md",
    },
    { key: "teams", header: "Teams", cell: (competition) => teamCount(competition) },
    {
      key: "dates",
      header: "Dates",
      cell: (competition) =>
        `${fmtDate(competition.start, "d MMM")} – ${fmtDate(competition.end, "d MMM yyyy")}`,
    },
  ];

  return (
    <div className="space-y-5">
      <OrganizationSectionHeading
        title="Competitions"
        description="Competitions involving this organization's teams."
      />
      <FilterBar>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search competitions"
          className="sm:w-80"
        />
      </FilterBar>
      <FilterChips
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All", count: workspace.competitions.length },
          {
            value: "active",
            label: "In progress",
            count: workspace.competitions.filter((competition) => competition.status === "active")
              .length,
          },
          {
            value: "pending",
            label: "Registration open",
            count: workspace.competitions.filter((competition) => competition.status === "pending")
              .length,
          },
        ]}
      />
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(competition) => competition.id}
        getRowLabel={(competition) => competition.name}
        onRowClick={(competition) =>
          navigate({
            to: "/competitions/$competitionId",
            params: { competitionId: competition.id },
          })
        }
        mobileRow={(competition) => (
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{competition.name}</span>
              <StatusBadge status={competition.status} />
            </div>
            <p className="text-small text-muted-foreground">
              {fmtDate(competition.start, "d MMM")} – {fmtDate(competition.end, "d MMM yyyy")} ·{" "}
              {teamCount(competition)} teams
            </p>
          </div>
        )}
        empty={
          <EmptyState title="No competitions found" description="Try another status or search." />
        }
      />
    </div>
  );
}

export function OrganizationFinance() {
  const { organization } = useOrganizationWorkspace();

  return (
    <div className="space-y-5">
      <OrganizationSectionHeading
        title="Finance overview"
        description={`High-level finance view for ${organization.name}. Financial records are not connected in this workspace.`}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatPlaceholder icon={CreditCard} label="Contributions" />
        <StatPlaceholder icon={Wallet} label="Outstanding" />
        <StatPlaceholder icon={Wallet} label="Expenses" />
      </div>
      <Section
        title="Financial activity"
        description="No payment gateway or financial ledger is connected."
      >
        <EmptyState
          title="No financial records"
          description="Organization finance records will appear here when available."
        />
      </Section>
    </div>
  );
}

function StatPlaceholder({ icon: Icon, label }: { icon: typeof Wallet; label: string }) {
  return (
    <Section>
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>{label}</span>
        <Icon className="size-4" />
      </div>
      <div className="mt-3 font-display text-3xl font-semibold">—</div>
      <p className="mt-1 text-small text-muted-foreground">No records available</p>
    </Section>
  );
}

export function OrganizationStaff() {
  const { workspace } = useOrganizationWorkspace();
  const columns: Column<OrganizationStaffMember>[] = [
    {
      key: "staff",
      header: "Staff member",
      cell: (member) => (
        <div className="flex items-center gap-3">
          <PersonAvatar name={member.name} size="sm" />
          <span className="font-semibold">{member.name}</span>
        </div>
      ),
    },
    { key: "roles", header: "Role", cell: (member) => member.roles.join(", ") },
    { key: "teams", header: "Teams", cell: (member) => member.teams.join(", "), hideBelow: "md" },
  ];

  return (
    <div className="space-y-5">
      <OrganizationSectionHeading
        title="Staff"
        description="Coaching assignments derived from this organization's teams."
      />
      <Section title={`${workspace.staff.length} team staff`} flush>
        <DataTable
          rows={workspace.staff}
          columns={columns}
          getRowId={(member) => member.id}
          mobileRow={(member) => (
            <div className="flex items-center gap-3">
              <PersonAvatar name={member.name} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{member.name}</span>
                <span className="block truncate text-small text-muted-foreground">
                  {member.roles.join(", ")} · {member.teams.join(", ")}
                </span>
              </span>
            </div>
          )}
          empty={
            <div className="p-5">
              <EmptyState
                title="No team staff listed"
                description="Coach assignments will appear here when teams have staff records."
              />
            </div>
          }
        />
      </Section>
    </div>
  );
}
