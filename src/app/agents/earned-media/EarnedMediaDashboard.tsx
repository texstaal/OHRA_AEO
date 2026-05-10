'use client'
import { useState, useMemo } from 'react'
import { mentions as allMentions } from '@/data/agent6Data'
import {
  calcBrandShares, calcSentimentByBrand, calcTopicVisibility,
  calcSourceGaps, buildOpportunities, calcTrustScore,
  exportToCSV, exportToMarkdown,
} from '@/lib/agent6Analyzer'
import type { EarnedStatus, GapLevel } from '@/types/agent6'

const LS_KEY = 'agent6_opportunity_statuses'

const gapBadge: Record<GapLevel, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
}

const sentimentColor = { Positive: 'text-green-600', Neutral: 'text-gray-500', Negative: 'text-red-600' }

const statusOptions: EarnedStatus[] = ['New', 'Needs PR Review', 'Needs Marketing Review', 'Approved', 'Rejected']

const TABS = ['Overview', 'Topics', 'Sources & Gaps', 'Opportunities', 'Mentions'] as const

function download(content: string, filename: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
  a.download = filename
  a.click()
}

export function EarnedMediaDashboard() {
  const [activeTab, setActiveTab]   = useState<typeof TABS[number]>('Overview')
  const [oppStatuses, setOppStatuses] = useState<Record<string, EarnedStatus>>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}') } catch { return {} }
  })
  const [topicFilter, setTopicFilter] = useState('All')
  const [sentFilter, setSentFilter]   = useState('All')

  const brandShares = useMemo(() => calcBrandShares(allMentions), [])
  const sentByBrand = useMemo(() => calcSentimentByBrand(allMentions), [])
  const topicVis    = useMemo(() => calcTopicVisibility(allMentions), [])
  const sourceGaps  = useMemo(() => calcSourceGaps(allMentions), [])
  const opps        = useMemo(() => buildOpportunities(topicVis), [topicVis])
  const trustScore  = useMemo(() => calcTrustScore(allMentions, brandShares, topicVis), [brandShares, topicVis])

  const ohraMentions = allMentions.filter(m => m.brands.includes('OHRA')).length
  const ohraSentiment = sentByBrand['OHRA'] ?? { positive: 0, neutral: 0, negative: 0 }

  function setOppStatus(id: string, status: EarnedStatus) {
    const next = { ...oppStatuses, [id]: status }
    setOppStatuses(next)
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  const filteredMentions = allMentions.filter(m => {
    if (topicFilter !== 'All' && m.topic !== topicFilter) return false
    if (sentFilter !== 'All' && m.sentiment !== sentFilter) return false
    return true
  })

  const topics = ['All', ...Array.from(new Set(allMentions.map(m => m.topic)))]
  const scoreColor = (s: number) => s >= 70 ? 'text-green-600' : s >= 45 ? 'text-orange-500' : 'text-red-600'
  const scoreBar   = (s: number) => s >= 70 ? 'bg-green-500' : s >= 45 ? 'bg-orange-500' : 'bg-red-500'

  return (
    <div className="max-w-[1100px]">
      {/* Agent header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">📡</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent 6 — Earned Media & Mention</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Where is OHRA visible or missing in third-party conversations that AI systems may use as trust signals?
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => download(exportToCSV(allMentions), 'ohra-mentions.csv')}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            ↓ CSV
          </button>
          <button
            onClick={() => download(exportToMarkdown(brandShares, topicVis, trustScore), 'ohra-earned-media.md')}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            ↓ Markdown
          </button>
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold">
            Layer 2 — Earned Media
          </span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Mentions', value: String(allMentions.length), sub: 'across all sources' },
          { label: 'OHRA Mentions', value: String(ohraMentions), sub: `${brandShares.find(b => b.brand === 'OHRA')?.pct ?? 0}% share of voice` },
          { label: 'Positive Sentiment', value: String(ohraSentiment.positive), sub: `${ohraSentiment.negative} negative alerts` },
          { label: 'AI Trust Score', value: `${trustScore.total}/100`, sub: 'based on 4 dimensions' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs text-gray-400 font-medium mb-1">{k.label}</div>
            <div className={`text-2xl font-bold ${k.label === 'AI Trust Score' ? scoreColor(trustScore.total) : 'text-gray-900'}`}>
              {k.value}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
      {activeTab === 'Overview' && (
        <div className="space-y-5">
          {/* AI Trust Score detail */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">AI Trust Signal Score</div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className={`text-4xl font-bold ${scoreColor(trustScore.total)}`}>{trustScore.total}</span>
              <span className="text-gray-400 text-sm">/ 100</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
              <div className={`h-full rounded-full ${scoreBar(trustScore.total)}`} style={{ width: `${trustScore.total}%` }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Mention Volume', score: trustScore.mentionScore },
                { label: 'Source Authority', score: trustScore.authorityScore },
                { label: 'Sentiment Quality', score: trustScore.sentimentScore },
                { label: 'Topic Breadth', score: trustScore.topicScore },
              ].map(d => (
                <div key={d.label} className="bg-gray-50 rounded-lg p-3 text-xs">
                  <div className="text-gray-500 mb-1">{d.label}</div>
                  <div className={`text-lg font-bold ${scoreColor(d.score * 4)}`}>{d.score}<span className="text-gray-400 text-xs font-normal">/25</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand mention share */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Brand Mention Share</div>
            <div className="space-y-2">
              {brandShares.map(b => {
                const s = sentByBrand[b.brand] ?? { positive: 0, neutral: 0, negative: 0 }
                const isOHRA = b.brand === 'OHRA'
                return (
                  <div key={b.brand} className={`flex items-center gap-3 p-2.5 rounded-lg ${isOHRA ? 'bg-amber-50 border border-amber-200' : ''}`}>
                    <div className={`w-28 text-xs font-semibold ${isOHRA ? 'text-amber-700' : 'text-gray-700'}`}>
                      {isOHRA ? '★ ' : ''}{b.brand}
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isOHRA ? 'bg-amber-500' : 'bg-gray-300'}`}
                        style={{ width: `${b.pct}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 w-20 text-right">{b.count} ({b.pct}%)</div>
                    <div className="text-xs flex gap-2 w-28 justify-end">
                      <span className="text-green-600">+{s.positive}</span>
                      <span className="text-gray-400">~{s.neutral}</span>
                      <span className="text-red-500">−{s.negative}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3 italic">
              This agent does not automatically contact anyone or place content. It only identifies earned media opportunities for human review.
            </p>
          </div>
        </div>
      )}

      {/* ── TOPICS ────────────────────────────────────────────────────── */}
      {activeTab === 'Topics' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Topic-Level Visibility</div>
          <div className="space-y-3">
            {topicVis.map(t => (
              <div key={t.topic} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-800">{t.topic}</span>
                  <span className={`text-xs font-bold border rounded-full px-2 py-0.5 ${gapBadge[t.gapLevel]}`}>
                    {t.gapLevel} Gap
                  </span>
                </div>
                <div className="flex gap-6 text-xs text-gray-600 mb-2">
                  <span>OHRA: <strong className="text-amber-700">{t.ohraCount}</strong></span>
                  <span>{t.topCompetitor}: <strong className="text-gray-800">{t.topCompetitorCount}</strong></span>
                </div>
                <p className="text-xs text-gray-500">{t.opportunity}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SOURCES & GAPS ────────────────────────────────────────────── */}
      {activeTab === 'Sources & Gaps' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Source Gap Detection</div>
          <div className="space-y-3">
            {sourceGaps.map(sg => (
              <div key={sg.source} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-800">{sg.source}</span>
                    <span className="text-xs text-gray-400">Authority {sg.authorityScore}</span>
                  </div>
                  <span className={`text-xs font-bold border rounded-full px-2 py-0.5 ${gapBadge[sg.gapLevel]}`}>
                    {sg.gapLevel} Gap
                  </span>
                </div>
                <div className="flex gap-6 text-xs text-gray-600 mb-2">
                  <span>OHRA mentions: <strong className="text-amber-700">{sg.ohraMentions}</strong></span>
                  <span>Competitor mentions: <strong className="text-gray-800">{sg.competitorMentions}</strong></span>
                </div>
                <p className="text-xs text-gray-500">{sg.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── OPPORTUNITIES ─────────────────────────────────────────────── */}
      {activeTab === 'Opportunities' && (
        <div className="space-y-3">
          {opps.map(opp => {
            const status = oppStatuses[opp.id] ?? 'New'
            return (
              <div key={opp.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold border rounded-full px-2 py-0.5 ${gapBadge[opp.priority]}`}>
                        {opp.priority} Priority
                      </span>
                      <span className="text-xs font-semibold text-gray-600">{opp.topic}</span>
                    </div>
                    <p className="text-sm text-gray-700">{opp.insight}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {statusOptions.map(s => (
                    <button
                      key={s}
                      onClick={() => setOppStatus(opp.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        status === s
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── MENTIONS ──────────────────────────────────────────────────── */}
      {activeTab === 'Mentions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={topicFilter}
              onChange={e => setTopicFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
            >
              {topics.map(t => <option key={t}>{t}</option>)}
            </select>
            <select
              value={sentFilter}
              onChange={e => setSentFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
            >
              {['All', 'Positive', 'Neutral', 'Negative'].map(s => <option key={s}>{s}</option>)}
            </select>
            <span className="text-xs text-gray-400 self-center">{filteredMentions.length} mentions</span>
          </div>

          <div className="space-y-2">
            {filteredMentions.map(m => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-600">{m.source}</span>
                  <span className="text-gray-200">·</span>
                  <span className="text-xs text-gray-400">{m.date}</span>
                  <span className="text-gray-200">·</span>
                  <span className={`text-xs font-semibold ${sentimentColor[m.sentiment]}`}>{m.sentiment}</span>
                  <span className="text-gray-200">·</span>
                  <span className="text-xs text-gray-400">Auth {m.authorityScore}</span>
                  <span className="ml-auto text-xs text-gray-400">{m.topic}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2 italic">"{m.text}"</p>
                <div className="flex flex-wrap gap-1">
                  {m.brands.map(b => (
                    <span
                      key={b}
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        b === 'OHRA'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-6">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Agent 6 in the content pipeline
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {[
            { icon: '🔍', label: 'Agent 1', note: 'discovers', bg: 'bg-[#1e3a5f]' },
            { icon: '📄', label: 'Agent 2', note: 'briefs', bg: 'bg-blue-600' },
            { icon: '✍️', label: 'Agent 3', note: 'drafts', bg: 'bg-[#1d4ed8]' },
            { icon: '⚖️', label: 'Agent 4', note: 'compliance', bg: 'bg-purple-700' },
            { icon: '⚙️', label: 'Agent 5', note: 'technical', bg: 'bg-teal-700' },
            { icon: '📡', label: 'Agent 6', note: 'earned media', bg: 'bg-amber-600', active: true },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-medium ${step.bg} ${(step as { active?: boolean }).active ? 'ring-2 ring-amber-300' : ''}`}>
                <span>{step.icon}</span> {step.label}
                <span className="text-white/50">{step.note}</span>
              </div>
              {i < arr.length - 1 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
