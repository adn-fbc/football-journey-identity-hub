import { Link } from "@tanstack/react-router";
import { CalendarDays, Dumbbell, MapPin, Swords, Users } from "lucide-react";
import type { ScheduleItem } from "@/data/types";
import { getTeam } from "@/data/repository";
import { relativeDay } from "@/lib/format";
import { cn } from "@/lib/utils";

const META = {
  training: { icon: Dumbbell, label: "Training", cls: "bg-accent text-accent-foreground" },
  match: { icon: Swords, label: "Match", cls: "bg-ink text-signal" },
  event: { icon: CalendarDays, label: "Event", cls: "bg-info/12 text-info" },
  meeting: { icon: Users, label: "Meeting", cls: "bg-warning/15 text-warning" },
} as const;

export function ScheduleRow({ item, showDate = true }: { item: ScheduleItem; showDate?: boolean | undefined }) {
  const m = META[item.type];
  const team = getTeam(item.teamId);
  const body = (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 md:px-5">
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", m.cls)}>
        <m.icon className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{item.title}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-small text-muted-foreground">
          {team && <span>{team.name}</span>}
          <span className="flex items-center gap-1"><MapPin className="size-3" />{item.venue}</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        {showDate && <div className="text-small font-semibold">{relativeDay(item.date)}</div>}
        <div className="text-small tabular-nums text-muted-foreground">{item.start}–{item.end}</div>
      </div>
    </div>
  );
  return item.matchId ? (
    <Link to="/matches/$matchId" params={{ matchId: item.matchId }} className="block">{body}</Link>
  ) : (
    <div>{body}</div>
  );
}

export const SCHEDULE_META = META;
