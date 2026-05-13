import type { AEOEntry } from '@/types/agent8'

// Seed data — 4 weekly entries reflecting pre-implementation baseline.
// System has not yet been deployed, so scores are flat to slightly declining.
export const seedEntries: AEOEntry[] = [
  {
    id: 'w1',
    date: '2025-11-17',
    total: 63,
    visibility: 16,
    content:    15,
    authority:  19,
    technical:  13,
    notes: 'Baseline measurement before GEO system implementation.',
  },
  {
    id: 'w2',
    date: '2025-11-24',
    total: 62,
    visibility: 15,
    content:    15,
    authority:  19,
    technical:  13,
    notes: 'No changes deployed this week.',
  },
  {
    id: 'w3',
    date: '2025-12-01',
    total: 62,
    visibility: 15,
    content:    15,
    authority:  18,
    technical:  14,
    notes: 'Stable. GEO system in development — no content changes live yet.',
  },
  {
    id: 'w4',
    date: '2025-12-08',
    total: 61,
    visibility: 14,
    content:    15,
    authority:  18,
    technical:  14,
    notes: 'Slight dip in visibility. Competitors increasing AI-optimised content output.',
  },
]
