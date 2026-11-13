import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { FilterSelect } from "@/components/ds/filter-bar";
import { PageHeader } from "@/components/ds/page-header";
import { PrototypeNotice } from "@/components/ds/prototype-notice";
import { LoadingState, PermissionState } from "@/components/ds/states";
import { Button } from "@/components/ui/button";
import { ANALYTICS_AS_OF, type AnalyticsPeriod } from "@/data/analytics-repository";
import { getAnalyticsScope } from "@/lib/analytics-access";
import { fmtDate } from "@/lib/format";
import { useRole } from "@/lib/role-context";
import { competitionExportRows, computeCompetitionAnalytics, computeOrgAnalytics, orgExportRows } from "./analytics-model";
import { CompetitionAnalyticsView } from "./competition-analytics";
import { downloadCsv } from "./export-csv";
import { OrgAnalytics } from "./org-analytics";

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "30d", label: "Last 30 days" },
  { value: "season", label: "This season" },
  { value: "last-season", label: "Last season" },
];

/** Role-aware analytics: organization health for org admins, competition insights for organizers. */
export function AnalyticsPage() {
  const { role, ready } = useRole();
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const scope = getAnalyticsScope(role);

  const org = useMemo(() => (scope.kind === "organization" ? computeOrgAnalytics(scope.organizationId, period) : null), [scope, period]);
  const competition = useMemo(() => (scope.kind === "competition" ? computeCompetitionAnalytics(scope.competitionId) : null), [scope]);

  const subtitle = org
    ? `${org.organization?.name ?? "Your organization"} · members, retention, attendance and development`
    : competition
      ? `${competition.competition?.name ?? "Your competition"} · participation and results`
      : "Insights for the organizations and competitions you manage";

  const onExport = () => {
    if (org) downloadCsv(orgExportRows(org), `garuda-analytics-${period}`);
    else if (competition) downloadCsv(competitionExportRows(competition), "myc-2027-analytics");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Preview · Analytics"
        title="Analytics"
        description={subtitle}
        actions={
          ready && scope.kind !== "none" ? (
            <>
              {org && <FilterSelect value={period} onChange={(v) => setPeriod(v as AnalyticsPeriod)} options={PERIODS} placeholder="Period" />}
              <Button variant="outline" onClick={onExport}><Download /> Export CSV</Button>
            </>
          ) : undefined
        }
      />
      <PrototypeNotice moduleId="analytics" />

      {!ready ? (
        <LoadingState rows={3} />
      ) : scope.kind === "none" ? (
        <PermissionState
          title="Analytics is for organization admins and competition organizers"
          description="Switch to Organization Admin or Competition Organizer to see insights for what you manage."
        />
      ) : (
        <>
          <p className="text-small text-muted-foreground">
            Read-only · updated {fmtDate(ANALYTICS_AS_OF)} · groups under 5 players are hidden
          </p>
          {org && <OrgAnalytics data={org} />}
          {competition && <CompetitionAnalyticsView data={competition} />}
        </>
      )}
    </div>
  );
}
