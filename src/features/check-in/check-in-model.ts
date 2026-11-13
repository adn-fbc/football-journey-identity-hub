import type { RoleId } from "@/config/roles";
import {
  getCurrentUser,
  getMatch,
  getPlayer,
  getTeam,
  listCurrentGuardianChildren,
  listMatches,
  listSchedule,
} from "@/data/repository";
import { MOCK_TODAY } from "@/data/mock";
import type { Match, ScheduleItem } from "@/data/types";
import { getCoachAssignedTeams } from "@/lib/coach-access";

export type CheckInAvailability = "available" | "not_open" | "checked_in" | "closed";
export type AttendanceStatus = "checked_in" | "late" | "missed" | "excused" | "rejected";

export interface CheckInActivity {
  id: string;
  type: "field" | "match";
  title: string;
  date: string;
  start: string;
  end: string;
  venue: string;
  teamIds: string[];
  availability: CheckInAvailability;
}

export interface CheckInRecord {
  id: string;
  personId: string;
  activityId: string;
  role: RoleId;
  checkedInAt: string;
  status: AttendanceStatus;
}

export interface CheckInSnapshot {
  access: "self" | "child" | "restricted";
  personId: string;
  personName: string;
  role: RoleId;
  canSelfCheckIn: boolean;
  activities: CheckInActivity[];
  history: Array<{ record: CheckInRecord; activity: CheckInActivity }>;
  message?: string;
}

export const DEMO_CHECK_IN_RECORDS: CheckInRecord[] = [
  {
    id: "check-in-p123-m103",
    personId: "p-123",
    activityId: "m-103",
    role: "player",
    checkedInAt: "2027-02-07T07:45:00",
    status: "checked_in",
  },
];

function activityFromSchedule(item: ScheduleItem): CheckInActivity {
  const match = item.matchId ? getMatch(item.matchId) : undefined;
  const teamIds = match ? [match.homeId, match.awayId] : item.teamId ? [item.teamId] : [];
  const completedOrCancelled = match?.status === "completed" || match?.status === "cancelled";

  return {
    id: match?.id ?? item.id,
    type: match ? "match" : "field",
    title: match
      ? `${getTeam(match.homeId)?.name ?? match.homeId} vs ${getTeam(match.awayId)?.name ?? match.awayId}`
      : item.title,
    date: match?.date ?? item.date,
    start: match?.time ?? item.start,
    end: match ? match.time : item.end,
    venue: match?.venue ?? item.venue,
    teamIds,
    availability: completedOrCancelled
      ? "closed"
      : (match?.date ?? item.date) === MOCK_TODAY
        ? "available"
        : (match?.date ?? item.date) > MOCK_TODAY
          ? "not_open"
          : "closed",
  };
}

function activityFromMatch(match: Match): CheckInActivity {
  return {
    id: match.id,
    type: "match",
    title: `${getTeam(match.homeId)?.name ?? match.homeId} vs ${getTeam(match.awayId)?.name ?? match.awayId}`,
    date: match.date,
    start: match.time,
    end: match.time,
    venue: match.venue,
    teamIds: [match.homeId, match.awayId],
    availability:
      match.status === "completed" || match.status === "cancelled"
        ? "closed"
        : match.date === MOCK_TODAY
          ? "available"
          : match.date > MOCK_TODAY
            ? "not_open"
            : "closed",
  };
}

function activitiesForTeams(teamIds: string[]) {
  if (!teamIds.length) return [];
  const assigned = new Set(teamIds);
  const activities = listSchedule(teamIds)
    .filter((item) => item.teamId && assigned.has(item.teamId) && item.type !== "meeting")
    .map(activityFromSchedule)
    .filter((activity) => activity.teamIds.some((teamId) => assigned.has(teamId)));
  const seen = new Set<string>();
  return activities.filter((activity) => {
    if (seen.has(activity.id)) return false;
    seen.add(activity.id);
    return true;
  });
}

function activityForHistory(activityId: string) {
  const match = getMatch(activityId);
  if (match) return activityFromMatch(match);
  return undefined;
}

export function getCheckInSnapshot(
  role: RoleId,
  childId?: string,
  records: CheckInRecord[] = DEMO_CHECK_IN_RECORDS,
): CheckInSnapshot {
  const currentUser = getCurrentUser();
  let personId = currentUser.footballId;
  let personName = currentUser.name;
  let teamIds: string[] = [];
  let access: CheckInSnapshot["access"] = "self";
  let canSelfCheckIn = false;
  let message: string | undefined;

  if (role === "player") {
    const player = getPlayer("p-123");
    personId = player?.id ?? "p-123";
    personName = player?.name ?? "Player";
    teamIds = player?.teamId ? [player.teamId] : [];
    canSelfCheckIn = true;
  } else if (role === "coach") {
    teamIds = getCoachAssignedTeams(currentUser.name).map((team) => team.id);
    canSelfCheckIn = teamIds.length > 0;
  } else if (role === "parent") {
    const children = listCurrentGuardianChildren();
    const child = children.find((item) => item.id === childId) ?? children[0];
    access = "child";
    personId = child?.id ?? "";
    personName = child?.name ?? "your child";
    teamIds = child?.teamId ? [child.teamId] : [];
    message =
      "Attendance is read-only in the Parent workspace. You can view the linked child's check-in history.";
  } else if (role === "referee") {
    message =
      "Assigned match check-in will appear here when an assignment is connected to your Football ID.";
  } else {
    access = "restricted";
    message = "Check-in is available only from an authorized activity or match context.";
  }

  const activities = activitiesForTeams(teamIds).map((activity) => {
    const checkedIn = records.some(
      (record) =>
        record.personId === personId &&
        record.activityId === activity.id &&
        record.status === "checked_in",
    );
    return checkedIn ? { ...activity, availability: "checked_in" as const } : activity;
  });
  const history = records
    .filter((record) => record.personId === personId)
    .map((record) => {
      const activity = activityForHistory(record.activityId);
      return activity ? { record, activity } : undefined;
    })
    .filter((entry): entry is { record: CheckInRecord; activity: CheckInActivity } =>
      Boolean(entry),
    )
    .sort((left, right) => right.record.checkedInAt.localeCompare(left.record.checkedInAt));

  return {
    access,
    personId,
    personName,
    role,
    canSelfCheckIn,
    activities,
    history,
    message,
  };
}

export function recordSelfCheckIn(
  snapshot: CheckInSnapshot,
  activity: CheckInActivity,
  records: CheckInRecord[],
  checkedInAt = new Date().toISOString(),
): CheckInRecord | undefined {
  if (!snapshot.canSelfCheckIn || activity.availability !== "available") return undefined;
  if (
    records.some(
      (record) => record.personId === snapshot.personId && record.activityId === activity.id,
    )
  ) {
    return undefined;
  }

  return {
    id: `${snapshot.personId}-${activity.id}`,
    personId: snapshot.personId,
    activityId: activity.id,
    role: snapshot.role,
    checkedInAt,
    status: "checked_in",
  };
}
