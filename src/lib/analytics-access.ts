import type { RoleId } from '@/config/roles';
export type AnalyticsScope = { organizationId: string } | { competitionId: string };
export function canViewAnalytics(role: RoleId, scope: AnalyticsScope): boolean {
  return role === 'org_admin' && 'organizationId' in scope && scope.organizationId === 'garuda'
    || role === 'competition_organizer' && 'competitionId' in scope && scope.competitionId === 'myc-2027';
}
