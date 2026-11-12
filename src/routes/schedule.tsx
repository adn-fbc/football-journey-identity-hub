import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/ds/page-header";
import { FilterChips } from "@/components/ds/filter-bar";
import { Section } from "@/components/ds/section";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { EmptyState } from "@/components/ds/states";
import { guardians } from "@/data/mock";
import { getPlayer, getTeam, listSchedule } from "@/data/repository";
import type { ScheduleItem } from "@/data/types";
import { fmtDay, relativeDay } from "@/lib/format";
import { useRole } from "@/lib/role-context";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/schedule")({
  head: () => pageHead("Schedule", "Training sessions, matches and club events in one agenda."),
  component: SchedulePage,
});

type T = "all" | ScheduleItem["type"];

function SchedulePage() {
  const { role } = useRole();
  const [type, setType] = useState<T>("all");
  const teamIds =
    role === "parent" ? guardians[0].childIds.map((id) => getPlayer(id)?.teamId).filter(Boolean) as string[]
    : role === "player" ? ["garuda-u10"]
    : role === "coach" ? ["garuda-u8"]
    : undefined;
  const items = listSchedule(teamIds).filter((s) => (!teamIds || !s.teamId || teamIds.includes(s.teamId)) && (type === "all" || s.type === type));
  const days = Object.entries(items.reduce<Record<string, ScheduleItem[]>>((acc, s) => ((acc[s.date] ??= []).push(s), acc), {}));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description={teamIds ? `Showing ${teamIds.map((t) => getTeam(t)?.name).join(" & ")} and club events.` : "All activities across SSB Garuda Makassar."}
      />
      <FilterChips value={type} onChange={setType} options={[
        { value: "all", label: "All" }, { value: "training", label: "Training" }, { value: "match", label: "Matches" },
        { value: "event", label: "Events" }, { value: "meeting", label: "Meetings" },
      ]} />
      {days.length ? (
        <div className="space-y-4">
          {days.map(([date, list]) => (
            <Section key={date} title={relativeDay(date) === fmtDay(date) ? fmtDay(date) : `${relativeDay(date)} · ${fmtDay(date)}`} flush>
              <div className="divide-y">{list.map((s) => <ScheduleRow key={s.id} item={s} showDate={false} />)}</div>
            </Section>
          ))}
        </div>
      ) : <EmptyState title="Nothing scheduled" description="No activities match this filter." />}
    </div>
  );
}
