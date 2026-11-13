// Fictional historical aggregates; never overwrite membership or match records.
export const historicalCohorts = [
  { label: 'U8', players: 8, started: 10, active: 8 },
  { label: 'U10', players: 12, started: 15, active: 12 },
  { label: 'U12', players: 15, started: 18, active: 15 },
  { label: 'U14', players: 3, started: 4, active: 3 },
];
export const savedReports = [
  { id: 'season', name: 'Season health summary', lastRun: '2026-11-12', period: 'season' as const },
  { id: 'monthly', name: 'Monthly attendance review', lastRun: '2026-11-01', period: '30d' as const },
];
