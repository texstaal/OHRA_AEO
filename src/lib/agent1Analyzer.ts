import type {
  RawEntry,
  ThemeConfig,
  ThemeResult,
  AnalysisResult,
  GapLevel,
  PriorityScore,
} from '@/types/agent1'

const KNOWN_COMPETITORS = [
  'Independer', 'Centraal Beheer', 'ANWB', 'Univé',
  'InShared', 'FBTO', 'Allianz Direct',
]

function clusterEntry(entry: RawEntry, themes: ThemeConfig[]): ThemeConfig | null {
  const haystack = (entry.text + ' ' + entry.source).toLowerCase()
  for (const theme of themes) {
    if (theme.keywords.some(kw => haystack.includes(kw.toLowerCase()))) {
      return theme
    }
  }
  return null
}

function gapLevel(competitorMentions: Record<string, number>, ohraCount: number, total: number): GapLevel {
  if (total === 0) return 'Low'
  const totalComp = Object.values(competitorMentions).reduce((a, b) => a + b, 0)
  const compDensity = totalComp / total
  const ohraDensity = ohraCount / total
  if (compDensity > 0.4 && ohraDensity < 0.15) return 'High'
  if (compDensity > 0.2 || (compDensity > 0.1 && ohraDensity < 0.1)) return 'Medium'
  return 'Low'
}

function priorityScore(
  entries: RawEntry[],
  maxCount: number,
  theme: ThemeConfig,
  gap: GapLevel
): PriorityScore {
  const frequency = Math.round((entries.length / Math.max(maxCount, 1)) * 20)
  const competitorGap = gap === 'High' ? 20 : gap === 'Medium' ? 12 : 5
  return {
    frequency,
    commercialRelevance: theme.commercialScore,
    urgency: theme.urgencyScore,
    competitorGap,
    ohraOpportunity: theme.ohraOpportunityScore,
    total: frequency + theme.commercialScore + theme.urgencyScore + competitorGap + theme.ohraOpportunityScore,
  }
}

export function analyzeEntries(entries: RawEntry[], themes: ThemeConfig[]): AnalysisResult {
  const themeMap = new Map<string, RawEntry[]>()
  let uncategorized = 0

  for (const entry of entries) {
    const match = clusterEntry(entry, themes)
    if (match) {
      themeMap.set(match.id, [...(themeMap.get(match.id) ?? []), entry])
    } else {
      uncategorized++
    }
  }

  const maxCount = Math.max(1, ...Array.from(themeMap.values()).map(v => v.length))

  const themeResults: ThemeResult[] = []

  for (const theme of themes) {
    const themeEntries = themeMap.get(theme.id) ?? []
    if (themeEntries.length === 0) continue

    const competitorMentions: Record<string, number> = {}
    let ohraCount = 0

    for (const e of themeEntries) {
      const comp = e.competitor?.trim()
      if (!comp) continue
      if (comp === 'OHRA') {
        ohraCount++
      } else if (KNOWN_COMPETITORS.includes(comp)) {
        competitorMentions[comp] = (competitorMentions[comp] ?? 0) + 1
      }
    }

    let topCompetitor = 'None'
    let topCompetitorCount = 0
    for (const [comp, count] of Object.entries(competitorMentions)) {
      if (count > topCompetitorCount) {
        topCompetitor = comp
        topCompetitorCount = count
      }
    }

    const gap = gapLevel(competitorMentions, ohraCount, themeEntries.length)
    const score = priorityScore(themeEntries, maxCount, theme, gap)

    // Pick example texts: prefer questions first
    const questions = themeEntries.filter(e => e.text.includes('?')).map(e => e.text)
    const others   = themeEntries.filter(e => !e.text.includes('?')).map(e => e.text)
    const exampleTexts = [...questions, ...others].slice(0, 3)

    themeResults.push({
      theme,
      entries: themeEntries,
      exampleTexts,
      competitorMentions,
      topCompetitor,
      topCompetitorCount,
      ohraCount,
      gapLevel: gap,
      priorityScore: score,
    })
  }

  themeResults.sort((a, b) => b.priorityScore.total - a.priorityScore.total)

  return { totalEntries: entries.length, themes: themeResults, uncategorized }
}

export function parseCSV(text: string): RawEntry[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = splitCSVRow(lines[0])
  const entries: RawEntry[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const vals = splitCSVRow(line)
    const get = (key: string) => {
      const idx = headers.findIndex(h => h.toLowerCase().trim() === key)
      return idx >= 0 ? (vals[idx] ?? '').replace(/^"|"$/g, '').trim() : ''
    }
    const entry: RawEntry = {
      source: get('source'),
      date: get('date'),
      text: get('text'),
      competitor: get('competitor'),
      url: get('url'),
    }
    if (entry.text) entries.push(entry)
  }
  return entries
}

function splitCSVRow(row: string): string[] {
  const fields: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < row.length; i++) {
    const ch = row[i]
    if (ch === '"') { inQ = !inQ }
    else if (ch === ',' && !inQ) { fields.push(cur.trim()); cur = '' }
    else { cur += ch }
  }
  fields.push(cur.trim())
  return fields
}

export function exportToCSV(results: ThemeResult[], reviewStatuses: Record<string, string>): string {
  const headers = [
    'Rank', 'Priority Score', 'Theme', 'CEP', 'Intent Stage',
    'Entries', 'Top Competitor', 'OHRA Mentions', 'Gap Level',
    'Recommended Format', 'Recommended Title', 'Schema', 'Review Status',
  ]
  const rows = results.map((r, i) => [
    i + 1,
    r.priorityScore.total,
    `"${r.theme.label}"`,
    `"${r.theme.cep}"`,
    `"${r.theme.intentStage}"`,
    r.entries.length,
    r.topCompetitor,
    r.ohraCount,
    r.gapLevel,
    `"${r.theme.recommendation.format}"`,
    `"${r.theme.recommendation.title}"`,
    `"${r.theme.recommendation.schema}"`,
    `"${reviewStatuses[r.theme.id] ?? 'New'}"`,
  ])
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}
