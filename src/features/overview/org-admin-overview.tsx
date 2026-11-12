import { Link } from "@tanstack/react-router";
import { AlertCircle, CalendarPlus, ChevronRight, FileWarning, Shield, ShieldPlus, Swords, Trophy, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { StatusBadge } from "@/components/ds/status-badge";
import { PersonAvatar } from "@/components/ds/avatars";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { MatchRow } from "@/components/ds/match-card";
import { activity } from "@/data/mock";
import { getOrganization, getTeam, listPlayers, listSchedule, upcomingMatches } from "@/data/repository";

const ORG_ID = "garuda";

export function OrgAdminOverview() {
  const org = getOrganization(ORG_ID)!;
  const pending = listPlayers({ orgId: ORG_ID }).filter((p) => p.membership === "pending");
  const unverified = listPlayers({ orgId: ORG_ID }).filter((p) => p.verification === "pending");
  const sched = listSchedule().filter((s) => !s.teamId || getTeam(s.teamId)?.orgId === ORG_ID);
  const trainings = sched.filter((s) => s.type === "training");
  const matches = upcomingMatches().filter((m) => [m.homeId, m.awayId].some((t) => getTeam(t)?.orgId === ORG_ID));

  const attention = [
    { icon: UserPlus, tone: "text-warning bg-warning/12", title: `${pending.length} registration requests waiting`, body: "Guardian consent received — review and approve membership.", action: "Review", to: "/players" as const },
    { icon: FileWarning, tone: "text-destructive bg-destructive/10", title: `${unverified.length} Football IDs not yet verified`, body: "Players can't be registered for competitions until verified.", action: "Verify", to: "/players" as const },
    { icon: Trophy, tone: "text-info bg-info/12", title: "Liga Anak Sulsel 2027 closes 1 Mar", body: "Garuda U10 and Garuda U12 are eligible but not registered.", action: "Register", to: "/competitions" as const },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${org.name} · Season 2026/27`}
        title="Good afternoon, Andi"
        description="Here's what needs your attention at the club this week."
        actions={
          <>
            <Button variant="outline" onClick={() => toast("Schedule training — coming in Training module")}><CalendarPlus /> Schedule training</Button>
            <Button onClick={() => toast.success("Registration link copied", { description: "Share it with guardians to start a membership request." })}><UserPlus /> Register player</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <StatCard label="Total players" value={org.players} hint="+6 this month" trend="up" icon={Users} />
        <StatCard label="Active teams" value={7} hint="1 draft · U14" icon={Shield} />
        <StatCard label="Upcoming training" value={trainings.length} hint="Next 7 days" icon={CalendarPlus} />
        <StatCard label="Upcoming matches" value={matches.length} hint="Next 14 days" icon={Swords} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title={<span className="flex items-center gap-2"><AlertCircle className="size-4 text-warning" />Attention required</span>} flush>
            <ul className="divide-y">
              {attention.map((a) => (
                <li key={a.title} className="flex items-center gap-4 px-5 py-4">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${a.tone}`}><a.icon className="size-[18px]" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{a.title}</div>
                    <div className="text-small text-muted-foreground">{a.body}</div>
                  </div>
                  <Button asChild variant="outline" size="sm"><Link to={a.to}>{a.action}</Link></Button>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Upcoming activities" description="Training, matches and club events" action={<Button asChild variant="ghost" size="sm"><Link to="/schedule">Full schedule <ChevronRight /></Link></Button>} flush>
            <div className="divide-y">{sched.slice(0, 6).map((s) => <ScheduleRow key={s.id} item={s} />)}</div>
          </Section>

          <Section title="Upcoming matches" action={<Button asChild variant="ghost" size="sm"><Link to="/matches">All matches <ChevronRight /></Link></Button>} flush>
            <div className="divide-y">{matches.slice(0, 4).map((m) => <MatchRow key={m.id} match={m} />)}</div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Quick actions">
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: UserPlus, label: "Add player", to: "/players" as const },
                { icon: ShieldPlus, label: "Create team", to: "/teams" as const },
                { icon: CalendarPlus, label: "Add activity", to: "/schedule" as const },
                { icon: Trophy, label: "Join competition", to: "/competitions" as const },
              ].map((q) => (
                <Link key={q.label} to={q.to} className="flex flex-col items-start gap-3 rounded-xl border bg-muted/30 p-3.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-accent">
                  <q.icon className="size-5 text-primary" />{q.label}
                </Link>
              ))}
            </div>
          </Section>

          <Section title="Recent registrations" action={<Button asChild variant="ghost" size="sm"><Link to="/players">View all</Link></Button>} flush>
            <ul className="divide-y">
              {[...pending, ...listPlayers({ orgId: ORG_ID }).filter((p) => p.memberSince && p.memberSince >= "2026-01-01")].slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link to="/players/$playerId" params={{ playerId: p.id }} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40">
                    <PersonAvatar name={p.name} src={p.photo} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{p.name}</div>
                      <div className="text-small text-muted-foreground">{getTeam(p.teamId)?.name} · {p.birthYear}</div>
                    </div>
                    <StatusBadge status={p.membership} />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Recent activity">
            <ol className="space-y-4">
              {activity.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary/60" />
                  <div className="text-small">
                    <span className="font-semibold">{a.who}</span> <span className="text-muted-foreground">{a.what}</span>
                    <div className="text-[11px] text-muted-foreground/80">{a.when}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </div>
    </div>
  );
}
