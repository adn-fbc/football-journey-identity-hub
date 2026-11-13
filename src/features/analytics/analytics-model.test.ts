import { describe, expect, it } from 'vitest';
import { computeCompetitionAnalytics, computeOrgAnalytics, percentage, suppressSmallGroups, toCsv } from './analytics-model';
import { getCompetitionAnalyticsRecords } from '@/data/analytics-repository';
describe('analytics model', () => {
  it('discards every sensitive field under five', () => expect(suppressSmallGroups([{ label: 'U8', players: 4, active: 3 }])).toEqual([{ label: 'U8', hidden: true }]));
  it('keeps groups of exactly five', () => expect(suppressSmallGroups([{ label: 'U8', players: 5 }])).toEqual([{ label: 'U8', players: 5, hidden: false }]));
  it('calculates concrete retention', () => expect(percentage(12, 15)).toBe(80));
  it('handles an empty cohort', () => expect(percentage(0, 0)).toBe(0));
  it('computes historical retention from source cohort', () => expect(computeOrgAnalytics('season').retention).toBe(80.9));
  it('includes CSV header and rows', () => expect(toCsv([{ section: 'Summary', label: 'Members', value: 12 }])).toBe('section,label,value\r\n"Summary","Members","12"'));
  it('does not serialize extra contact properties', () => {
    const row = { section: 'Summary', label: 'Members', value: 12, email: 'private@example.com', phone: '081234' };
    expect(toCsv([row])).toBe('section,label,value\r\n"Summary","Members","12"');
  });
  it('escapes quotes and commas', () => expect(toCsv([{ section: 'A', label: 'Team, "A"', value: 5 }])).toContain('"Team, ""A"""'));
  it('counts all completed results', () => {
    const model = computeCompetitionAnalytics('myc-2027');
    expect(model.results.reduce((n, r) => n + r.count, 0)).toBe(getCompetitionAnalyticsRecords('myc-2027').matches.filter(m => m.status === 'completed').length);
  });
  it('exports suppressed groups without counts', () => expect(computeOrgAnalytics('season').rows.filter(r => r.section === 'Retention' && r.label === 'U14')).toEqual([{ section: 'Retention', label: 'U14', value: 'Hidden · fewer than 5 players' }]));
});
