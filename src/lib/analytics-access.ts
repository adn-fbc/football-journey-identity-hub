import type { RoleId } from "@/config/roles";

/** What the active role may analyse. Analytics are read-only and scoped to what the role manages. */
export type AnalyticsScope =
  | { kind: "organization"; organizationId: string }
  | { kind: "competition"; competitionId: string }
  | { kind: "none" };

/** Mock assignments: the org admin manages SSB Garuda Makassar, the organizer runs Makassar Youth Cup 2027. */
const MANAGED = { organizationId: "garuda", competitionId: "myc-2027" };

export function getAnalyticsScope(role: RoleId): AnalyticsScope {
  if (role === "org_admin") return { kind: "organization", organizationId: MANAGED.organizationId };
  if (role === "competition_organizer") return { kind: "competition", competitionId: MANAGED.competitionId };
  return { kind: "none" };
}

export function canViewOrganizationAnalytics(role: RoleId, organizationId: string) {
  const scope = getAnalyticsScope(role);
  return scope.kind === "organization" && scope.organizationId === organizationId;
}

export function canViewCompetitionAnalytics(role: RoleId, competitionId: string) {
  const scope = getAnalyticsScope(role);
  return scope.kind === "competition" && scope.competitionId === competitionId;
}
