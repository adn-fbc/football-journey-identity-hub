import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Breadcrumbs } from "@/components/ds/page-header";
import { InfoList, Section } from "@/components/ds/section";
import { StatusBadge } from "@/components/ds/status-badge";
import { PersonAvatar } from "@/components/ds/avatars";
import { TeamCrest } from "@/components/ds/team-crest";
import { MatchRow } from "@/components/ds/match-card";
import { EmptyState, PermissionState } from "@/components/ds/states";
import { ConfirmDialog } from "@/components/ds/confirm-dialog";
import { FilterChips, SearchInput } from "@/components/ds/filter-bar";
import { VerifiedMark } from "@/components/ds/football-id";
import { activity } from "@/data/mock";
import { ageCategoryFor } from "@/lib/format";
import {
  assignPlayerToTeam,
  getOrganization,
  getPlayer,
  getTeam,
  getWorkspaceActor,
  listPlayers,
  recentMatches,
  removePlayerFromTeam,
  upcomingMatches,
} from "@/data/repository";
import type { Position, Team } from "@/data/types";
import { useRole } from "@/lib/role-context";
import { coachCanAccessTeam } from "@/lib/coach-access";
import { PlayerTeamHome } from "@/features/players/player-team";
import { CoachTeamWorkspace } from "@/features/players/coach-team-workspace";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/teams/$teamId")({
  loader: ({ params }) => {
    const team = getTeam(params.teamId);
    if (!team) throw notFound();
    return { team };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(
          loaderData.team.name,
          `${loaderData.team.ageCategory} roster, coach and fixtures · season ${loaderData.team.season}`,
        )
      : { meta: [{ title: "Unavailable · Football ID" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <EmptyState
      title="Team not found"
      action={
        <Button asChild variant="outline">
          <Link to="/teams">Back to teams</Link>
        </Button>
      }
    />
  ),
  component: TeamPage,
});

const POS: { id: Position; label: string }[] = [
  { id: "GK", label: "Goalkeepers" },
  { id: "DF", label: "Defenders" },
  { id: "MF", label: "Midfielders" },
  { id: "FW", label: "Forwards" },
];

function TeamPage() {
  const { team } = Route.useLoaderData();
  const { role, ready } = useRole();
  if (!ready) {
    return <PermissionState title="Team access unavailable" description="The active workspace scope has not been resolved." />;
  }
  const player = role === "player" ? getPlayer("p-123") : undefined;

  if (role === "player") {
    if (!player?.teamId)
      return (
        <EmptyState
          title="No team yet"
          description="Your Football ID remains yours while you find a team."
        />
      );
    if (player.teamId !== team.id)
      return (
        <PermissionState
          title="Team unavailable"
          description="You can only view the team connected to your player profile."
        />
      );
    return <PlayerTeamHome player={player} team={team} />;
  }

  if (role === "coach") {
    if (!coachCanAccessTeam(team)) {
      return (
        <PermissionState
          title="Team access restricted"
          description="Coach access is limited to teams assigned to you."
          action={
            <Button asChild variant="outline">
              <Link to="/teams">Back to My Teams</Link>
            </Button>
          }
        />
      );
    }
    return <CoachTeamWorkspace team={team} />;
  }

  if (role === "org_admin" && getWorkspaceActor(role).organizationId !== team.orgId) {
    return (
      <PermissionState
        title="Team access restricted"
        description="Organization administrators can manage teams only in their active organization scope."
      />
    );
  }

  return <TeamManagementPage team={team} actor={getWorkspaceActor(role, team.id)} />;
}

function TeamManagementPage({ team, actor }: { team: Team; actor: ReturnType<typeof getWorkspaceActor> }) {
  const org = getOrganization(team.orgId);
  const [roster, setRoster] = useState(() =>
    listPlayers({ teamId: team.id }).sort((a, b) => (a.jersey ?? 99) - (b.jersey ?? 99)),
  );
  const [q, setQ] = useState("");
  const [pos, setPos] = useState<"all" | Position>("all");
  const [rosterDialogOpen, setRosterDialogOpen] = useState(false);
  const [candidateQuery, setCandidateQuery] = useState("");
  const filtered = roster.filter(
    (p) => (pos === "all" || p.position === pos) && p.name.toLowerCase().includes(q.toLowerCase()),
  );
  const candidates = listPlayers({ orgId: team.orgId })
    .filter(
      (p) =>
        p.membership === "active" &&
        ageCategoryFor(p.birthYear) === team.ageCategory &&
        p.teamId !== team.id,
    )
    .filter(
      (p) =>
        !candidateQuery ||
        `${p.name} ${p.footballId}`.toLowerCase().includes(candidateQuery.toLowerCase()),
    );
  const upcoming = upcomingMatches(team.id);
  const recent = recentMatches(team.id).slice(0, 3);

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Teams", to: "/teams" }, { label: team.name }]} />
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <TeamCrest teamId={team.id} size="xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-h1">{team.name}</h1>
            <StatusBadge status={team.status} />
          </div>
          <p className="mt-1 text-small text-muted-foreground">{org?.name}</p>
        </div>
        {actor.role === "org_admin" && <Dialog open={rosterDialogOpen} onOpenChange={setRosterDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus /> Add to roster
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add a player to {team.name}</DialogTitle>
              <DialogDescription>
                Choose an active member of {org?.name} in the {team.ageCategory} age group. An
                available squad number is assigned automatically; organization membership and
                guardian consent are unchanged.
              </DialogDescription>
            </DialogHeader>
            <SearchInput
              value={candidateQuery}
              onChange={setCandidateQuery}
              placeholder="Search available players"
            />
            {candidates.length ? (
              <ul className="max-h-80 divide-y overflow-y-auto rounded-md border">
                {candidates.map((player) => (
                  <li key={player.id} className="flex items-center gap-3 px-3 py-2.5">
                    <PersonAvatar name={player.name} src={player.photo} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{player.name}</div>
                      <div className="truncate text-small text-muted-foreground">
                        {player.teamId
                          ? `Move from ${getTeam(player.teamId)?.name}`
                          : "No team assigned"}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (assignPlayerToTeam(player.id, team.id, actor)) {
                          setRoster(
                            listPlayers({ teamId: team.id }).sort(
                              (a, b) => (a.jersey ?? 99) - (b.jersey ?? 99),
                            ),
                          );
                          setRosterDialogOpen(false);
                          setCandidateQuery("");
                          toast.success(`${player.name} added to ${team.name}`);
                        } else {
                          toast.error("Player could not be assigned", {
                            description:
                              "Check the organization relationship and membership status.",
                          });
                        }
                      }}
                    >
                      Assign
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No eligible players"
                description="Active members in this age group will appear here."
              />
            )}
          </DialogContent>
        </Dialog>}
      </div>

      <div className="surface p-5">
        <InfoList
          className="md:grid-cols-5"
          items={[
            { label: "Age category", value: team.ageCategory },
            { label: "Season", value: team.season },
            { label: "Head coach", value: team.coach },
            { label: "Assistant", value: team.assistant ?? "—" },
            {
              label: "Record",
              value: (
                <span className="tabular-nums">
                  {team.record.w}W · {team.record.d}D · {team.record.l}L
                </span>
              ),
            },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title={`Roster · ${roster.length}`} className="lg:col-span-2" flush>
          <div className="space-y-3 border-b px-5 py-3">
            <SearchInput value={q} onChange={setQ} placeholder="Search roster" />
            <FilterChips
              value={pos}
              onChange={setPos}
              options={[
                { value: "all", label: "All" },
                ...POS.map((p) => ({
                  value: p.id,
                  label: p.label,
                  count: roster.filter((r) => r.position === p.id).length,
                })),
              ]}
            />
          </div>
          {filtered.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No players match" />
            </div>
          ) : (
            POS.filter((g) => filtered.some((p) => p.position === g.id)).map((g) => (
              <div key={g.id}>
                <div className="bg-muted/40 px-5 py-1.5 text-label text-muted-foreground">
                  {g.label}
                </div>
                <ul className="divide-y">
                  {filtered
                    .filter((p) => p.position === g.id)
                    .map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center gap-2 px-5 py-2.5 hover:bg-muted/40"
                      >
                        <Link
                          to="/players/$playerId"
                          params={{ playerId: p.id }}
                          className="grid min-w-0 flex-1 grid-cols-[2.25rem_auto_1fr_auto] items-center gap-3 md:grid-cols-[2.25rem_auto_1fr_8rem_6rem_auto]"
                        >
                          <span className="font-display text-lg font-semibold tabular-nums text-muted-foreground">
                            {p.jersey ?? "–"}
                          </span>
                          <PersonAvatar name={p.name} src={p.photo} size="sm" />
                          <span className="min-w-0">
                            <span className="flex items-center gap-1 truncate text-sm font-semibold">
                              {p.name}
                              <VerifiedMark
                                verified={p.verification === "verified"}
                                className="size-3.5"
                              />
                            </span>
                            <span className="block text-small text-muted-foreground md:hidden">
                              {p.positionLabel}
                            </span>
                          </span>
                          <span className="hidden text-small text-muted-foreground md:block">
                            {p.positionLabel}
                          </span>
                          <span className="hidden text-small tabular-nums text-muted-foreground md:block">
                            {p.stats.goals}G · {p.stats.assists}A
                          </span>
                          <StatusBadge status={p.membership} />
                        </Link>
                        {actor.role === "org_admin" && <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Remove ${p.name} from roster`}
                            >
                              <UserMinus />
                            </Button>
                          }
                          title={`Remove ${p.name} from ${team.name}?`}
                          description="This only removes the team assignment. The player's organization relationship and Football ID remain unchanged."
                          confirmLabel="Remove from team"
                          destructive
                          onConfirm={() => {
                            if (removePlayerFromTeam(p.id, team.id, actor)) {
                              setRoster(
                                listPlayers({ teamId: team.id }).sort(
                                  (a, b) => (a.jersey ?? 99) - (b.jersey ?? 99),
                                ),
                              );
                              toast.success(`${p.name} removed from ${team.name}`);
                            }
                          }}
                        />}
                      </li>
                    ))}
                </ul>
              </div>
            ))
          )}
        </Section>

        <div className="space-y-6">
          <Section title="Upcoming matches" flush>
            {upcoming.length ? (
              <div className="divide-y">
                {upcoming.map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState title="No upcoming matches" />
              </div>
            )}
          </Section>
          <Section
            title="Recent results"
            flush
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/matches">
                  All <ChevronRight />
                </Link>
              </Button>
            }
          >
            {recent.length ? (
              <div className="divide-y">
                {recent.map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState title="No results yet" />
              </div>
            )}
          </Section>
          <Section title="Recent activity">
            <ol className="space-y-3 text-small">
              {activity.slice(0, 3).map((a) => (
                <li key={a.id}>
                  <b>{a.who}</b>{" "}
                  <span className="text-muted-foreground">
                    {a.what} · {a.when}
                  </span>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </div>
    </div>
  );
}
