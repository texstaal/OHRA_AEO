import type {
  ContentPage, FreshnessReport, FreshnessLabel, FreshnessChecklist,
  CompetitorGap, UpdateSuggestion, PriorityLabel,
} from '@/types/agent7'
import { trendSignals, DEMO_TODAY } from '@/data/agent7Data'

const TODAY = new Date(DEMO_TODAY)

function daysBetween(dateStr: string): number {
  return Math.floor((TODAY.getTime() - new Date(dateStr).getTime()) / 86_400_000)
}

// Age label thresholds (in days)
function freshnessLabel(days: number | null): FreshnessLabel {
  if (days === null) return 'Outdated'  // missing date treated as outdated
  if (days < 90)  return 'Fresh'
  if (days < 180) return 'Needs Review'
  if (days < 365) return 'Outdated'
  return 'Critical'
}

// Age contributes up to 40 points
function ageScore(label: FreshnessLabel, hasMissingDate: boolean): number {
  if (hasMissingDate) return 20  // penalised but not worst case
  return { Fresh: 5, 'Needs Review': 15, Outdated: 28, Critical: 40 }[label]
}

// Trend signals contribute up to 20 points
function trendScore(page: ContentPage): number {
  const matching = trendSignals.filter(ts => page.trendSignalIds.includes(ts.id))
  return Math.min(20, matching.length * 10)
}

// Competitor gap contributes up to 20 points — uses the most recent competitor date
function competitorScore(page: ContentPage): number {
  if (!page.lastUpdated || page.competitorUpdates.length === 0) return 10
  const newest = page.competitorUpdates.reduce((best, c) =>
    c.lastUpdated > best.lastUpdated ? c : best
  )
  const gap = daysBetween(page.lastUpdated) - daysBetween(newest.lastUpdated)
  if (gap <= 0)   return 0
  if (gap < 60)   return 5
  if (gap < 180)  return 10
  if (gap < 365)  return 15
  return 20
}

function priorityLabel(score: number): PriorityLabel {
  if (score >= 75) return 'Critical'
  if (score >= 50) return 'High'
  if (score >= 25) return 'Medium'
  return 'Low'
}

function buildChecklist(page: ContentPage, hasMissingDate: boolean): FreshnessChecklist {
  return {
    hasLastUpdatedDate:    !hasMissingDate,
    hasRecentExamples:     page.hasRecentExamples,
    hasCurrentFAQ:         page.hasCurrentFAQ,
    hasUpdatedSchema:      page.hasUpdatedSchema,
    hasCurrentInternalLinks: page.hasCurrentInternalLinks,
    hasComplianceReview:   page.hasComplianceReview,
  }
}

function buildCompetitorGaps(page: ContentPage): CompetitorGap[] {
  return page.competitorUpdates.map(c => {
    const oursAge = page.lastUpdated ? daysBetween(page.lastUpdated) : 999
    const theirAge = daysBetween(c.lastUpdated)
    const diff = oursAge - theirAge  // positive = we're older than them
    const gapLevel = diff <= 0 ? 'None' : diff < 60 ? 'Low' : diff < 180 ? 'Medium' : 'High'
    return {
      brand: c.brand,
      theirDate: c.lastUpdated,
      ourDate: page.lastUpdated || '—',
      daysDiff: diff,
      gapLevel,
    }
  })
}

function buildSuggestions(
  page: ContentPage,
  label: FreshnessLabel,
  checklist: FreshnessChecklist,
  hasMissingDate: boolean,
): UpdateSuggestion[] {
  const s: UpdateSuggestion[] = []

  if (hasMissingDate)
    s.push({ suggestion: 'Add a visible last updated date', reason: 'AI systems and users trust dated content more for insurance information.', priority: 'High' })

  if (label === 'Critical' || label === 'Outdated')
    s.push({ suggestion: `Refresh all examples and statistics for ${new Date(DEMO_TODAY).getFullYear()}`, reason: 'Outdated figures reduce credibility for AI citation and user trust.', priority: 'High' })

  if (!checklist.hasCurrentFAQ)
    s.push({ suggestion: 'Expand or update the FAQ section with current customer questions', reason: 'FAQs are a primary extraction surface for AI answer engines.', priority: 'High' })

  if (!checklist.hasUpdatedSchema)
    s.push({ suggestion: 'Update JSON-LD schema (FAQPage, Article, HowTo as applicable)', reason: 'Outdated schema reduces AI engine extractability.', priority: 'Medium' })

  if (!checklist.hasCurrentInternalLinks)
    s.push({ suggestion: 'Review and refresh internal links to related OHRA pages', reason: 'Stale internal links reduce site authority signals for AI engines.', priority: 'Medium' })

  if (!checklist.hasRecentExamples)
    s.push({ suggestion: 'Replace outdated pricing examples and policy scenarios with current data', reason: 'Concrete, current examples increase AI citation confidence.', priority: 'Medium' })

  if (!checklist.hasComplianceReview)
    s.push({ suggestion: 'Schedule a compliance review before re-publishing', reason: 'Insurance content changes frequently — outdated claims create legal risk.', priority: 'High' })

  // Trend-specific suggestions
  const relevantTrends = trendSignals.filter(ts => page.trendSignalIds.includes(ts.id))
  for (const trend of relevantTrends) {
    s.push({
      suggestion: `Address new customer question: "${trend.signal}"`,
      reason: `This trend was detected in: ${trend.source}. Adding it increases AEO relevance.`,
      priority: 'High',
    })
  }

  return s
}

export function analyzePages(pages: ContentPage[]): FreshnessReport[] {
  return pages.map(page => {
    const hasMissingDate = !page.lastUpdated
    const days = hasMissingDate ? null : daysBetween(page.lastUpdated)
    const label = freshnessLabel(days)

    const aScore = ageScore(label, hasMissingDate)
    const tScore = trendScore(page)
    const cScore = competitorScore(page)
    const comScore = page.commercialRelevance  // 0–20 from data

    const total = Math.min(100, aScore + tScore + cScore + comScore)
    const checklist = buildChecklist(page, hasMissingDate)

    return {
      pageId:         page.id,
      pageTitle:      page.title,
      ageInDays:      days,
      freshnessLabel: label,
      priorityScore:  total,
      priorityLabel:  priorityLabel(total),
      ageScore:       aScore,
      trendScore:     tScore,
      competitorScore: cScore,
      commercialScore: comScore,
      checklist,
      competitorGaps:  buildCompetitorGaps(page),
      suggestions:     buildSuggestions(page, label, checklist, hasMissingDate),
    }
  })
}

export function exportToCSV(reports: FreshnessReport[], pages: ContentPage[]): string {
  const header = ['id', 'title', 'topic', 'lastUpdated', 'ageInDays', 'freshnessLabel', 'priorityScore', 'priorityLabel', 'suggestions']
  const rows = reports.map(r => {
    const page = pages.find(p => p.id === r.pageId)!
    return [r.pageId, `"${r.pageTitle}"`, page.topic, page.lastUpdated || 'missing',
      r.ageInDays ?? '—', r.freshnessLabel, String(r.priorityScore), r.priorityLabel,
      String(r.suggestions.length)]
  })
  return [header, ...rows].map(row => row.join(',')).join('\n')
}

export function exportToMarkdown(reports: FreshnessReport[], pages: ContentPage[]): string {
  const lines = [
    '# OHRA Freshness & Update Report',
    `**Generated:** ${DEMO_TODAY}`,
    '',
    '## Page Status Overview',
  ]
  for (const r of reports) {
    const page = pages.find(p => p.id === r.pageId)!
    lines.push(`\n### ${r.pageTitle}`)
    lines.push(`- **Topic:** ${page.topic}`)
    lines.push(`- **Last updated:** ${page.lastUpdated || 'MISSING'}`)
    lines.push(`- **Age:** ${r.ageInDays ?? '?'} days — ${r.freshnessLabel}`)
    lines.push(`- **Priority score:** ${r.priorityScore}/100 — ${r.priorityLabel}`)
    lines.push(`- **Suggested updates:** ${r.suggestions.length}`)
  }
  return lines.join('\n')
}
