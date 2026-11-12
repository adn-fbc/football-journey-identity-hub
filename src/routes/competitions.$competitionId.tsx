import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarRange, MapPin, Shield, Swords, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Breadcrumbs } from "@/components/ds/page-header";
import { PageTabs, PageTabsContent, PageTabsList, PageTabsTrigger } from "@/components/ds/page-tabs";
import { InfoList, Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { StatusBadge } from "@/components/ds/status-badge";
import { MatchRow } from "@/components/ds/match-card";
import { TeamCrest } from "@/components/ds/team-crest";
import { EmptyState } from "@/components/ds/states";
import { FilterChips } from "@/components/ds/filter-bar";
import { StandingsTable } from "@/features/competitions/standings-table";
import { computeStandings, getCompetition, getOrganization, getTeam, listMatches } from "@/data/repository";
import { fmtDate, fmtDay } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/competitions/$competitionId")({
  loader: ({ params }) => {
    const competition = getCompetition(params.competitionId);
    if (!competition) throw notFound();
    return { competition };
  },
  head: ({ loaderData }) =>
    loaderData ? pageHead(loaderData.competition.name, loaderData.competition.description) : { meta: [{ title: "Unavailable · Football ID" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => <EmptyState title="Competition not found" action={<Button asChild variant="outline"><Link to="/competitions">Back</Link></Button>} />,
  component: CompetitionDetail,
});

function CompetitionDetail() {
  const { competition: c } = Route.useLoaderData();
  const all = listMatches({ competitionId: c.id });
  const played = all.filter((m) => m.status === "completed");
  const teamCount = c.categories.reduce((s, k) => s + k.teamIds.length, 0);
  const [cat, setCat] = useState(c.categories.find((k) => k.id === "u10")?.id ?? c.categories[0].id);
  const catMatches = all.filter((m) => m.categoryId === cat);
  const category = c.categories.find((k) => k.id === cat)!;
  const byDate = Object.entries(all.reduce<Record<string, typeof all>>((acc, m) => ((acc[m.date] ??= []).push(m), acc), {}));
  const catChips = <FilterChips value={cat} onChange={setCat} options={c.categories.map((k) => ({ value: k.id, label: k.label, count: k.teamIds.length }))} />;

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: "Competitions", to: "/competitions" }, { label: c.name }]} />
      <div className="pitch-lines relative overflow-hidden rounded-3xl p-6 text-ink-foreground md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2"><Trophy className="size-4 text-signal" /><span className="text-label text-ink-muted">{c.format}</span></div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">{c.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-ink-muted">
              <span className="flex items-center gap-1"><CalendarRange className="size-3.5" />{fmtDate(c.start)} – {fmtDate(c.end)}</span>
              <span className="flex items-center gap-1"><MapPin className="size-3.5" />{c.city} · {c.venues.length} venue{c.venues.length > 1 ? "s" : ""}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={c.status} className="bg-ink-foreground/10" />
            {c.status === "pending" && <Button variant="signal" onClick={() => toast.success("Registration started")}>Register team</Button>}
          </div>
        </div>
      </div>

      <PageTabs defaultValue="overview">
        <PageTabsList>
          {["Overview", "Categories", "Teams", "Schedule", "Matches", "Standings"].map((t) => <PageTabsTrigger key={t} value={t.toLowerCase()}>{t}</PageTabsTrigger>)}
        </PageTabsList>

        <PageTabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Categories" value={c.categories.length} icon={Trophy} />
            <StatCard label="Teams" value={teamCount} icon={Shield} />
            <StatCard label="Matches" value={all.length} icon={Swords} hint={`${played.length} played`} />
            <StatCard label="Venues" value={c.venues.length} icon={MapPin} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Section title="About" className="lg:col-span-2">
              <p className="text-body text-muted-foreground">{c.description}</p>
              <InfoList className="mt-5 md:grid-cols-3" items={[
                { label: "Organizer", value: c.organizer },
                { label: "Format", value: c.format },
                { label: "Registration deadline", value: c.registrationDeadline ? fmtDate(c.registrationDeadline) : "—" },
              ]} />
              {all.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-small"><span className="font-semibold">Progress</span><span className="text-muted-foreground">{played.length}/{all.length} matches</span></div>
                  <Progress value={(played.length / all.length) * 100} className="mt-2 h-2" />
                </div>
              )}
            </Section>
            <Section title="Venues" flush>
              <ul className="divide-y">{c.venues.map((v) => <li key={v} className="flex items-center gap-2 px-5 py-3 text-sm"><MapPin className="size-4 text-muted-foreground" />{v}</li>)}</ul>
            </Section>
          </div>
          {all.length > 0 && (
            <Section title="Latest & next" flush>
              <div className="divide-y">{[...played.slice(-2), ...all.filter((m) => m.status !== "completed").slice(0, 3)].map((m) => <MatchRow key={m.id} match={m} showCompetition={false} />)}</div>
            </Section>
          )}
        </PageTabsContent>

        <PageTabsContent value="categories">
          <div className="grid gap-4 md:grid-cols-3">
            {c.categories.map((k) => (
              <div key={k.id} className="surface p-5">
                <div className="flex items-center justify-between"><span className="font-display text-3xl font-semibold">{k.label}</span><span className="rounded-md bg-muted px-2 py-0.5 text-small font-semibold">{k.teamIds.length} teams</span></div>
                <InfoList className="mt-4" items={[{ label: "Birth years", value: k.birthYear }, { label: "Format", value: k.format }, { label: "Groups", value: k.groups.length }, { label: "Matches", value: all.filter((m) => m.categoryId === k.id).length }]} />
              </div>
            ))}
          </div>
        </PageTabsContent>

        <PageTabsContent value="teams" className="space-y-4">
          {catChips}
          {category.teamIds.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {category.teamIds.map((id) => {
                const t = getTeam(id)!;
                return (
                  <Link key={id} to="/teams/$teamId" params={{ teamId: id }} className="surface flex items-center gap-3 p-4 hover:shadow-elevated">
                    <TeamCrest teamId={id} />
                    <div className="min-w-0"><div className="truncate text-sm font-semibold">{t.name}</div><div className="truncate text-small text-muted-foreground">{getOrganization(t.orgId)?.name}</div></div>
                  </Link>
                );
              })}
            </div>
          ) : <EmptyState icon={Shield} title="No teams yet" description="Teams appear here once registrations are approved." />}
        </PageTabsContent>

        <PageTabsContent value="schedule">
          {byDate.length ? (
            <div className="space-y-4">
              {byDate.map(([date, ms]) => (
                <Section key={date} title={fmtDay(date)} description={[...new Set(ms.map((m) => m.venue))].join(" · ")} flush>
                  <div className="divide-y">{ms.map((m) => <MatchRow key={m.id} match={m} showCompetition={false} />)}</div>
                </Section>
              ))}
            </div>
          ) : <EmptyState icon={CalendarRange} title="Schedule not published" description="The organizer hasn't published fixtures yet." />}
        </PageTabsContent>

        <PageTabsContent value="matches" className="space-y-4">
          {catChips}
          {catMatches.length ? <Section flush><div className="divide-y">{catMatches.map((m) => <MatchRow key={m.id} match={m} showCompetition={false} />)}</div></Section> : <EmptyState icon={Swords} title="No matches in this category" />}
        </PageTabsContent>

        <PageTabsContent value="standings" className="space-y-4">
          {catChips}
          {category.groups.some((g) => g.teamIds.length) ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {category.groups.map((g) => (
                <Section key={g.name} title={`${category.label} · ${g.name}`} description="Top 2 advance" flush>
                  <StandingsTable rows={computeStandings(g.teamIds, all)} />
                </Section>
              ))}
            </div>
          ) : <EmptyState icon={Trophy} title="No standings yet" />}
        </PageTabsContent>
      </PageTabs>
    </div>
  );
}
