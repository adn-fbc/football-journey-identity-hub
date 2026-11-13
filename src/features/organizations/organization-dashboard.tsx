import { Link } from "@tanstack/react-router";
import { AlertCircle, CalendarDays, ClipboardCheck, Shield, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ds/section";
import { StatCard } from "@/components/ds/stat-card";
import { StatusBadge } from "@/components/ds/status-badge";
import { ScheduleRow } from "@/components/ds/schedule-row";
import { EmptyState } from "@/components/ds/states";
import { useOrganizationWorkspace } from "./organization-context";
import { OrganizationSectionHeading } from "./organization-section-heading";
import type { OrganizationWorkspaceView } from "./organization-workspace.types";

export function OrganizationDashboard({
  onViewChange,
}: {
  onViewChange: (view: OrganizationWorkspaceView) => void;
}) {
  const { organization, workspace } = useOrganizationWorkspace();
  const attendanceAverage = workspace.attendance.length
    ? Math.round(
        workspace.attendance.reduce((total, player) => total + player.attendance, 0) /
          workspace.attendance.length,
      )
    : 0;
  const overviewDescription = {
    SSB: "Community football activity and player relationships in one workspace.",
    Academy: "Academy activity and player relationships in one workspace.",
    Club: "Club activity and player relationships in one workspace.",
  }[organization.type];
  const attentionCount = workspace.attention.length;

  return (
    <div className="space-y-6">
      <OrganizationSectionHeading
        title="Organization dashboard"
        description={overviewDescription}
        action={
          <Button variant="outline" onClick={() => onViewChange("training")}>
            <CalendarDays /> Training schedule
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Registered players" value={organization.players} icon={Users} />
        <StatCard label="Teams" value={organization.teams} icon={Shield} />
        <StatCard label="Coaches" value={organization.coaches} icon={Users} />
        <StatCard
          label="Attendance · 30 days"
          value={workspace.attendance.length ? `${attendanceAverage}%` : "—"}
          hint={
            workspace.attendance.length
              ? `${workspace.attendance.length} player records`
              : "No attendance records"
          }
          icon={ClipboardCheck}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section
            title={
              <span className="flex items-center gap-2">
                <AlertCircle className="size-4 text-warning" /> Attention required ·{" "}
                {attentionCount}
              </span>
            }
            description="Membership requests and identity records that need review."
            flush
          >
            {attentionCount ? (
              <ul className="divide-y">
                {workspace.attention.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {item.player.name}
                      </span>
                      <span className="block text-small text-muted-foreground">{item.reason}</span>
                    </span>
                    <StatusBadge
                      status="pending"
                      label={item.reason === "Membership request" ? "Review" : "Unverified"}
                    />
                    <Button variant="outline" size="sm" onClick={() => onViewChange("players")}>
                      Players
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5">
                <EmptyState
                  title="Nothing needs review"
                  description="New membership and verification items will appear here."
                />
              </div>
            )}
          </Section>

          <Section
            title="Upcoming activity"
            description="Training and matches for this organization."
            flush
            action={
              <Button variant="ghost" size="sm" onClick={() => onViewChange("training")}>
                Full schedule
              </Button>
            }
          >
            {workspace.schedule.length ? (
              <div className="divide-y">
                {workspace.schedule.slice(0, 5).map((item) => (
                  <ScheduleRow key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState icon={CalendarDays} title="No activities scheduled" />
              </div>
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section
            title="Competitions"
            description="Events involving this organization's teams."
            flush
          >
            {workspace.competitions.length ? (
              <ul className="divide-y">
                {workspace.competitions.slice(0, 4).map((competition) => (
                  <li key={competition.id}>
                    <Link
                      to="/competitions/$competitionId"
                      params={{ competitionId: competition.id }}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40"
                    >
                      <Trophy className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                        {competition.name}
                      </span>
                      <StatusBadge status={competition.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5">
                <EmptyState icon={Trophy} title="No competitions linked" />
              </div>
            )}
          </Section>

          <Section title="Organization profile">
            <p className="text-small text-muted-foreground">{organization.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-small">
              <div>
                <dt className="text-muted-foreground">Home venue</dt>
                <dd className="mt-1 font-semibold">{organization.homeVenue}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Founded</dt>
                <dd className="mt-1 font-semibold">{organization.founded}</dd>
              </div>
            </dl>
          </Section>
        </div>
      </div>
    </div>
  );
}
