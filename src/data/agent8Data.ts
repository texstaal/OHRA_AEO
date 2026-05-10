import type { AEOEntry } from '@/types/agent8'

// Seed data — 4 weekly entries so the dashboard works immediately without any input.
// Scores are fake demo values. Total is out of 100; sub-scores sum to total.
export const seedEntries: AEOEntry[] = [
  {
    id: 'w1',
    date: '2025-11-17',
    total: 58,
    visibility: 12,
    content:    14,
    authority:  18,
    technical:  14,
    notes: 'Baseline measurement. Low visibility and content scores noted.',
  },
  {
    id: 'w2',
    date: '2025-11-24',
    total: 62,
    visibility: 15,
    content:    16,
    authority:  18,
    technical:  13,
    notes: 'Agent 3 drafts published for young-drivers and WA vs All-risk pages.',
  },
  {
    id: 'w3',
    date: '2025-12-01',
    total: 64,
    visibility: 17,
    content:    17,
    authority:  17,
    technical:  13,
    notes: 'Agent 4 compliance fixes applied. FAQ schema added to two pages.',
  },
  {
    id: 'w4',
    date: '2025-12-08',
    total: 71,
    visibility: 22,
    content:    20,
    authority:  16,
    technical:  13,
    notes: 'Significant visibility jump after EV insurance page refresh and schema update.',
  },
]
