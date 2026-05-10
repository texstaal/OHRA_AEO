'use client'
import { useState, useMemo } from 'react'
import { contentPages, trendSignals } from '@/data/agent7Data'
import { analyzePages, exportToCSV, exportToMarkdown } from '@/lib/agent7Analyzer'
import type { FreshnessStatus, PriorityLabel, FreshnessLabel } from '@/types/agent7'

const LS_KEY = 'agent7_update_statuses'

const freshnessBadge: Record<FreshnessLabel, string> = {
  Fresh:          'bg-green-100 text-green-700 border-green-200',
  'Needs Review': 'bg-orange-100 text-orange-700 border-orange-200',
  Outdated:       'bg-red-100 text-red-700 border-red-200',
  Critical:       'bg-red-200 text-red-900 border-red-400',
}

const priorityBadge: Record<PriorityLabel, string> = {
  Low:      'bg-green-100 text-green-700 border-green-200',
  Medium:   'bg-orange-100 text-orange-700 border-orange-200',
  High:     'bg-red-100 text-red-700 border-red-200',
  Critical: 'bg-red-200 text-red-900 border-red-400',
}

const gapColor: Record<string, string> = {
  High: 'text-red-600', Medium: 'text-orange-500', Low: 'text-yellow-600', None: 'text-green-600',
}

const checkItem = (ok: boolean, label: string) => (
  <div className="flex items-center gap-2 text-xs">
    <span className={`font-bold flex-shrink-0 ${ok ? 'text-green-600' : 'text-red-500'}`}>{ok ? '✓' : '✗'}</span>
    <span className={ok ? 'text-gray-600' : 'text-gray-700 font-medium'}>{label}</span>
  </div>
)

const statusOptions: FreshnessStatus[] = [
  'New', 'Needs Content Review', 'Needs Compliance Review', 'Approved for Update', 'Rejected',
]

function download(content: string, filename: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
  a.download = filename
  a.click()
}

export function FreshnessDashboard() {
  const [statuses, setStatuses] = useState<Record<string, FreshnessStatus>>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}') } catch { return {} }
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const reports = useMemo(() => analyzePages(contentPages), [])

  const selected     = selectedId ? reports.find(r => r.pageId === selectedId) ?? null : null
  const selectedPage = selectedId ? contentPages.find(p => p.id === selectedId) ?? null : null

  function setStatus(id: string, status: FreshnessStatus) {
    const next = { ...statuses, [id]: status }
    setStatuses(next)
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  const sorted = [...reports].sort((a, b) => b.priorityScore - a.priorityScore)
  const critical  = reports.filter(r => r.priorityLabel === 'Critical').length
  const needsWork = reports.filter(r => ['Outdated', 'Critical', 'Needs Review'].includes(r.freshnessLabel)).length
  const scoreAvg  = Math.round(reports.reduce((s, r) => s + r.priorityScore, 0) / reports.length)
  const scoreBar  = (s: number) => s >= 75 ? 'bg-red-500' : s >= 50 ? 'bg-orange-500' : s >= 25 ? 'bg-yellow-500' : 'bg-green-500'

  return (
    <div className="max-w-[1100px]">
      {/* Agent header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-emerald-700 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🔄</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent 7 — Freshness & Update</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Which OHRA pages need to be updated to stay relevant and trustworthy for AI search engines?
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => download(exportToCSV(reports, contentPages), 'ohra-freshness.csv')}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            ↓ CSV
          </button>
          <button onClick={() => download(exportToMarkdown(reports, contentPages), 'ohra-freshness.md')}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            ↓ Markdown
          </button>
          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold">
            Layer 3 — Freshness
          </span>
        </div>
      </div>

      {selected && selectedPage ? (
        /* ── DETAIL VIEW ─────────────────────────────────────────────── */
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedId(null)}
              className="text-gray-400 hover:text-gray-700 text-sm font-medium flex items-center gap-1">
              ← Back
            </button>
            <span className="text-gray-300">|</span>
            <h2 className="text-base font-bold text-gray-900 flex-1 leading-tight">{selected.pageTitle}</h2>
          </div>

          {/* Priority score */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Update Priority Score</div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-gray-900">{selected.priorityScore}</span>
              <span className="text-gray-400 text-sm">/ 100</span>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold border ${priorityBadge[selected.priorityLabel]}`}>
                {selected.priorityLabel} Priority
              </span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${freshnessBadge[selected.freshnessLabel]}`}>
                {selected.freshnessLabel}
                {selected.ageInDays !== null ? ` — ${selected.ageInDays}d` : ' — date missing'}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
              <div className={`h-full rounded-full ${scoreBar(selected.priorityScore)}`}
                style={{ width: `${selected.priorityScore}%` }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Content Age', score: selected.ageScore, max: 40 },
                { label: 'Trend Drift', score: selected.trendScore, max: 20 },
                { label: 'Competitor Gap', score: selected.competitorScore, max: 20 },
                { label: 'Commercial Value', score: selected.commercialScore, max: 20 },
              ].map(d => (
                <div key={d.label} className="bg-gray-50 rounded-lg p-3 text-xs">
                  <div className="text-gray-500 mb-1">{d.label}</div>
                  <div className="text-lg font-bold text-gray-800">
                    {d.score}<span className="text-gray-400 text-xs font-normal">/{d.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Review Status</div>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(s => (
                <button key={s} onClick={() => setStatus(selected.pageId, s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    (statuses[selected.pageId] ?? 'New') === s
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 italic">
              This agent does not update or publish pages automatically. It only recommends updates for human review.
            </p>
          </div>

          {/* Suggested updates */}
          {selected.suggestions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Suggested Updates ({selected.suggestions.length})
              </div>
              <div className="space-y-3">
                {selected.suggestions.map((sug, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-bold border rounded-full px-2 py-0.5 ${priorityBadge[sug.priority]}`}>
                        {sug.priority}
                      </span>
                      <span className="text-sm font-semibold text-gray-800">{sug.suggestion}</span>
                    </div>
                    <p className="text-xs text-gray-500">{sug.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Freshness checklist */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Freshness Checklist</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {checkItem(selected.checklist.hasLastUpdatedDate,    'Visible last updated date')}
              {checkItem(selected.checklist.hasRecentExamples,     'Recent examples and statistics')}
              {checkItem(selected.checklist.hasCurrentFAQ,         'Current FAQ section')}
              {checkItem(selected.checklist.hasUpdatedSchema,      'Updated JSON-LD schema')}
              {checkItem(selected.checklist.hasCurrentInternalLinks, 'Current internal links')}
              {checkItem(selected.checklist.hasComplianceReview,   'Compliance review completed')}
            </div>
          </div>

          {/* Competitor freshness gaps */}
          {selected.competitorGaps.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Competitor Freshness Gaps</div>
              <div className="space-y-2">
                {selected.competitorGaps.map(gap => (
                  <div key={gap.brand} className="flex items-center gap-3 text-xs p-2.5 border border-gray-100 rounded-lg">
                    <span className="font-semibold text-gray-700 w-36">{gap.brand}</span>
                    <span className="text-gray-500">Updated: <strong>{gap.theirDate}</strong></span>
                    <span className="text-gray-500">OHRA: <strong>{gap.ourDate}</strong></span>
                    <span className={`ml-auto font-bold ${gapColor[gap.gapLevel]}`}>
                      {gap.gapLevel === 'None' ? '✓ Current' : `${gap.daysDiff}d behind — ${gap.gapLevel} gap`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── MAIN VIEW ───────────────────────────────────────────────── */
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total pages',       value: String(reports.length),  sub: 'monitored' },
              { label: 'Need attention',    value: String(needsWork),        sub: 'outdated or older' },
              { label: 'Critical alerts',   value: String(critical),         sub: '>12 months old', red: critical > 0 },
              { label: 'Avg update urgency', value: `${scoreAvg}/100`,       sub: 'priority score' },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="text-xs text-gray-400 font-medium mb-1">{k.label}</div>
                <div className={`text-2xl font-bold ${(k as { red?: boolean }).red ? 'text-red-600' : 'text-gray-900'}`}>{k.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Pages table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Content Pages — Freshness Overview</div>
            <div className="space-y-2">
              {sorted.map(r => {
                const page = contentPages.find(p => p.id === r.pageId)!
                const status = statuses[r.pageId] ?? 'New'
                return (
                  <div key={r.pageId}
                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-200 cursor-pointer"
                    onClick={() => setSelectedId(r.pageId)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-800 truncate">{r.pageTitle}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {page.lastUpdated ? `Updated ${page.lastUpdated}` : '⚠ No date'} · {page.intentStage}
                      </div>
                    </div>
                    <span className={`text-xs font-bold border rounded-full px-2 py-0.5 flex-shrink-0 ${freshnessBadge[r.freshnessLabel]}`}>
                      {r.freshnessLabel}
                    </span>
                    <div className="flex items-center gap-1.5 w-20 flex-shrink-0">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${scoreBar(r.priorityScore)}`} style={{ width: `${r.priorityScore}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-600">{r.priorityScore}</span>
                    </div>
                    <span className={`text-xs font-bold border rounded-full px-2 py-0.5 flex-shrink-0 ${priorityBadge[r.priorityLabel]}`}>
                      {r.priorityLabel}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0 hidden md:block">{status}</span>
                    <span className="text-gray-300 text-xs flex-shrink-0">→</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Trend signals */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Active Trend Signals ({trendSignals.length})
            </div>
            <div className="space-y-2">
              {trendSignals.map(ts => {
                const affected = contentPages.filter(p => p.trendSignalIds.includes(ts.id))
                return (
                  <div key={ts.id} className="flex items-start gap-3 text-xs p-3 border border-gray-100 rounded-lg">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">↑</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-700">{ts.signal}</div>
                      <div className="text-gray-400 mt-0.5">{ts.source}</div>
                    </div>
                    <div className="flex flex-wrap gap-1 flex-shrink-0">
                      {affected.map(p => (
                        <button key={p.id} onClick={() => setSelectedId(p.id)}
                          className="bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-2 py-0.5 text-xs font-medium hover:bg-amber-100">
                          {p.topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pipeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Agent 7 in the content pipeline
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {[
                { icon: '🔍', label: 'Agent 1', note: 'discovers',   bg: 'bg-[#1e3a5f]' },
                { icon: '📄', label: 'Agent 2', note: 'briefs',      bg: 'bg-blue-600' },
                { icon: '✍️', label: 'Agent 3', note: 'drafts',      bg: 'bg-[#1d4ed8]' },
                { icon: '⚖️', label: 'Agent 4', note: 'compliance',  bg: 'bg-purple-700' },
                { icon: '⚙️', label: 'Agent 5', note: 'technical',   bg: 'bg-teal-700' },
                { icon: '📡', label: 'Agent 6', note: 'earned media', bg: 'bg-amber-600' },
                { icon: '🔄', label: 'Agent 7', note: 'freshness',   bg: 'bg-emerald-700', active: true },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-medium ${step.bg} ${(step as { active?: boolean }).active ? 'ring-2 ring-emerald-300' : ''}`}>
                    <span>{step.icon}</span> {step.label}
                    <span className="text-white/50">{step.note}</span>
                  </div>
                  {i < arr.length - 1 && <span className="text-gray-300">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
