import { Link } from "@tanstack/react-router";
import { CalendarClock, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PersonAvatar } from "@/components/ds/avatars";
import { FootballIdTag, VerifiedMark } from "@/components/ds/football-id";
import { OrgCrest } from "@/components/ds/team-crest";
import { getOrganization, getTeam, listSchedule } from "@/data/repository";
import type { Player } from "@/data/types";
import { relativeDay } from "@/lib/format";

export function ChildCard({ child }: { child: Player }) {
  const team = getTeam(child.teamId);
  const org = getOrganization(child.orgId);
  const next = listSchedule(child.teamId ? [child.teamId] : []).find((s) => s.teamId === child.teamId);
  return (
    <Link to="/children/$playerId" params={{ playerId: child.id }} className="surface group block overflow-hidden transition-shadow hover:shadow-elevated">
      <div className="flex items-center gap-4 p-5">
        <PersonAvatar name={child.name} src={child.photo} size="xl" className="rounded-2xl [&>*]:rounded-2xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-h2">{child.nickname ?? child.name}</h3>
            <VerifiedMark verified={child.verification === "verified"} />
          </div>
          <p className="truncate text-small text-muted-foreground">{child.name}</p>
          <FootballIdTag id={child.footballId} copy={false} className="mt-2" />
        </div>
        <ChevronRight className="hidden size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
      </div>
      <div className="grid grid-cols-2 border-t">
        <div className="border-r p-4">
          <div className="text-label text-muted-foreground">Team</div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
            {org && <OrgCrest orgId={org.id} size="xs" />}
            <span className="truncate">{team?.name}</span>
          </div>
          <div className="mt-0.5 truncate text-small text-muted-foreground">{org?.name}</div>
        </div>
        <div className="p-4">
          <div className="text-label text-muted-foreground">Attendance · 30 days</div>
          <div className="mt-1 font-display text-lg font-semibold">{child.attendance}%</div>
          <Progress value={child.attendance} className="mt-1.5 h-1.5" />
        </div>
      </div>
      {next && (
        <div className="flex items-center gap-3 border-t bg-muted/40 px-5 py-3 text-small">
          <CalendarClock className="size-4 text-primary" />
          <span className="truncate"><b>{relativeDay(next.date)} {next.start}</b> · {next.title}</span>
        </div>
      )}
    </Link>
  );
}
