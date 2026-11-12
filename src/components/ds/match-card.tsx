import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { getCompetition, getTeam } from "@/data/repository";
import type { Match } from "@/data/types";
import { relativeDay } from "@/lib/format";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { TeamCrest } from "./team-crest";

function Score({ match, className }: { match: Match; className?: string }) {
  if (match.score)
    return (
      <span className={cn("font-display text-lg font-semibold tabular-nums", match.status === "live" && "text-live", className)}>
        {match.score.home}<span className="px-1 text-muted-foreground">–</span>{match.score.away}
      </span>
    );
  if (match.status === "cancelled") return <span className="text-small font-semibold text-muted-foreground">PPD</span>;
  return <span className="rounded-md bg-muted px-2 py-0.5 font-display text-sm font-semibold tabular-nums">{match.time}</span>;
}

/** Compact, scannable fixture row. Use in lists, dashboards and competition schedules. */
export function MatchRow({ match, showCompetition = true, className }: { match: Match; showCompetition?: boolean; className?: string }) {
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const comp = getCompetition(match.competitionId);
  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: match.id }}
      className={cn("group flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-muted/40 md:px-5", className)}
    >
      <div className="flex items-center justify-between gap-2 text-small text-muted-foreground">
        <span className="truncate">
          {relativeDay(match.date)} · {match.time}
          {showCompetition && comp && <> · {comp.short} {match.categoryId.toUpperCase()}</>}
        </span>
        {match.status !== "scheduled" && <StatusBadge status={match.status} />}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <span className="flex min-w-0 items-center gap-2.5">
          <TeamCrest teamId={match.homeId} size="sm" />
          <span className="truncate text-sm font-semibold group-hover:text-primary">{home?.name}</span>
        </span>
        <Score match={match} />
        <span className="flex min-w-0 flex-row-reverse items-center gap-2.5 text-right">
          <TeamCrest teamId={match.awayId} size="sm" />
          <span className="truncate text-sm font-semibold group-hover:text-primary">{away?.name}</span>
        </span>
      </div>
    </Link>
  );
}

/** Featured match card with venue — for "next match" slots. */
export function MatchCard({ match, label = "Next match" }: { match: Match; label?: string }) {
  const home = getTeam(match.homeId);
  const away = getTeam(match.awayId);
  const comp = getCompetition(match.competitionId);
  return (
    <Link to="/matches/$matchId" params={{ matchId: match.id }} className="surface block p-5 transition-shadow hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <span className="text-label text-primary">{label}</span>
        <StatusBadge status={match.status} />
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <div className="flex flex-col items-center gap-2">
          <TeamCrest teamId={match.homeId} size="lg" />
          <span className="text-sm font-semibold leading-tight">{home?.name}</span>
        </div>
        <Score match={match} className="text-3xl" />
        <div className="flex flex-col items-center gap-2">
          <TeamCrest teamId={match.awayId} size="lg" />
          <span className="text-sm font-semibold leading-tight">{away?.name}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t pt-3 text-small text-muted-foreground">
        <span>{relativeDay(match.date)} · {match.time}</span>
        <span className="flex items-center gap-1"><MapPin className="size-3.5" />{match.venue}</span>
        {comp && <span>{comp.name}</span>}
      </div>
    </Link>
  );
}
