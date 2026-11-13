import {
  Building2,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  Trophy,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ds/page-header";
import { Crest } from "@/components/ds/avatars";
import { StatusBadge } from "@/components/ds/status-badge";
import { Button } from "@/components/ui/button";
import {
  PageTabs,
  PageTabsContent,
  PageTabsList,
  PageTabsTrigger,
} from "@/components/ds/page-tabs";
import { useOrganizationWorkspace } from "./organization-context";
import { OrganizationDashboard } from "./organization-dashboard";
import {
  OrganizationAttendance,
  OrganizationCompetitions,
  OrganizationFinance,
  OrganizationPlayers,
  OrganizationStaff,
  OrganizationTeams,
  OrganizationTraining,
} from "./organization-sections";
import type { OrganizationWorkspaceView } from "./organization-workspace.types";
export { ORGANIZATION_WORKSPACE_VIEWS } from "./organization-workspace.types";

const TABS: { value: OrganizationWorkspaceView; label: string; icon: typeof LayoutDashboard }[] = [
  { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { value: "players", label: "Players", icon: Users },
  { value: "teams", label: "Teams", icon: Building2 },
  { value: "training", label: "Training", icon: CalendarDays },
  { value: "attendance", label: "Attendance", icon: ClipboardCheck },
  { value: "competitions", label: "Competitions", icon: Trophy },
  { value: "finance", label: "Finance", icon: Wallet },
  { value: "staff", label: "Staff", icon: UserRound },
];

const TYPE_DESCRIPTION = {
  SSB: "Manage community teams, player relationships, and weekly activity.",
  Academy: "Manage academy squads, player relationships, and weekly activity.",
  Club: "Manage club teams, player relationships, and competition activity.",
} as const;

export function OrganizationWorkspace({
  view,
  onViewChange,
}: {
  view: OrganizationWorkspaceView;
  onViewChange: (view: OrganizationWorkspaceView) => void;
}) {
  const { organization } = useOrganizationWorkspace();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        crumbs={[{ label: "Organizations", to: "/organizations" }, { label: organization.name }]}
      />
      <section className="surface overflow-hidden">
        <div className="passport-pattern h-16 md:h-20" />
        <div className="-mt-8 flex flex-col gap-4 px-5 pb-5 md:flex-row md:items-end md:px-6">
          <Crest
            label={organization.short}
            hue={organization.color}
            size="xl"
            className="ring-4 ring-card"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h1">{organization.name}</h1>
              <StatusBadge status={organization.verification} />
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 text-small text-muted-foreground">
              <span>
                {organization.type} · founded {organization.founded}
              </span>
              <span>
                {organization.city}, {organization.province}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onViewChange("players")}>
              <Users /> Players
            </Button>
            <Button onClick={() => onViewChange("teams")}>
              <Building2 /> Teams
            </Button>
          </div>
        </div>
        <p className="border-t px-5 py-4 text-body text-muted-foreground md:px-6">
          {organization.description}
        </p>
      </section>

      <PageTabs
        value={view}
        onValueChange={(next) => onViewChange(next as OrganizationWorkspaceView)}
      >
        <PageTabsList aria-label={`${organization.type} workspace sections`}>
          {TABS.map(({ value, label, icon: Icon }) => (
            <PageTabsTrigger key={value} value={value}>
              <Icon className="size-4" /> {label}
            </PageTabsTrigger>
          ))}
        </PageTabsList>
        <PageTabsContent value="dashboard">
          <OrganizationDashboard onViewChange={onViewChange} />
        </PageTabsContent>
        <PageTabsContent value="players">
          <OrganizationPlayers />
        </PageTabsContent>
        <PageTabsContent value="teams">
          <OrganizationTeams />
        </PageTabsContent>
        <PageTabsContent value="training">
          <OrganizationTraining />
        </PageTabsContent>
        <PageTabsContent value="attendance">
          <OrganizationAttendance />
        </PageTabsContent>
        <PageTabsContent value="competitions">
          <OrganizationCompetitions />
        </PageTabsContent>
        <PageTabsContent value="finance">
          <OrganizationFinance />
        </PageTabsContent>
        <PageTabsContent value="staff">
          <OrganizationStaff />
        </PageTabsContent>
      </PageTabs>
    </div>
  );
}
