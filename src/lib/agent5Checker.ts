import type {
  TechnicalPage,
  TechnicalReport,
  SubScore,
  TechnicalIssue,
  SchemaRecommendation,
} from '@/types/agent5'

// Suggested internal links OHRA should maintain across all content pages.
const OHRA_LINK_POOL = [
  'https://www.ohra.nl/autoverzekering',
  'https://www.ohra.nl/autoverzekering/wa',
  'https://www.ohra.nl/autoverzekering/allrisk',
  'https://www.ohra.nl/autoverzekering/elektrische-auto',
  'https://www.ohra.nl/autoverzekering/schade',
  'https://www.ohra.nl/autoverzekering/offerte',
  'https://www.ohra.nl/autoverzekering/no-claim',
]

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// Heading structure: max 20 points
function scoreHeadings(page: TechnicalPage): SubScore {
  const hasH1 = !!page.h1 && page.h1.length > 5
  const h2s = page.headings.filter(h => h.level === 2)
  const h3s = page.headings.filter(h => h.level === 3)
  const vague = ['more information', 'meer informatie', 'contact', 'other', 'info']
  const hasVague = page.headings.some(h => vague.some(v => h.text.toLowerCase().includes(v)))

  let score = 0
  if (hasH1) score += 10
  if (h2s.length >= 3) score += 6
  if (h3s.length >= 1) score += 4
  if (hasVague) score -= 5
  score = Math.max(0, Math.min(20, score))

  return {
    label: 'Heading Structure',
    score,
    max: 20,
    status: score >= 16 ? 'pass' : score >= 10 ? 'warn' : 'fail',
  }
}

// Answer block: max 20 points
function scoreAnswerBlock(page: TechnicalPage): SubScore {
  const wc = wordCount(page.answerBlock)
  const hasAnswer = !!page.answerBlock && wc > 20
  const goodLength = wc >= 60 && wc <= 90
  const hasPlaceholder = page.answerBlock.toLowerCase().includes('[placeholder')

  let score = 0
  if (hasAnswer) score += 10
  if (goodLength) score += 7
  if (!hasPlaceholder && hasAnswer) score += 3
  score = Math.min(20, score)

  return {
    label: 'Answer Block',
    score,
    max: 20,
    status: score >= 16 ? 'pass' : score >= 10 ? 'warn' : 'fail',
  }
}

// FAQ readiness: max 20 points
function scoreFAQ(page: TechnicalPage): SubScore {
  const count = page.faq.length
  const allHaveQuestion = page.faq.every(f => f.question.trim().endsWith('?'))
  const avgAnswerWords = count > 0
    ? page.faq.reduce((s, f) => s + wordCount(f.answer), 0) / count
    : 0
  const shortAnswers = avgAnswerWords > 0 && avgAnswerWords <= 80

  let score = 0
  if (count >= 5) score += 12
  else if (count >= 3) score += 6
  if (allHaveQuestion) score += 4
  if (shortAnswers) score += 4
  score = Math.min(20, score)

  return {
    label: 'FAQ Readiness',
    score,
    max: 20,
    status: score >= 16 ? 'pass' : score >= 10 ? 'warn' : 'fail',
  }
}

// Metadata completeness: max 20 points
function scoreMetadata(page: TechnicalPage): SubScore {
  let score = 0
  if (page.seoTitle) score += 5
  if (page.metaDescription) score += 5
  if (page.slug) score += 3
  if (page.lastUpdated) score += 4
  if (page.targetQuery) score += 3
  score = Math.min(20, score)

  return {
    label: 'Metadata Completeness',
    score,
    max: 20,
    status: score >= 17 ? 'pass' : score >= 12 ? 'warn' : 'fail',
  }
}

// Internal linking: max 10 points
function scoreInternalLinks(page: TechnicalPage): SubScore {
  const count = page.internalLinks.length
  let score = 0
  if (count >= 1) score += 5
  if (count >= 2) score += 5
  score = Math.min(10, score)

  return {
    label: 'Internal Linking',
    score,
    max: 10,
    status: score >= 8 ? 'pass' : score >= 4 ? 'warn' : 'fail',
  }
}

// Table/structure: max 10 points
function scoreTable(page: TechnicalPage): SubScore {
  const score = page.hasComparisonTable ? 10 : 0
  return {
    label: 'Comparison Table',
    score,
    max: 10,
    status: score === 10 ? 'pass' : 'warn',
  }
}

function buildIssues(page: TechnicalPage, subScores: SubScore[]): TechnicalIssue[] {
  const issues: TechnicalIssue[] = []
  const wc = wordCount(page.answerBlock)

  if (!page.lastUpdated)
    issues.push({
      issue: 'No last updated date',
      why: 'AI engines and search algorithms prefer fresh, dated content. Missing dates signal potentially stale information.',
      fix: 'Add a lastUpdated date in ISO format (YYYY-MM-DD) to the page metadata.',
      severity: 'Medium',
    })

  if (!page.metaDescription)
    issues.push({
      issue: 'Missing meta description',
      why: 'AI systems use meta descriptions to understand page scope. Without it, they may generate a poor summary.',
      fix: 'Write a 140–160 character meta description that directly answers the target query.',
      severity: 'High',
    })

  if (page.faq.length < 5)
    issues.push({
      issue: `FAQ section has only ${page.faq.length} question${page.faq.length !== 1 ? 's' : ''} (minimum 5 recommended)`,
      why: 'AI systems extract Q&A pairs from FAQs. Fewer than 5 questions reduces the AEO surface area significantly.',
      fix: 'Expand the FAQ to at least 5 questions that match real customer search queries.',
      severity: 'High',
    })

  if (page.internalLinks.length === 0)
    issues.push({
      issue: 'No internal links detected',
      why: 'Internal links help AI engines understand site structure and topic relationships. They also distribute authority.',
      fix: 'Add at least 2–3 contextual internal links to related OHRA pages (e.g., quote page, coverage overview).',
      severity: 'Medium',
    })

  if (!page.hasComparisonTable && ['Comparison', 'Consideration'].includes(page.intentStage))
    issues.push({
      issue: 'No comparison table for a comparison-intent page',
      why: 'AI engines extract structured comparison data from tables. Without a table, the content is harder to cite.',
      fix: 'Add a comparison table with clear column headers (coverage level, what is covered, typical use case).',
      severity: 'Medium',
    })

  if (wc > 0 && (wc < 60 || wc > 90))
    issues.push({
      issue: `Answer block is ${wc} words — target is 60–90 words`,
      why: 'Answer blocks in the 60–90 word range are optimal for AI extraction. Too short lacks context; too long dilutes focus.',
      fix: `${wc < 60 ? 'Expand' : 'Trim'} the answer block to 60–90 words while keeping it direct and factual.`,
      severity: 'Low',
    })

  if (page.headings.filter(h => h.level === 2).length < 3)
    issues.push({
      issue: 'Fewer than 3 H2 headings detected',
      why: 'H2 headings define content sections that AI systems use to segment and categorize information.',
      fix: 'Add at least 3 descriptive H2 headings that match the structure of the content.',
      severity: 'Low',
    })

  return issues
}

function buildSchemas(page: TechnicalPage): SchemaRecommendation[] {
  const schemas: SchemaRecommendation[] = []
  const baseUrl = 'https://www.ohra.nl'

  // Always recommend Article
  schemas.push({
    type: 'Article',
    reason: 'Every content page should have Article schema to help AI engines identify the author, publish date, and scope.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.h1,
      description: page.metaDescription || '[PLACEHOLDER: meta description]',
      author: { '@type': 'Organization', name: 'OHRA' },
      publisher: { '@type': 'Organization', name: 'OHRA', url: baseUrl },
      dateModified: page.lastUpdated || '[PLACEHOLDER: YYYY-MM-DD]',
      url: `${baseUrl}/${page.slug}`,
    },
  })

  // FAQPage if has FAQs
  if (page.faq.length > 0) {
    schemas.push({
      type: 'FAQPage',
      reason: 'Page has a FAQ section. FAQPage schema enables AI engines to directly extract Q&A pairs for answer citations.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    })
  }

  // BreadcrumbList — always useful
  schemas.push({
    type: 'BreadcrumbList',
    reason: 'BreadcrumbList helps AI engines understand site hierarchy and improves navigational context in citations.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Autoverzekering', item: `${baseUrl}/autoverzekering` },
        { '@type': 'ListItem', position: 3, name: page.label, item: `${baseUrl}/${page.slug}` },
      ],
    },
  })

  // HowTo if step-by-step
  if (page.isHowTo) {
    schemas.push({
      type: 'HowTo',
      reason: 'Page describes a step-by-step process. HowTo schema lets AI engines extract and present ordered instructions.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: page.h1,
        description: page.metaDescription || '[PLACEHOLDER: meta description]',
        step: page.headings
          .filter(h => h.level === 2 && /step|stap|\d\./i.test(h.text))
          .map((h, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: h.text,
            text: '[PLACEHOLDER: step description]',
          })),
      },
    })
  }

  return schemas
}

function buildLinkSuggestions(page: TechnicalPage): string[] {
  return OHRA_LINK_POOL.filter(link => !page.internalLinks.includes(link) && !link.includes(page.slug))
}

function buildMetadataItems(page: TechnicalPage) {
  return [
    { label: 'SEO Title', value: page.seoTitle || '—', ok: !!page.seoTitle },
    { label: 'Meta Description', value: page.metaDescription || '—', ok: !!page.metaDescription },
    { label: 'URL Slug', value: page.slug || '—', ok: !!page.slug },
    { label: 'Last Updated', value: page.lastUpdated || '—', ok: !!page.lastUpdated },
    { label: 'Target Query', value: page.targetQuery || '—', ok: !!page.targetQuery },
    { label: 'Disclaimer', value: page.hasDisclaimer ? 'Present' : 'Missing', ok: page.hasDisclaimer },
    { label: 'CTA', value: page.hasCTA ? 'Present' : 'Missing', ok: page.hasCTA },
  ]
}

export function checkPage(page: TechnicalPage): TechnicalReport {
  const subScores: SubScore[] = [
    scoreHeadings(page),
    scoreAnswerBlock(page),
    scoreFAQ(page),
    scoreMetadata(page),
    scoreInternalLinks(page),
    scoreTable(page),
  ]

  const total = subScores.reduce((s, ss) => s + ss.score, 0)
  const max   = subScores.reduce((s, ss) => s + ss.max, 0)
  const totalScore = Math.round((total / max) * 100)

  return {
    pageId:                 page.id,
    pageLabel:              page.label,
    checkedAt:              new Date().toISOString(),
    status:                 'Not Checked',
    totalScore,
    subScores,
    issues:                 buildIssues(page, subScores),
    schemaRecommendations:  buildSchemas(page),
    internalLinkSuggestions: buildLinkSuggestions(page),
    metadataItems:          buildMetadataItems(page),
  }
}

export function reportToMarkdown(report: TechnicalReport, page: TechnicalPage): string {
  const lines: string[] = [
    `# Technical GEO Report — ${report.pageLabel}`,
    `**Score:** ${report.totalScore}/100  |  **Status:** ${report.status}  |  **Checked:** ${new Date(report.checkedAt).toLocaleString('nl-NL')}`,
    '',
    '## Sub-scores',
    ...report.subScores.map(s => `- **${s.label}:** ${s.score}/${s.max} (${s.status})`),
    '',
    '## Issues',
    ...report.issues.map(i => `- [${i.severity}] **${i.issue}** — ${i.fix}`),
    '',
    '## Schema Recommendations',
    ...report.schemaRecommendations.map(s => `- **${s.type}:** ${s.reason}`),
    '',
    '## Internal Link Suggestions',
    ...report.internalLinkSuggestions.map(l => `- ${l}`),
    '',
    '## Metadata',
    ...report.metadataItems.map(m => `- ${m.ok ? '✓' : '✗'} **${m.label}:** ${m.value}`),
  ]
  return lines.join('\n')
}

export function reportToCSV(report: TechnicalReport): string {
  const rows = [
    ['Page', 'Score', 'Status', 'Issues', 'High Issues', 'Med Issues', 'Low Issues'],
    [
      report.pageLabel,
      String(report.totalScore),
      report.status,
      String(report.issues.length),
      String(report.issues.filter(i => i.severity === 'High').length),
      String(report.issues.filter(i => i.severity === 'Medium').length),
      String(report.issues.filter(i => i.severity === 'Low').length),
    ],
  ]
  return rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
}
