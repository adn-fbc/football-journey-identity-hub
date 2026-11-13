import { useState } from "react";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  History,
  MapPin,
  ScanLine,
  Shield,
  Swords,
} from "lucide-react";
import type { RoleId } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChildSelector } from "@/features/children/child-selector";
import { EmptyState, PermissionState } from "@/components/ds/states";
import { PageHeader } from "@/components/ds/page-header";
import { Section } from "@/components/ds/section";
import { getTeam, listCurrentGuardianChildren } from "@/data/repository";
import { fmtDate } from "@/lib/format";
import {
  DEMO_CHECK_IN_RECORDS,
  getCheckInSnapshot,
  recordSelfCheckIn,
  type CheckInActivity,
  type CheckInRecord,
} from "./check-in-model";

const AVAILABILITY: Record<CheckInActivity["availability"], { label: string; className: string }> =
  {
    available: { label: "Available", className: "border-success/20 bg-success/10 text-success" },
    not_open: { label: "Not open yet", className: "border-border bg-muted text-muted-foreground" },
    checked_in: { label: "Checked in", className: "border-info/20 bg-info/10 text-info" },
    closed: { label: "Closed", className: "border-border bg-muted text-muted-foreground" },
  };

export function CheckInPage({
  role,
  view,
  activityId,
  childId,
  onShowHistory,
  onShowHome,
  onSelectChild,
  onReturnToSchedule,
}: {
  role: RoleId;
  view: "home" | "history";
  activityId?: string | undefined;
  childId?: string | undefined;
  onShowHistory: (childId?: string | undefined) => void;
  onShowHome: (childId?: string | undefined) => void;
  onSelectChild: (childId: string) => void;
  onReturnToSchedule: () => void;
}) {
  const [records, setRecords] = useState(DEMO_CHECK_IN_RECORDS);
  const [confirmation, setConfirmation] = useState<
    { activity: CheckInActivity; record: CheckInRecord } | undefined
  >();
  const snapshot = getCheckInSnapshot(role, childId, records);
  const children = role === "parent" ? listCurrentGuardianChildren() : [];
  const requestedActivity = activityId
    ? snapshot.activities.find((activity) => activity.id === activityId)
    : undefined;

  const handleCheckIn = (activity: CheckInActivity) => {
    const record = recordSelfCheckIn(snapshot, activity, records);
    if (!record) return;
    setRecords((current) => [...current, record]);
    setConfirmation({ activity, record });
  };

  if (confirmation) {
    return (
      <CheckInConfirmation
        role={role}
        personName={snapshot.personName}
        activity={confirmation.activity}
        record={confirmation.record}
        onDone={() => setConfirmation(undefined)}
      />
    );
  }

  if (snapshot.access === "restricted") {
    return (
      <PermissionState
        title="Check-in unavailable"
        description={
          snapshot.message ?? "Check-in requires an authorized activity or match assignment."
        }
        action={
          <Button variant="outline" onClick={onReturnToSchedule}>
            Return to Schedule
          </Button>
        }
      />
    );
  }

  if (activityId && !requestedActivity) {
    return (
      <PermissionState
        title="Activity access restricted"
        description="This activity is not available in your current team or child context."
        action={
          <Button variant="outline" onClick={onReturnToSchedule}>
            Return to Schedule
          </Button>
        }
      />
    );
  }

  if (role === "parent" && !snapshot.personId) {
    return (
      <EmptyState
        title="No children linked"
        description="A linked child is required to view check-in history."
        action={
          <Button variant="outline" onClick={onReturnToSchedule}>
            Return to Schedule
          </Button>
        }
      />
    );
  }

  if (view === "history") {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow={snapshot.access === "child" ? "Linked child" : "Personal record"}
          title={snapshot.access === "child" ? "Child Check-in History" : "My Check-in History"}
          description={
            snapshot.access === "child" ? `${snapshot.personName} · read-only` : snapshot.personName
          }
          actions={
            <Button variant="outline" onClick={() => onShowHome(childId)}>
              <CalendarCheck2 /> Check-in home
            </Button>
          }
        />
        {role === "parent" && children.length > 1 && (
          <ChildSelector children={children} value={snapshot.personId} onChange={onSelectChild} />
        )}
        {snapshot.history.length ? (
          <Section title="Recorded attendance" flush>
            <ul className="divide-y">
              {snapshot.history.map(({ record, activity }) => (
                <li key={record.id} className="flex items-center gap-3 px-5 py-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-success/10 text-success">
                    <CheckCircle2 className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{activity.title}</div>
                    <div className="text-small text-muted-foreground">
                      {fmtDate(activity.date, "d MMM yyyy")} · {activity.venue}
                    </div>
                  </div>
                  <span className="text-right text-small text-muted-foreground">
                    <span className="block font-semibold text-success">
                      {record.status.replace("_", " ")}
                    </span>
                    {new Date(record.checkedInAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        ) : (
          <EmptyState
            icon={History}
            title="No check-ins recorded"
            description="Completed check-ins for this identity will appear here."
          />
        )}
        {snapshot.message && snapshot.access === "child" && (
          <p className="text-small text-muted-foreground">{snapshot.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={
          role === "coach"
            ? "Assigned team context"
            : snapshot.access === "child"
              ? "Guardian view"
              : "Personal activity"
        }
        title="Check-in"
        description={
          snapshot.access === "child"
            ? `Attendance for ${snapshot.personName}.`
            : "Activities connected to your current football context."
        }
        actions={
          <Button variant="outline" onClick={() => onShowHistory(childId)}>
            <History /> History
          </Button>
        }
      />

      {role === "parent" && children.length > 1 && (
        <ChildSelector children={children} value={snapshot.personId} onChange={onSelectChild} />
      )}

      {snapshot.message && <p className="text-small text-muted-foreground">{snapshot.message}</p>}

      {snapshot.activities.length ? (
        <Section
          title="Activities"
          description="Training and match records from your existing schedule."
          flush
        >
          <ul className="divide-y">
            {snapshot.activities.map((activity) => {
              const status = AVAILABILITY[activity.availability];
              const highlighted = activity.id === requestedActivity?.id;
              return (
                <li key={activity.id} className={highlighted ? "bg-accent/30" : undefined}>
                  <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-lg ${activity.type === "match" ? "bg-ink text-signal" : "bg-accent text-accent-foreground"}`}
                    >
                      {activity.type === "match" ? (
                        <Swords className="size-5" />
                      ) : (
                        <Shield className="size-5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold">{activity.title}</h2>
                        <Badge variant="outline" className={status.className}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-small text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarCheck2 className="size-3.5" />
                          {fmtDate(activity.date, "EEE d MMM")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock3 className="size-3.5" />
                          {activity.start}
                          {activity.end !== activity.start ? `–${activity.end}` : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {activity.venue}
                        </span>
                        <span>
                          {activity.teamIds
                            .map((teamId) => getTeam(teamId)?.name)
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>
                    </div>
                    {snapshot.canSelfCheckIn && activity.availability === "available" && (
                      <Button onClick={() => handleCheckIn(activity)}>
                        <ScanLine /> Check in
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : (
        <EmptyState
          icon={CalendarCheck2}
          title={role === "referee" ? "No assigned matches" : "No activities available"}
          description={
            snapshot.message ?? "Activities in your current team context will appear here."
          }
          action={
            snapshot.history.length ? (
              <Button variant="outline" onClick={() => onShowHistory(childId)}>
                <History /> View history
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

function CheckInConfirmation({
  role,
  personName,
  activity,
  record,
  onDone,
}: {
  role: RoleId;
  personName: string;
  activity: CheckInActivity;
  record: CheckInRecord;
  onDone: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-4">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-7" />
        </span>
        <div className="mt-4 text-label text-success">Check-in successful</div>
        <h1 className="mt-1 text-h1">You are checked in</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Your attendance record has been added to this activity.
        </p>
      </div>
      <Section title="Attendance record">
        <dl className="grid grid-cols-2 gap-4">
          <Info label="Name" value={personName} />
          <Info label="Role" value={role === "player" ? "Player" : "Coach"} />
          <Info label="Activity" value={activity.title} />
          <Info label="Venue" value={activity.venue} />
          <Info label="Date" value={fmtDate(activity.date, "d MMM yyyy")} />
          <Info
            label="Check-in time"
            value={new Date(record.checkedInAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </dl>
      </Section>
      <div className="flex justify-center">
        <Button onClick={onDone}>Done</Button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-label text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
