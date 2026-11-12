import { BadgeCheck, DoorOpen, Fingerprint, LogIn, Medal, Shield, Trophy, type LucideIcon } from "lucide-react";
import type { JourneyEvent } from "@/data/types";
import { getOrganization } from "@/data/repository";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Crest } from "./avatars";

const ICONS: Record<JourneyEvent["type"], LucideIcon> = {
  identity: Fingerprint, join: LogIn, leave: DoorOpen, team: Shield, competition: Trophy, achievement: Medal, verification: BadgeCheck,
};

const TONE: Record<JourneyEvent["type"], string> = {
  identity: "bg-ink text-signal",
  join: "bg-primary text-primary-foreground",
  leave: "bg-muted text-muted-foreground",
  team: "bg-accent text-accent-foreground",
  competition: "bg-info/12 text-info",
  achievement: "bg-warning/15 text-warning",
  verification: "bg-info/12 text-info",
};

/** The football passport timeline: grouped by year, newest last, ends with a "Now" marker. */
export function JourneyTimeline({ events, compact }: { events: JourneyEvent[]; compact?: boolean | undefined }) {
  const years = [...new Set(events.map((e) => e.year))].sort();
  return (
    <ol className="relative">
      {years.map((year) => (
        <li key={year} className="grid grid-cols-[3.5rem_1fr] gap-4 md:grid-cols-[5rem_1fr]">
          <div className="pt-1 text-right font-display text-lg font-semibold text-muted-foreground md:text-xl">{year}</div>
          <ol className="relative border-l-2 border-border pb-6 pl-6">
            {events.filter((e) => e.year === year).map((e) => {
              const Icon = ICONS[e.type];
              const org = getOrganization(e.orgId);
              return (
                <li key={e.id} className="relative pb-5 last:pb-0">
                  <span className={cn("absolute -left-[2.35rem] top-0 grid size-7 place-items-center rounded-full ring-4 ring-background", TONE[e.type])}>
                    <Icon className="size-3.5" />
                  </span>
                  <div className={cn(!compact && "surface p-4")}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-h3">{e.title}</h3>
                      <time className="text-small text-muted-foreground">{fmtDate(e.date)}</time>
                    </div>
                    <p className="mt-1 text-small text-muted-foreground">{e.detail}</p>
                    {!compact && (org || e.verifiedBy) && (
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-small text-muted-foreground">
                        {org && <span className="flex items-center gap-1.5"><Crest label={org.short} hue={org.color} size="xs" />{org.name}</span>}
                        {e.verifiedBy && <span className="flex items-center gap-1 text-info"><BadgeCheck className="size-3.5" />Recorded by {e.verifiedBy}</span>}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </li>
      ))}
      <li className="grid grid-cols-[3.5rem_1fr] gap-4 md:grid-cols-[5rem_1fr]">
        <div className="text-right text-label text-primary">Now</div>
        <div className="relative pl-6">
          <span className="absolute -left-[0.4rem] top-0.5 size-3 rounded-full bg-signal ring-4 ring-signal/25" />
          <p className="text-small text-muted-foreground">The journey continues — this record follows the player, wherever they play.</p>
        </div>
      </li>
    </ol>
  );
}
