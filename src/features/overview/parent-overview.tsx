import { Link } from "@tanstack/react-router";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { MatchRow } from "@/components/ds/match-card";
import { guardians } from "@/data/mock";
import { getPlayer, listSchedule, recentMatches } from "@/data/repository";
import type { Player } from "@/data/types";
import { ChildCard } from "@/features/children/child-card";

export function ParentOverview() {
  const children = (guardians[0]?.childIds ?? []).map((id) => getPlayer(id)).filter(Boolean) as Player[];
  const teamIds = children.map((c) => c.teamId!).filter(Boolean);
  const sched = listSchedule(teamIds).filter((s) => !s.teamId || teamIds.includes(s.teamId));
  const results = teamIds.flatMap((t) => recentMatches(t)).slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Guardian" title="Hi Andi 👋" description="Everything about Rizky and Aisyah's football, in one place." />

      <div className="flex items-start gap-4 rounded-2xl border border-info/25 bg-info/5 p-4 md:items-center md:p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-info/12 text-info"><ShieldCheck className="size-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">SSB Garuda Makassar is asking for consent</div>
          <div className="text-small text-muted-foreground">Feature Rizky's photo in Makassar Youth Cup media. You decide — and can change it any time.</div>
        </div>
        <Button asChild size="sm" className="shrink-0"><Link to="/children/$playerId" params={{ playerId: "p-123" }}>Review</Link></Button>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-h2">My children</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/children">Manage <ChevronRight /></Link></Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">{children.map((c) => <ChildCard key={c.id} child={c} />)}</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Coming up" description="Training, matches & meetings for your family" flush>
          <div className="divide-y">{sched.slice(0, 5).map((s) => <ScheduleRow key={s.id} item={s} />)}</div>
        </Section>
        <Section title="Latest results" flush>
          <div className="divide-y">{results.map((m) => <MatchRow key={m.id} match={m} />)}</div>
        </Section>
      </div>
    </div>
  );
}
