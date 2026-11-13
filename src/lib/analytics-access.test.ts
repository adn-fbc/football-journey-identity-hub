import { describe, expect, it } from 'vitest';
import { canViewAnalytics } from './analytics-access';
describe('analytics access', () => {
  it('allows own organization', () => expect(canViewAnalytics('org_admin', { organizationId: 'garuda' })).toBe(true));
  it('denies another organization', () => expect(canViewAnalytics('org_admin', { organizationId: 'phinisi' })).toBe(false));
  it('allows own competition', () => expect(canViewAnalytics('competition_organizer', { competitionId: 'myc-2027' })).toBe(true));
  it('denies another competition', () => expect(canViewAnalytics('competition_organizer', { competitionId: 'other' })).toBe(false));
  it('denies admin competition access', () => expect(canViewAnalytics('org_admin', { competitionId: 'myc-2027' })).toBe(false));
  it('denies organizer organization access', () => expect(canViewAnalytics('competition_organizer', { organizationId: 'garuda' })).toBe(false));
  for (const role of ['player', 'parent', 'coach', 'referee', 'scout', 'association'] as const) it(`denies ${role}`, () => expect(canViewAnalytics(role, { organizationId: 'garuda' })).toBe(false));
});
