import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Building2, KeyRound, Search, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ds/page-header";
import { InfoList, Section } from "@/components/ds/section";
import { FootballPassport } from "@/components/ds/passport";
import { JourneyTimeline } from "@/components/ds/journey-timeline";
import { StatusBadge } from "@/components/ds/status-badge";
import { OrgCrest, TeamCrest } from "@/components/ds/team-crest";
import { FilterChips } from "@/components/ds/filter-bar";
import { EmptyState } from "@/components/ds/states";
import { CoachProfile } from "@/features/identity/coach-profile";
import { guardians } from "@/data/mock";
import {
  getJourney,
  getMemberships,
  getCurrentUser,
  getOrganization,
  getPlayer,
  getPlayerByFootballId,
  getTeam,
} from "@/data/repository";
import { fmtDate } from "@/lib/format";
import { useRole } from "@/lib/role-context";
import { pageHead } from "@/lib/seo";
import { FootballRoleList } from "@/features/identity/identity-roles";

export const Route = createFileRoute("/football-id")({
  head: () =>
    pageHead(
      "Football ID",
      "A persistent football identity and passport timeline that belongs to the player for life.",
    ),
  component: FootballIdPage,
});

function FootballIdPage() {
  const { role } = useRole();
  const navigate = useNavigate();
  const childIds = guardians[0]?.childIds ?? [];
  const [selected, setSelected] = useState<string>(childIds[0] ?? "p-123");
  const [lookup, setLookup] = useState("");
  const player = role === "coach" ? undefined : getPlayer(role === "parent" ? selected : "p-123");
  const journey = player ? getJourney(player.id) : [];
  const relations = player ? getMemberships(player.id) : [];

  if (role === "coach") {
    return <CoachProfile />;
  }

  if (!player) {
    return <EmptyState title="Football ID unavailable" description="No player identity is connected to this view." />;
  }

  const runLookup = () => {
    const found = getPlayerByFootballId(lookup);
    if (found) navigate({ to: "/players/$playerId", params: { playerId: found.id } });
    else
      toast.error("No Football ID found", { description: "Check the format: IDN-FB-YYYY-000000" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Persistent identity"
        title="Football ID"
        description="One identity for a whole football life. The player owns the journey — organizations only hold a relationship."
        actions={
          <Button asChild variant="outline">
            <Link to="/identity">Preview identity setup</Link>
          </Button>
        }
      />

      {role === "parent" && (
        <FilterChips
          value={selected}
          onChange={setSelected}
          options={childIds.map((id) => ({ value: id, label: getPlayer(id)?.nickname ?? id }))}
        />
      )}

      <FootballPassport player={player} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="Football journey"
          description="A permanent, verifiable record that travels with the player."
          className="lg:col-span-2"
        >
          <JourneyTimeline events={journey} />
        </Section>

        <div className="space-y-6">
          <Section
            title="Football roles"
            description="Roles connect to one person and one Football ID."
          >
            <FootballRoleList roles={["player"]} />
          </Section>

          <Section title="Who owns this identity">
            <ul className="space-y-4 text-small">
              {[
                {
                  icon: UserRound,
                  title: "The player",
                  body: "Identity and history belong to the player, for life.",
                },
                {
                  icon: KeyRound,
                  title: "Guardian manages",
                  body: "Until age 18, a verified guardian controls access and consent.",
                },
                {
                  icon: Building2,
                  title: "Organizations connect",
                  body: "Clubs and competitions hold a relationship — never ownership.",
                },
              ].map((r) => (
                <li key={r.title} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <r.icon className="size-4" />
                  </span>
                  <div>
                    <div className="font-semibold text-foreground">{r.title}</div>
                    <div className="text-muted-foreground">{r.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Organization relationships" flush>
            <ul className="divide-y">
              {relations.map((m) => {
                const org = getOrganization(m.orgId);
                return (
                  <li key={m.orgId + m.from} className="flex items-center gap-3 px-5 py-3">
                    <OrgCrest orgId={m.orgId} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{org?.name}</div>
                      <div className="text-small text-muted-foreground">
                        {m.from ? fmtDate(m.from, "MMM yyyy") : "Start date not recorded"} –{" "}
                        {m.to ? fmtDate(m.to, "MMM yyyy") : "present"}
                      </div>
                    </div>
                    <StatusBadge
                      status={m.status}
                      label={m.status === "active" ? "Current member" : "Past member"}
                    />
                  </li>
                );
              })}
            </ul>
          </Section>

          <Section title="Team relationships" flush>
            {player.teamId && getTeam(player.teamId) ? (
              <Link
                to="/teams/$teamId"
                params={{ teamId: player.teamId }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40"
              >
                <TeamCrest teamId={player.teamId} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {getTeam(player.teamId)?.name}
                  </span>
                  <span className="block text-small text-muted-foreground">
                    {getTeam(player.teamId)?.season} · #{player.jersey ?? "—"}
                  </span>
                </span>
                <StatusBadge
                  status={player.membership}
                  label={player.membership === "active" ? "Current" : undefined}
                />
              </Link>
            ) : (
              <p className="px-5 py-4 text-small text-muted-foreground">
                No current team relationship.
              </p>
            )}
          </Section>

          <Section title="Verification">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-info/12 text-info">
                <BadgeCheck className="size-5" />
              </span>
              <div className="text-small">
                <div className="font-semibold">
                  {player.verification === "verified"
                    ? "Identity verified"
                    : "Verification pending"}
                </div>
                <div className="text-muted-foreground">
                  Birth certificate checked by Football ID Registry
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-small text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" /> Personal documents are never shown
              publicly.
            </div>
          </Section>

          <Section title="Look up a Football ID">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                runLookup();
              }}
            >
              <Input
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                placeholder="IDN-FB-2016-000124"
                className="font-mono text-sm"
              />
              <Button type="submit" size="icon" aria-label="Look up">
                <Search />
              </Button>
            </form>
          </Section>
        </div>
      </div>
    </div>
  );
}
