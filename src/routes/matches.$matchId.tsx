import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeftRight, BarChart3, CalendarDays, Clock, FileText, Flag, MapPin, Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ds/page-header";
import { InfoList, Section } from "@/components/ds/section";
import { StatusBadge } from "@/components/ds/status-badge";
import { TeamCrest } from "@/components/ds/team-crest";
import { ComingSoon } from "@/components/ds/coming-soon";
import { EmptyState } from "@/components/ds/states";
import { getCompetition, getMatch, getOrganization, getTeam } from "@/data/repository";
import type { MatchEvent } from "@/data/types";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/matches/$matchId")({
  loader: ({ params }) => {
    const match = getMatch(params.matchId);
    if (!match) throw notFound();
    return { match };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Unavailable · Football ID" }, { name: "robots", content: "noindex" }] };
    const m = loaderData.match;
    return pageHead(`${getTeam(m.homeId)?.name} vs ${getTeam(m.awayId)?.name}`, `${getCompetition(m.competitionId)?.name} · ${m.round} · ${m.venue}`);
  },
  notFoundComponent: () => <EmptyState title="Match not found" action={<Button asChild variant="outline"><Link to="/matches">Back to matches</Link></Button>} />,
  component: MatchDetail,
});

function EventIcon({ e }: { e: MatchEvent }) {
  const base = "grid size-8 place-items-center rounded-full ring-4 ring-card text-xs font-bold";
  switch (e.type) {
    case "goal": return <span className={cn(base, "bg-ink text-signal")}>⚽</span>;
    case "yellow": return <span className={cn(base, "bg-card")}><span className="h-4 w-3 rounded-[2px] bg-warning" /></span>;
    case "red": return <span className={cn(base, "bg-card")}><span className="h-4 w-3 rounded-[2px] bg-destructive" /></span>;
    case "sub": return <span className={cn(base, "bg-accent text-accent-foreground")}><ArrowLeftRight className="size-3.5" /></span>;
    default: return <span className={cn(base, "bg-muted text-muted-foreground")}><Clock className="size-3.5" /></span>;
  }
}

const LABEL: Record<MatchEvent["type"], string> = { goal: "Goal", yellow: "Yellow card", red: "Red card", sub: "Substitution", half: "Half-time", kickoff: "Kick-off", fulltime: "Full-time" };

function MatchDetail() {
  const { match: m } = Route.useLoaderData();
  const home = getTeam(m.homeId)!;
  const away = getTeam(m.awayId)!;
  const comp = getCompetition(m.competitionId);
  const events = [...m.events].sort((a, b) => b.minute - a.minute);
  const scorers = (side: "home" | "away") => m.events.filter((e) => e.type === "goal" && e.side === side);

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Matches", to: "/matches" }, { label: `${home.name} vs ${away.name}` }]} />

      <div className="pitch-lines overflow-hidden rounded-3xl text-ink-foreground">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-5 md:px-8 md:pt-6">
          {comp && <Link to="/competitions/$competitionId" params={{ competitionId: comp.id }} className="flex items-center gap-2 text-small font-semibold text-ink-muted hover:text-ink-foreground"><Trophy className="size-4 text-signal" />{comp.name} · {m.round}</Link>}
          <StatusBadge status={m.status} className="bg-ink-foreground/10" />
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-8 md:gap-8 md:px-8 md:py-10">
          {[home, null, away].map((t, i) =>
            t ? (
              <Link key={t.id} to="/teams/$teamId" params={{ teamId: t.id }} className="flex flex-col items-center gap-3 text-center">
                <TeamCrest teamId={t.id} size="xl" />
                <div>
                  <div className="font-display text-base font-semibold md:text-xl">{t.name}</div>
                  <div className="hidden text-small text-ink-muted md:block">{getOrganization(t.orgId)?.name}</div>
                </div>
                <ul className="hidden space-y-0.5 text-small text-ink-muted md:block">
                  {scorers(i === 0 ? "home" : "away").map((g, k) => <li key={k}>{g.player?.split(" ").slice(-1)[0]} {g.minute}'</li>)}
                </ul>
              </Link>
            ) : (
              <div key="score" className="text-center">
                {m.score ? (
                  <div className={cn("font-display text-5xl font-semibold tabular-nums md:text-7xl", m.status === "live" && "text-signal")}>
                    {m.score.home}<span className="px-2 text-ink-muted md:px-3">:</span>{m.score.away}
                  </div>
                ) : (
                  <div className="font-display text-3xl font-semibold md:text-5xl">{m.status === "cancelled" ? "PPD" : m.time}</div>
                )}
                <div className="mt-2 text-small text-ink-muted">{m.status === "live" ? `${m.events.at(-1)?.minute ?? 0}' · in progress` : m.status === "completed" ? "Full-time" : m.status === "cancelled" ? "Postponed" : fmtDate(m.date, "EEE d MMM")}</div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Match timeline" description={m.status === "live" ? "Updating live" : undefined}>
            {events.length ? (
              <ol className="relative">
                <span className="absolute bottom-0 left-4 top-0 w-px bg-border md:left-1/2" aria-hidden />
                {events.map((e, i) => {
                  const neutral = !e.side;
                  const right = e.side === "away";
                  return (
                    <li key={i} className={cn("relative flex items-center gap-4 py-2.5 md:grid md:grid-cols-[1fr_auto_1fr]", neutral && "md:justify-items-center")}>
                      <div className={cn("hidden md:block", right || neutral ? "" : "text-right")}>{!right && !neutral && <EventBody e={e} align="right" />}</div>
                      <div className="relative z-10 flex flex-col items-center">
                        <EventIcon e={e} />
                      </div>
                      <div className="min-w-0 flex-1 md:hidden"><EventBody e={e} /></div>
                      <div className="hidden md:block">{(right || neutral) && <EventBody e={e} />}</div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <EmptyState icon={Clock} title="Match hasn't started" description="Goals, cards and substitutions will appear here in real time." />
            )}
          </Section>
          <div className="grid gap-4 sm:grid-cols-2">
            <ComingSoon icon={BarChart3} title="Match statistics" description="Possession, shots and passing — captured by verified match officials." />
            <ComingSoon icon={FileText} title="Match report" description="Official referee and coach reports, linked to each player's Football ID." />
            <ComingSoon icon={Play} title="Video" description="Highlights and full-match video, shared with guardian consent." />
            <ComingSoon icon={Flag} title="Referee information" description="Assigned officials, licences and match assessments." />
          </div>
        </div>
        <Section title="Match info">
          <InfoList className="grid-cols-1" items={[
            { label: "Competition", value: comp?.name ?? "—" },
            { label: "Round", value: m.round },
            { label: "Date", value: <span className="flex items-center gap-1.5"><CalendarDays className="size-4 text-muted-foreground" />{fmtDate(m.date, "EEEE, d MMMM yyyy")}</span> },
            { label: "Kick-off", value: `${m.time} WITA` },
            { label: "Venue", value: <span className="flex items-center gap-1.5"><MapPin className="size-4 text-muted-foreground" />{m.venue}</span> },
            { label: "Duration", value: m.duration },
            { label: "Category", value: m.categoryId.toUpperCase() },
          ]} />
        </Section>
      </div>
    </div>
  );
}

function EventBody({ e, align }: { e: MatchEvent; align?: "right" }) {
  return (
    <div className={cn("min-w-0", align === "right" && "md:text-right")}>
      <div className="flex items-baseline gap-2 md:inline-flex">
        <span className="font-display text-sm font-semibold tabular-nums text-primary">{e.minute}'</span>
        <span className="text-sm font-semibold">{e.player ?? LABEL[e.type]}</span>
      </div>
      <div className="text-small text-muted-foreground">{e.player ? `${LABEL[e.type]}${e.detail ? ` · ${e.detail}` : ""}` : e.detail}</div>
    </div>
  );
}
