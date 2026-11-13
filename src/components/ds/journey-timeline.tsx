import { BadgeCheck, DoorOpen, Fingerprint, LogIn, Medal, Shield, Trophy, type LucideIcon } from "lucide-react";
import { Fragment } from "react";
import type { JourneyEvent, JourneySourceDomain } from "@/data/types";
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

const SOURCE_LABELS: Record<JourneySourceDomain, string> = {
  player_identity: "Player identity",
  player_affiliation: "Organization affiliation",
  team_affiliation: "Team affiliation",
  competition: "Competition",
  match: "Match",
  achievement: "Achievement",
  training_session: "Training session",
  attendance_record: "Attendance record",
  development_assessment: "Development assessment",
  coach_observation: "Coach observation",
};

/** The football passport timeline, grouped by year with a marker at today's date. */
export function JourneyTimeline({ events, compact }: { events: JourneyEvent[]; compact?: boolean | undefined }) {
  const today = new Date().toISOString().slice(0, 10);
  const eventsByYear = new Map<number, JourneyEvent[]>();
  for (const event of [...events].sort((a, b) => a.date.localeCompare(b.date))) {
    const year = Number(event.date.slice(0, 4));
    const yearEvents = eventsByYear.get(year) ?? [];
    yearEvents.push(event);
    eventsByYear.set(year, yearEvents);
  }
  const currentYear = Number(today.slice(0, 4));
  const years = [...new Set([...eventsByYear.keys(), currentYear])].sort((a, b) => a - b);
  const renderNow = () => (
    <li className="relative" key="now">
      <span className="absolute -left-[1.9rem] top-0.5 size-3 rounded-full bg-signal ring-4 ring-signal/25" />
      <div className="text-label text-primary">Now</div>
      <p className="mt-1 text-small text-muted-foreground">
        {events.length ? "The journey continues — this record follows the player, wherever they play." : "The player’s journey will appear here as events are recorded."}
      </p>
    </li>
  );
  return (
    <ol className="relative">
      {years.map((year) => (
        <li key={year} className="grid grid-cols-[3.5rem_1fr] gap-4 md:grid-cols-[5rem_1fr]">
          <div className="pt-1 text-right font-display text-lg font-semibold text-muted-foreground md:text-xl">{year}</div>
          <ol className="relative border-l-2 border-border pb-6 pl-6">
            {(eventsByYear.get(year) ?? []).map((e, index, yearEvents) => {
              const Icon = ICONS[e.type];
              const org = getOrganization(e.orgId);
              const sourceOrganization = getOrganization(e.provenance?.sourceOrganizationId);
              const nowIndex = yearEvents.findIndex((event) => event.date > today);
              return (
                <Fragment key={e.id}>
                  {year === currentYear && nowIndex === index && renderNow()}
                  <li className="relative pb-5 last:pb-0">
                    <span className={cn("absolute -left-[2.35rem] top-0 grid size-7 place-items-center rounded-full ring-4 ring-background", TONE[e.type])}>
                      <Icon className="size-3.5" />
                    </span>
                    <div className={cn(!compact && "surface p-4")}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-h3">{e.title}</h3>
                        <time className="text-small text-muted-foreground">{fmtDate(e.date)}</time>
                      </div>
                      <p className="mt-1 text-small text-muted-foreground">{e.detail}</p>
                      {!compact && (
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-small text-muted-foreground">
                          {org && <span className="flex items-center gap-1.5"><Crest label={org.short} hue={org.color} size="xs" />{org.name}</span>}
                          {e.provenance ? (
                            <span className="flex flex-wrap items-center gap-1.5">
                              {sourceOrganization && <Crest label={sourceOrganization.short} hue={sourceOrganization.color} size="xs" />}
                              Source: {SOURCE_LABELS[e.provenance.sourceDomain]} · record {e.provenance.sourceRecordId}
                            </span>
                          ) : (
                            <span>Historical record · source record unavailable</span>
                          )}
                          {e.provenance?.recordedBy && <span>Recorded by {e.provenance.recordedBy}</span>}
                          {e.provenance?.verificationStatus === "verified" && <span className="flex items-center gap-1 text-info"><BadgeCheck className="size-3.5" />Verified source</span>}
                          {e.provenance?.verificationStatus === "pending" && <span>Source verification pending</span>}
                          {e.provenance?.verificationStatus === "unverified" && <span>Source unverified</span>}
                        </div>
                      )}
                    </div>
                  </li>
                  {year === currentYear && nowIndex === -1 && index === yearEvents.length - 1 && renderNow()}
                </Fragment>
              );
            })}
            {year === currentYear && !eventsByYear.has(year) && renderNow()}
          </ol>
        </li>
      ))}
    </ol>
  );
}
