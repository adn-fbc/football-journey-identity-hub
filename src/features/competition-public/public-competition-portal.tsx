import { useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Medal,
  MoreHorizontal,
  Radio,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamCrest } from "@/components/ds/team-crest";
import { fmtDate } from "@/lib/format";
import type { getPublicCompetitionSnapshot } from "./public-competition-model";

type PublicSnapshot = NonNullable<ReturnType<typeof getPublicCompetitionSnapshot>>;

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Trophy },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "live", label: "Live", icon: Radio },
  { id: "standings", label: "Standings", icon: Medal },
] as const;

export function PublicCompetitionPortal({ snapshot }: { snapshot: PublicSnapshot }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const { competition } = snapshot;
  const competitionLabel =
    competition.status === "active"
      ? snapshot.featuredMatch?.status === "live"
        ? "Live competition"
        : "Active competition"
      : competition.status === "pending"
        ? "Registration open"
        : competition.status === "completed"
          ? "Competition completed"
          : "Competition information";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-8">
          <a
            href="#home"
            className="flex min-w-0 items-center gap-2.5"
            aria-label="Football ID competition home"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-ink text-signal">
              <Trophy className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-foreground">Football ID</span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                Competition portal
              </span>
            </span>
          </a>
          <nav
            aria-label="Competition sections"
            className="ml-auto hidden items-center gap-5 md:flex"
          >
            {[...NAV_ITEMS, { id: "teams", label: "Teams" }, { id: "info", label: "Info" }].map(
              (item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <a href="#schedule">
              View schedule <ChevronRight />
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 md:space-y-10 md:px-8 md:py-8">
        <section
          id="home"
          className="pitch-lines relative overflow-hidden rounded-xl p-5 text-ink-foreground md:p-8"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-label text-signal">{competition.short}</span>
                <span className="text-ink-muted" aria-hidden="true">
                  /
                </span>
                <span className="text-label text-ink-muted">{competitionLabel}</span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-semibold md:text-5xl">
                {competition.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-ink-muted md:text-base">
                {competition.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-small text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-signal" />
                  {fmtDate(competition.start, "d MMM yyyy")} –{" "}
                  {fmtDate(competition.end, "d MMM yyyy")}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-signal" />
                  {competition.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Trophy className="size-4 text-signal" />
                  {competition.format}
                </span>
              </div>
            </div>
            {snapshot.featuredMatch && (
              <a
                href="#live"
                className="flex shrink-0 items-center gap-3 rounded-lg border border-ink-border bg-ink-foreground/5 px-4 py-3 text-sm font-semibold text-ink-foreground hover:bg-ink-foreground/10"
              >
                <MatchStatus status={snapshot.featuredMatch.status} />
                <span>
                  {snapshot.featuredMatch.home.name} vs {snapshot.featuredMatch.away.name}
                </span>
                <ChevronRight className="size-4 text-signal" />
              </a>
            )}
          </div>
        </section>

        <section
          id="live"
          aria-labelledby="featured-match-title"
          className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]"
        >
          {snapshot.featuredMatch ? (
            <article className="surface overflow-hidden rounded-lg">
              <div className="flex items-center justify-between border-b px-5 py-3">
                <h2 id="featured-match-title" className="text-label">
                  Featured match
                </h2>
                <MatchStatus status={snapshot.featuredMatch.status} />
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-7 md:gap-6 md:px-8 md:py-9">
                <PublicTeamSide
                  id={snapshot.featuredMatch.home.id}
                  name={snapshot.featuredMatch.home.name}
                />
                <div className="text-center">
                  <div className="font-display text-3xl font-bold tabular-nums text-foreground md:text-5xl">
                    {snapshot.featuredMatch.score
                      ? `${snapshot.featuredMatch.score.home} : ${snapshot.featuredMatch.score.away}`
                      : "VS"}
                  </div>
                  <div className="mt-2 text-small text-muted-foreground">
                    {snapshot.featuredMatch.status === "live"
                      ? "In progress"
                      : snapshot.featuredMatch.status === "completed"
                        ? "Full time"
                        : `${fmtDate(snapshot.featuredMatch.date, "d MMM")} · ${snapshot.featuredMatch.time}`}
                  </div>
                </div>
                <PublicTeamSide
                  id={snapshot.featuredMatch.away.id}
                  name={snapshot.featuredMatch.away.name}
                />
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t px-5 py-3 text-small text-muted-foreground">
                <span>
                  {snapshot.featuredMatch.category} · {snapshot.featuredMatch.round}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {snapshot.featuredMatch.venue}
                </span>
              </div>
            </article>
          ) : (
            <article className="surface rounded-lg p-6">
              <h2 id="featured-match-title" className="text-h3">
                No matches available
              </h2>
              <p className="mt-2 text-small text-muted-foreground">
                The competition schedule will be published soon.
              </p>
            </article>
          )}

          <section
            aria-labelledby="today-matches-title"
            className="surface overflow-hidden rounded-lg"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 id="today-matches-title" className="text-h3">
                Today&apos;s matches
              </h2>
              <a href="#schedule" className="text-small font-semibold text-primary">
                Full schedule
              </a>
            </div>
            {snapshot.todayMatches.length ? (
              <ul className="divide-y">
                {snapshot.todayMatches.slice(0, 4).map((match) => (
                  <li key={match.id} className="flex items-center gap-3 px-5 py-3">
                    <time className="w-12 shrink-0 text-small font-semibold tabular-nums">
                      {match.time}
                    </time>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">
                        {match.home.name} – {match.away.name}
                      </div>
                      <div className="text-small text-muted-foreground">{match.venue}</div>
                    </div>
                    {match.score ? (
                      <span className="font-display text-sm font-bold tabular-nums">
                        {match.score.home}–{match.score.away}
                      </span>
                    ) : (
                      <MatchStatus status={match.status} />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-7 text-small text-muted-foreground">
                No matches scheduled today.
              </p>
            )}
          </section>
        </section>

        <section
          id="schedule"
          aria-labelledby="schedule-title"
          className="surface overflow-hidden rounded-lg"
        >
          <div className="flex items-end justify-between gap-4 border-b px-5 py-4">
            <div>
              <div className="text-label text-primary">
                {snapshot.upcomingMatches.length} fixtures
              </div>
              <h2 id="schedule-title" className="mt-1 text-h2">
                Upcoming schedule
              </h2>
            </div>
            <a href="#info" className="text-small font-semibold text-primary">
              Competition info
            </a>
          </div>
          {snapshot.upcomingMatches.length ? (
            <ul className="divide-y">
              {snapshot.upcomingMatches.slice(0, 8).map((match) => (
                <li
                  key={match.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5"
                >
                  <div className="w-20 shrink-0">
                    <div className="text-small font-semibold">{fmtDate(match.date, "d MMM")}</div>
                    <div className="text-small tabular-nums text-muted-foreground">
                      {match.time}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                      <span>{match.home.name}</span>
                      <span className="text-muted-foreground">
                        {match.score ? `${match.score.home}–${match.score.away}` : "vs"}
                      </span>
                      <span>{match.away.name}</span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 text-small text-muted-foreground">
                      <span>
                        {match.category} · {match.round}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {match.venue}
                      </span>
                    </div>
                  </div>
                  <MatchStatus status={match.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-7 text-small text-muted-foreground">
              {competition.status === "completed"
                ? "This competition has no upcoming fixtures."
                : "The schedule will be published soon."}
            </p>
          )}
        </section>

        <section
          id="results"
          aria-labelledby="results-title"
          className="surface overflow-hidden rounded-lg"
        >
          <div className="border-b px-5 py-4">
            <div className="text-label text-primary">
              {snapshot.latestResults.length} recent results
            </div>
            <h2 id="results-title" className="mt-1 text-h2">
              Latest results
            </h2>
          </div>
          {snapshot.latestResults.length ? (
            <ul className="divide-y">
              {snapshot.latestResults.map((match) => (
                <li
                  key={match.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5"
                >
                  <div className="w-20 shrink-0">
                    <div className="text-small font-semibold">{fmtDate(match.date, "d MMM")}</div>
                    <div className="text-small text-muted-foreground">{match.category}</div>
                  </div>
                  <div className="min-w-0 flex-1 text-sm font-semibold">
                    <span>{match.home.name}</span>
                    <span className="px-2 font-display tabular-nums">
                      {match.score ? `${match.score.home}–${match.score.away}` : "FT"}
                    </span>
                    <span>{match.away.name}</span>
                  </div>
                  <MatchStatus status={match.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-7 text-small text-muted-foreground">
              Completed results will appear here.
            </p>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section
            id="standings"
            aria-labelledby="standings-title"
            className="surface overflow-hidden rounded-lg"
          >
            <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
              <div>
                <div className="text-label text-primary">
                  {snapshot.standingsCategory ?? "Competition"}
                  {snapshot.standingsGroup ? ` · ${snapshot.standingsGroup}` : ""}
                </div>
                <h2 id="standings-title" className="mt-1 text-h2">
                  Standings
                </h2>
              </div>
              <a href="#info" className="text-small font-semibold text-primary">
                Rules
              </a>
            </div>
            {snapshot.standingsPreview.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] text-left text-sm">
                  <thead className="bg-muted/50 text-small text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">#</th>
                      <th className="px-4 py-3 font-medium">Team</th>
                      <th className="px-3 py-3 text-right font-medium">P</th>
                      <th className="px-3 py-3 text-right font-medium">W</th>
                      <th className="px-3 py-3 text-right font-medium">D</th>
                      <th className="px-3 py-3 text-right font-medium">L</th>
                      <th className="px-4 py-3 text-right font-semibold text-foreground">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {snapshot.standingsPreview.slice(0, 5).map((row) => (
                      <tr key={row.teamId}>
                        <td className="px-4 py-3 font-semibold tabular-nums">{row.rank}</td>
                        <td className="px-4 py-3">
                          <span className="flex min-w-0 items-center gap-2">
                            <TeamCrest teamId={row.teamId} size="xs" />
                            <span className="truncate font-semibold">{row.teamName}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">{row.played}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{row.won}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{row.drawn}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{row.lost}</td>
                        <td className="px-4 py-3 text-right font-bold tabular-nums">
                          {row.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-5 py-7 text-small text-muted-foreground">
                Standings will appear after results are recorded.
              </p>
            )}
          </section>

          <section
            id="teams"
            aria-labelledby="teams-title"
            className="surface overflow-hidden rounded-lg"
          >
            <div className="border-b px-5 py-4">
              <div className="text-label text-primary">{snapshot.teams.length} participants</div>
              <h2 id="teams-title" className="mt-1 text-h2">
                Teams
              </h2>
            </div>
            {snapshot.teams.length ? (
              <ul className="divide-y">
                {snapshot.teams.slice(0, 6).map((team) => (
                  <li key={team.id} className="flex items-center gap-3 px-5 py-3">
                    <TeamCrest teamId={team.id} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{team.name}</div>
                      <div className="truncate text-small text-muted-foreground">
                        {team.organization}
                      </div>
                    </div>
                    <Badge variant="outline">{team.ageCategory}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-7 text-small text-muted-foreground">
                Participating teams will appear here.
              </p>
            )}
          </section>
        </div>

        <section
          id="info"
          aria-labelledby="info-title"
          className="grid gap-6 rounded-lg border bg-muted/30 p-5 md:grid-cols-[1fr_1.2fr] md:p-6"
        >
          <div>
            <div className="text-label text-primary">Official information</div>
            <h2 id="info-title" className="mt-1 text-h2">
              About the competition
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {competition.description}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <PublicInfo label="Organizer" value={competition.organizer} />
            <PublicInfo label="Format" value={competition.format} />
            <PublicInfo label="Location" value={competition.city} />
            <PublicInfo label="Venues" value={competition.venues.join(" · ")} />
          </dl>
        </section>
      </main>

      <footer className="border-t bg-card px-4 py-6 text-small text-muted-foreground md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold text-foreground">Football ID · {competition.name}</span>
          <span>Public competition information · Managed by the organizer</span>
        </div>
      </footer>

      <nav
        aria-label="Mobile competition sections"
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setMoreOpen(false)}
                className="flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
              >
                <item.icon className="size-4" />
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((open) => !open)}
              className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="size-4" />
              More
            </button>
          </li>
        </ul>
      </nav>
      {moreOpen && (
        <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] right-3 z-40 w-44 rounded-lg border bg-background p-2 shadow-lg md:hidden">
          <a
            href="#teams"
            onClick={() => setMoreOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Teams
          </a>
          <a
            href="#info"
            onClick={() => setMoreOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Info
          </a>
        </div>
      )}
    </div>
  );
}

function PublicTeamSide({ id, name }: { id: string; name: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <TeamCrest teamId={id} size="lg" />
      <span className="max-w-full break-words text-sm font-semibold md:text-base">{name}</span>
    </div>
  );
}

function MatchStatus({ status }: { status: string }) {
  const label =
    status === "live"
      ? "LIVE"
      : status === "completed"
        ? "FINISHED"
        : status === "cancelled"
          ? "CANCELLED"
          : "UPCOMING";
  const color =
    status === "live"
      ? "text-live"
      : status === "completed"
        ? "text-muted-foreground"
        : status === "cancelled"
          ? "text-destructive"
          : "text-primary";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-label ${color}`}
    >
      {status === "live" && <span className="size-1.5 rounded-full bg-live" aria-hidden="true" />}
      {label}
    </span>
  );
}

function PublicInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-label text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-semibold text-foreground">{value}</dd>
    </div>
  );
}
