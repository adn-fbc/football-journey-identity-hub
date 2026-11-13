import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ds/page-header";
import { FilterChips } from "@/components/ds/filter-bar";
import { Section } from "@/components/ds/section";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { EmptyState, PermissionState } from "@/components/ds/states";
import { ChildSelector } from "@/features/children/child-selector";
import {
  getCurrentGuardianId,
  getGuardianAccessDecision,
  getTeam,
  listCurrentGuardianChildren,
  getPlayer,
  listSchedule,
} from "@/data/repository";
import type { ScheduleItem } from "@/data/types";
import { fmtDay, relativeDay } from "@/lib/format";
import { useRole } from "@/lib/role-context";
import { pageHead } from "@/lib/seo";
import { getCoachAssignedTeams } from "@/lib/coach-access";

export const Route = createFileRoute("/schedule")({
  head: () => pageHead("Schedule", "Training sessions, matches and club events in one agenda."),
  component: SchedulePage,
});

type T = "all" | ScheduleItem["type"];

function SchedulePage() {
  const { role, ready } = useRole();
  const [type, setType] = useState<T>("all");
  const [selectedChildId, setSelectedChildId] = useState("");
  if (!ready) {
    return <PermissionState title="Schedule access unavailable" description="The active workspace scope has not been resolved." />;
  }
  const guardianId = role === "parent" ? getCurrentGuardianId() : undefined;
  const linkedChildren = role === "parent" ? listCurrentGuardianChildren() : [];
  const children = guardianId
    ? linkedChildren.filter((child) => getGuardianAccessDecision(guardianId, child.id, "schedule").allowed)
    : [];
  const selectedChild = children.find((child) => child.id === selectedChildId) ?? children[0];
  const coachTeamIds =
    role === "coach" ? getCoachAssignedTeams().map((team) => team.id) : undefined;
  const teamIds =
    role === "parent"
      ? selectedChild?.teamId
        ? [selectedChild.teamId]
        : []
      : role === "player"
        ? [getPlayer("p-123")?.teamId].filter((teamId): teamId is string => Boolean(teamId))
        : role === "coach"
          ? coachTeamIds
          : undefined;
  const items = (role === "parent" && !selectedChild ? [] : listSchedule(teamIds)).filter(
    (item) => {
      const matchesScope =
        role === "coach"
          ? item.teamId !== undefined && coachTeamIds?.includes(item.teamId)
          : role === "parent"
            ? item.teamId !== undefined && teamIds?.includes(item.teamId)
          : !teamIds || !item.teamId || teamIds.includes(item.teamId);
      return matchesScope && (type === "all" || item.type === type);
    },
  );
  const days = Object.entries(
    items.reduce<Record<string, ScheduleItem[]>>(
      (acc, s) => ((acc[s.date] ??= []).push(s), acc),
      {},
    ),
  );

  if (role === "parent" && linkedChildren.length > 0 && children.length === 0) {
    return (
      <PermissionState
        title="Schedule access unavailable"
        description="A current schedule-category grant is required before child activities can be shown."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description={
          role === "coach"
            ? teamIds?.length
              ? `Showing assigned teams: ${teamIds.map((teamId) => getTeam(teamId)?.name).join(" & ")}.`
              : "No teams are assigned to your Coach role yet."
            : role === "parent"
              ? selectedChild
                ? `Showing ${selectedChild.nickname ?? selectedChild.name}${selectedChild.teamId ? ` · ${getTeam(selectedChild.teamId)?.name}` : ""}.`
                : "Linked children will appear here once connected to your Football ID."
              : teamIds
                ? `Showing ${teamIds.map((t) => getTeam(t)?.name).join(" & ")} and club events.`
                : "All activities across SSB Garuda Makassar."
        }
        actions={
          ["player", "coach", "parent"].includes(role) ? (
            <Button asChild variant="outline">
              <Link to="/check-in" search={{ view: "history" }}>
                <History /> Check-in history
              </Link>
            </Button>
          ) : undefined
        }
      />
      {role === "parent" && !selectedChild ? (
        <EmptyState
          title="No children linked"
          description="Add or link a child to see their schedule here."
        />
      ) : (
        <>
          {role === "parent" && selectedChild && (
            <ChildSelector
              children={children}
              value={selectedChild.id}
              onChange={setSelectedChildId}
            />
          )}
          <FilterChips
            value={type}
            onChange={setType}
            options={[
              { value: "all", label: "All" },
              { value: "training", label: "Training" },
              { value: "match", label: "Matches" },
              { value: "event", label: "Events" },
              { value: "meeting", label: "Meetings" },
            ]}
          />
          {days.length ? (
            <div className="space-y-4">
              {days.map(([date, list]) => (
                <Section
                  key={date}
                  title={
                    relativeDay(date) === fmtDay(date)
                      ? fmtDay(date)
                      : `${relativeDay(date)} · ${fmtDay(date)}`
                  }
                  flush
                >
                  <div className="divide-y">
                    {list.map((s) => (
                      <div key={s.id} className="flex items-center gap-2 pr-3">
                        <div className="min-w-0 flex-1">
                          <ScheduleRow item={s} showDate={false} />
                        </div>
                        {["player", "coach"].includes(role) && s.teamId && (
                          <Button asChild size="sm" variant="ghost" className="shrink-0">
                            <Link
                              to="/check-in"
                              search={{ activityId: s.matchId ?? s.id }}
                              aria-label={`Check in to ${s.title}`}
                            >
                              <ScanLine /> <span className="hidden sm:inline">Check in</span>
                            </Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              ))}
            </div>
          ) : (
            <EmptyState title="Nothing scheduled" description="No activities match this filter." />
          )}
        </>
      )}
    </div>
  );
}
