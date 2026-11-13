import { Link } from "@tanstack/react-router";
import { Award, EyeOff, FileText, Lock, Medal, Shield, TrendingUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoList, Section } from "@/components/ds/section";
import { JourneyTimeline } from "@/components/ds/journey-timeline";
import { MatchRow } from "@/components/ds/match-card";
import { StatCard } from "@/components/ds/stat-card";
import { StatusBadge } from "@/components/ds/status-badge";
import { EmptyState } from "@/components/ds/states";
import { OrgCrest, TeamCrest } from "@/components/ds/team-crest";
import {
  getAchievements,
  getDocuments,
  getJourney,
  getMemberships,
  getOrganization,
  getTeam,
  listMatches,
  listSchedule,
} from "@/data/repository";
import type { Achievement, Player } from "@/data/types";
import { ageCategoryFor, fmtDate, relativeDay } from "@/lib/format";
import { cn } from "@/lib/utils";

const ACH_ICON: Record<Achievement["kind"], typeof Trophy> = {
  trophy: Trophy,
  award: Award,
  milestone: Medal,
};

export function AchievementList({
  playerId,
  limit,
}: {
  playerId: string;
  limit?: number | undefined;
}) {
  const items = getAchievements(playerId).slice(0, limit);
  if (!items.length)
    return (
      <EmptyState
        icon={Trophy}
        title="No achievements yet"
        description="Trophies, awards and milestones will appear here."
      />
    );
  return (
    <ul className={cn("grid gap-3", !limit && "sm:grid-cols-2 lg:grid-cols-3")}>
      {items.map((a) => {
        const Icon = ACH_ICON[a.kind];
        return (
          <li key={a.id} className="flex items-center gap-3 rounded-xl border bg-card p-3.5">
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-xl",
                a.kind === "trophy"
                  ? "bg-warning/15 text-warning"
                  : a.kind === "award"
                    ? "bg-ink text-signal"
                    : "bg-accent text-accent-foreground",
              )}
            >
              <Icon className="size-[18px]" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{a.title}</div>
              <div className="truncate text-small text-muted-foreground">
                {a.competition} · {a.year}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function RelationshipSection({ player }: { player: Player }) {
  const rels = getMemberships(player.id);
  const current = rels.find((r) => r.status === "active" || r.status === "pending");
  const org = getOrganization(current?.orgId);
  return (
    <Section
      title="Organization relationship"
      description="Organizations hold a membership relationship — the player keeps their identity and history."
    >
      {current && org ? (
        <div className="flex items-center gap-3 rounded-xl bg-accent/60 p-4">
          <OrgCrest orgId={org.id} size="md" />
          <div className="min-w-0 flex-1">
            <div className="text-label text-accent-foreground">
              {current.status === "active" ? "Current member" : "Membership requested"}
            </div>
            <div className="text-sm font-semibold">{org.name}</div>
            <div className="text-small text-muted-foreground">
              Since {fmtDate(current.from)} · {current.teams.join(", ")}
            </div>
          </div>
          <StatusBadge status={current.status} />
        </div>
      ) : (
        <p className="text-small text-muted-foreground">No current organization relationship.</p>
      )}
      <div className="mt-5 text-label text-muted-foreground">Membership history</div>
      <ul className="mt-2 divide-y">
        {rels.map((r) => (
          <li key={r.orgId + r.from} className="flex items-center gap-3 py-3">
            <OrgCrest orgId={r.orgId} size="sm" tone="soft" />
            <div className="min-w-0 flex-1 text-small">
              <div className="font-semibold">{getOrganization(r.orgId)?.name}</div>
              <div className="text-muted-foreground">
                {fmtDate(r.from, "MMM yyyy")} – {r.to ? fmtDate(r.to, "MMM yyyy") : "present"} ·{" "}
                {r.role}
              </div>
            </div>
            <StatusBadge status={r.status} label={r.status === "completed" ? "Ended" : undefined} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PlayerOverviewTab({ player }: { player: Player }) {
  const team = getTeam(player.teamId);
  const matches = player.teamId
    ? listMatches({ teamId: player.teamId })
        .filter((m) => m.status === "completed")
        .reverse()
        .slice(0, 3)
    : [];
  const next = listSchedule(player.teamId ? [player.teamId] : []).find(
    (s) => s.teamId === player.teamId,
  );
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Matches" value={player.stats.matches} />
        <StatCard label="Goals" value={player.stats.goals} />
        <StatCard label="Assists" value={player.stats.assists} />
        <StatCard label="Attendance" value={`${player.attendance}%`} hint="Last 30 days" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Identity"
          action={
            <span className="flex items-center gap-1 text-small text-muted-foreground">
              <EyeOff className="size-3.5" />
              Private details hidden
            </span>
          }
        >
          <InfoList
            items={[
              { label: "Football ID", value: <span className="text-id">{player.footballId}</span> },
              { label: "Birth year", value: player.birthYear },
              { label: "Age category", value: ageCategoryFor(player.birthYear) },
              { label: "Primary position", value: player.positionLabel },
              { label: "Preferred foot", value: player.foot },
              { label: "Verification", value: <StatusBadge status={player.verification} /> },
            ]}
          />
        </Section>
        <Section title="Current football activity">
          {team ? (
            <div className="space-y-4">
              <Link
                to="/teams/$teamId"
                params={{ teamId: team.id }}
                className="flex items-center gap-3 rounded-xl border p-3 hover:bg-muted/40"
              >
                <TeamCrest teamId={team.id} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{team.name}</div>
                  <div className="text-small text-muted-foreground">
                    {team.season} · {team.coach}
                  </div>
                </div>
                {player.jersey && (
                  <span className="font-display text-2xl font-semibold text-muted-foreground">
                    #{player.jersey}
                  </span>
                )}
              </Link>
              {next && (
                <div className="text-small">
                  <span className="text-label text-muted-foreground">Next activity</span>
                  <div className="mt-1 font-semibold">
                    {relativeDay(next.date)} {next.start} · {next.title}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-small text-muted-foreground">Not currently in a team.</p>
          )}
        </Section>
        <RelationshipSection player={player} />
        <div className="space-y-6">
          <Section title="Recent matches" flush>
            {matches.length ? (
              <div className="divide-y">
                {matches.map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState title="No matches yet" />
              </div>
            )}
          </Section>
          <Section title="Key achievements">
            <AchievementList playerId={player.id} limit={3} />
          </Section>
        </div>
      </div>
    </div>
  );
}

export function PlayerJourneyTab({ player }: { player: Player }) {
  return (
    <Section
      title="Football journey"
      description="Every club, team, competition and milestone — owned by the player."
    >
      <JourneyTimeline events={getJourney(player.id)} />
    </Section>
  );
}

export function PlayerTeamsTab({ player }: { player: Player }) {
  const team = getTeam(player.teamId);
  if (!team)
    return (
      <EmptyState
        icon={Shield}
        title="No team relationship"
        description="Your Football ID remains active while you find a team."
      />
    );

  return (
    <Section
      title="My team"
      description="Your team membership can change without changing your Football ID."
    >
      <div className="flex items-center gap-3">
        <TeamCrest teamId={team.id} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{team.name}</div>
          <div className="text-small text-muted-foreground">
            {getOrganization(team.orgId)?.name} · {team.season}
          </div>
        </div>
        <StatusBadge
          status={player.membership}
          label={player.membership === "active" ? "Current" : undefined}
        />
      </div>
      <InfoList
        className="mt-5 border-t pt-4 sm:grid-cols-2"
        items={[
          { label: "Age group", value: team.ageCategory },
          { label: "Coach", value: team.coach },
          { label: "Position", value: player.positionLabel },
          { label: "Squad number", value: player.jersey ? `#${player.jersey}` : "Not assigned" },
        ]}
      />
      <Button asChild variant="outline" className="mt-5">
        <Link to="/teams">Open My Team</Link>
      </Button>
    </Section>
  );
}

export function PlayerDevelopmentTab({ player }: { player: Player }) {
  const achievements = getAchievements(player.id);
  if (!player.stats.matches && !player.attendance && !achievements.length) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="Development summary not available"
        description="Match participation and milestones will appear here as they are recorded."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Matches played" value={player.stats.matches} hint="Recorded appearances" />
        <StatCard
          label="Team attendance"
          value={`${player.attendance}%`}
          hint="Recent participation"
        />
        <StatCard label="Milestones" value={achievements.length} hint="Recorded achievements" />
      </div>
      <Section title="Milestones" description="Achievements recorded along your football journey.">
        <AchievementList playerId={player.id} />
      </Section>
      <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 text-small text-muted-foreground">
        <TrendingUp className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          This is a summary of recorded activity, not a performance rating. Your history stays with
          your Football ID when teams change.
        </p>
      </div>
    </div>
  );
}

export function PlayerMatchesTab({ player }: { player: Player }) {
  const ms = player.teamId
    ? listMatches({ teamId: player.teamId })
        .filter((match) => match.status === "completed")
        .reverse()
    : [];
  if (!ms.length)
    return (
      <EmptyState
        title="No matches recorded"
        description="Matches appear once the team plays in a competition."
      />
    );
  return (
    <Section title="Matches" description={getTeam(player.teamId)?.name} flush>
      <div className="divide-y">
        {ms.map((m) => (
          <MatchRow key={m.id} match={m} />
        ))}
      </div>
    </Section>
  );
}

export function PlayerDocumentsTab({ player }: { player: Player }) {
  const docs = getDocuments(player.id);
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-4 text-small">
        <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          Document contents are encrypted and only visible to the people listed. Organizations see
          verification status, not the documents themselves.
        </p>
      </div>
      {docs.length ? (
        <Section flush>
          <ul className="divide-y">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{d.name}</div>
                  <div className="text-small text-muted-foreground">
                    Visible to {d.visibleTo} · updated {fmtDate(d.updated)}
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <EmptyState
          icon={FileText}
          title="No documents shared"
          description="The guardian hasn't shared documents with this organization."
        />
      )}
    </div>
  );
}
