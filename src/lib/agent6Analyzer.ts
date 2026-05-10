import type {
  Mention, BrandShare, TopicVisibility, SourceGap,
  EarnedOpportunity, TrustScore, SentimentTally, GapLevel,
} from '@/types/agent6'
import { BRANDS, TOPICS, SOURCE_AUTHORITY } from '@/data/agent6Data'

const OHRA = 'OHRA'

// Brand mention share — count each brand across all mention.brands arrays
export function calcBrandShares(mentions: Mention[]): BrandShare[] {
  const counts: Record<string, number> = {}
  for (const brand of BRANDS) counts[brand] = 0
  for (const m of mentions) {
    for (const b of m.brands) {
      if (b in counts) counts[b]++
    }
  }
  const total = Object.values(counts).reduce((s, v) => s + v, 0)
  return BRANDS.map(brand => ({
    brand,
    count: counts[brand],
    pct: total > 0 ? Math.round((counts[brand] / total) * 100) : 0,
  })).sort((a, b) => b.count - a.count)
}

// Sentiment per brand using pre-assigned sentiment labels
export function calcSentimentByBrand(mentions: Mention[]): Record<string, SentimentTally> {
  const result: Record<string, SentimentTally> = {}
  for (const brand of BRANDS) result[brand] = { positive: 0, neutral: 0, negative: 0 }

  for (const m of mentions) {
    for (const b of m.brands) {
      if (!(b in result)) continue
      if (m.sentiment === 'Positive') result[b].positive++
      else if (m.sentiment === 'Negative') result[b].negative++
      else result[b].neutral++
    }
  }
  return result
}

// Topic visibility — for each topic, compare OHRA count vs top competitor
export function calcTopicVisibility(mentions: Mention[]): TopicVisibility[] {
  return TOPICS.map(topic => {
    const topicMentions = mentions.filter(m => m.topic === topic)
    const ohraMentions  = topicMentions.filter(m => m.brands.includes(OHRA))

    // Count competitor occurrences
    const compCounts: Record<string, number> = {}
    for (const m of topicMentions) {
      for (const b of m.brands) {
        if (b !== OHRA) compCounts[b] = (compCounts[b] ?? 0) + 1
      }
    }
    const topEntry = Object.entries(compCounts).sort((a, b) => b[1] - a[1])[0]
    const topComp  = topEntry?.[0] ?? '—'
    const topCount = topEntry?.[1] ?? 0
    const ohraCount = ohraMentions.length

    // Gap: compare OHRA share vs top competitor share within the topic
    const gap = topCount - ohraCount
    const gapLevel = gap >= 3 ? 'High' : gap >= 1 ? 'Medium' : 'Low'

    const opportunities: Record<string, string> = {
      'Cheap car insurance':      'Create price-transparent content and get OHRA listed on comparison sites for cheap insurance searches.',
      'Young drivers':            'Publish expert guides for young drivers and seek mentions on youth-focused finance forums.',
      'EV insurance':             'Target EV forums and tech sites with OHRA EV coverage content to compete with ANWB and Allianz Direct.',
      'WA vs All-risk':           'Strengthen OHRA comparison content to capture comparison-stage queries.',
      'Claim handling':           'Amplify positive claim experiences through review platforms — OHRA has a strong base here.',
      'Switching insurance':      'Create switching guides and seek comparison site placement for mid-year switch queries.',
      'No-claim discount':        'Explain no-claim transfer process clearly — OHRA already has positive mentions here.',
      'Customer service':         'Encourage satisfied customers to leave reviews — OHRA sentiment is strong in this topic.',
    }

    return { topic, ohraCount, topCompetitor: topComp, topCompetitorCount: topCount, gapLevel, opportunity: opportunities[topic] ?? '' }
  })
}

// Source gap — per source, OHRA mentions vs competitor total
export function calcSourceGaps(mentions: Mention[]): SourceGap[] {
  const sources = Object.keys(SOURCE_AUTHORITY)
  return sources.map(source => {
    const sm = mentions.filter(m => m.source === source)
    const ohraCount = sm.filter(m => m.brands.includes(OHRA)).length
    const compCount = sm.filter(m => !m.brands.includes(OHRA) || m.brands.length > 1).length

    const gap = compCount - ohraCount
    const gapLevel: GapLevel = gap >= 4 ? 'High' : gap >= 2 ? 'Medium' : 'Low'

    const actions: Record<string, string> = {
      'AI answer citation': 'Build authoritative FAQ and schema content that AI systems prefer to cite.',
      'Dutch news site':    'Develop PR relationships with Dutch finance and auto journalists for expert commentary.',
      'Comparison website': 'Ensure OHRA is listed and optimised on all major Dutch comparison platforms.',
      'Review platform':    'Encourage satisfied customers to leave reviews on Trustpilot and Kiyoh.',
      'Tweakers':           'Engage in Tweakers forum discussions around EV and tech-related insurance topics.',
      'Reddit':             'Provide helpful, non-promotional responses in Dutch finance subreddits.',
      'YouTube':            'Create short explainer videos on car insurance topics and optimise for Dutch search.',
    }

    return {
      source,
      authorityScore: SOURCE_AUTHORITY[source] ?? 50,
      ohraMentions:  ohraCount,
      competitorMentions: compCount,
      gapLevel,
      action: actions[source] ?? 'Investigate this source for OHRA visibility opportunities.',
    }
  }).sort((a, b) => b.authorityScore - a.authorityScore)
}

// Auto-generate opportunities from topic visibility data
export function buildOpportunities(tv: TopicVisibility[]): EarnedOpportunity[] {
  return tv
    .filter(t => t.gapLevel !== 'Low')
    .map((t, i) => ({
      id: `opp-${i}`,
      topic: t.topic,
      insight: t.opportunity,
      priority: t.gapLevel === 'High' ? 'High' : 'Medium',
    }))
}

// AI Trust Signal Score — 4 dimensions, max 25 each
export function calcTrustScore(mentions: Mention[], brandShares: BrandShare[], tv: TopicVisibility[]): TrustScore {
  const ohraMentions = mentions.filter(m => m.brands.includes(OHRA))

  // 1. Mention volume vs competitors (share of voice)
  const ohraShare = brandShares.find(b => b.brand === OHRA)?.pct ?? 0
  const mentionScore = Math.round(Math.min(25, ohraShare * 1.5))

  // 2. Authority of sources where OHRA appears
  const avgAuth = ohraMentions.length > 0
    ? ohraMentions.reduce((s, m) => s + m.authorityScore, 0) / ohraMentions.length
    : 0
  const authorityScore = Math.round((avgAuth / 100) * 25)

  // 3. Sentiment quality
  const posCount = ohraMentions.filter(m => m.sentiment === 'Positive').length
  const negCount = ohraMentions.filter(m => m.sentiment === 'Negative').length
  const sentimentScore = ohraMentions.length > 0
    ? Math.round(((posCount - negCount * 2) / ohraMentions.length) * 25)
    : 0

  // 4. Topic coverage breadth
  const coveredTopics = tv.filter(t => t.ohraCount > 0).length
  const topicScore = Math.round((coveredTopics / TOPICS.length) * 25)

  const total = Math.max(0, Math.min(100, mentionScore + authorityScore + sentimentScore + topicScore))
  return { total, mentionScore, authorityScore, sentimentScore: Math.max(0, sentimentScore), topicScore }
}

export function exportToCSV(mentions: Mention[]): string {
  const header = ['id', 'source', 'date', 'brands', 'topic', 'sentiment', 'authorityScore', 'text']
  const rows = mentions.map(m => [
    m.id, m.source, m.date, m.brands.join('; '), m.topic, m.sentiment, String(m.authorityScore),
    `"${m.text.replace(/"/g, '""')}"`,
  ])
  return [header, ...rows].map(r => r.join(',')).join('\n')
}

export function exportToMarkdown(
  brandShares: BrandShare[], tv: TopicVisibility[], trustScore: TrustScore
): string {
  const lines = [
    '# OHRA Earned Media Report',
    '',
    `**AI Trust Signal Score:** ${trustScore.total}/100`,
    '',
    '## Brand Mention Share',
    ...brandShares.map(b => `- **${b.brand}:** ${b.count} mentions (${b.pct}%)`),
    '',
    '## Topic Visibility',
    ...tv.map(t => `- **${t.topic}:** OHRA ${t.ohraCount} vs ${t.topCompetitor} ${t.topCompetitorCount} — Gap: ${t.gapLevel}`),
  ]
  return lines.join('\n')
}
