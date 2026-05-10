'use client'
import { useState } from 'react'
import type { ThemeResult, ReviewStatus } from '@/types/agent1'

const reviewStyles: Record<ReviewStatus, { badge: string; icon: string }> = {
  'New':           { badge: 'bg-blue-50 text-blue-700 border-blue-200',   icon: '🆕' },
  'Needs Review':  { badge: 'bg-orange-50 text-orange-700 border-orange-200', icon: '👁️' },
  'Approved':      { badge: 'bg-green-50 text-green-700 border-green-200',   icon: '✅' },
  'Rejected':      { badge: 'bg-red-50 text-red-700 border-red-200',         icon: '❌' },
}

const gapBadge: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
}

const ALL_STATUSES: ReviewStatus[] = ['New', 'Needs Review', 'Approved', 'Rejected']

interface Props {
  themes: ThemeResult[]
  reviewStatuses: Record<string, ReviewStatus>
  onStatusChange: (themeId: string, status: ReviewStatus) => void
}

export function ContentOpportunitiesTab({ themes, reviewStatuses, onStatusChange }: Props) {
  const [filter, setFilter] = useState<ReviewStatus | 'All'>('All')

  const filtered = themes.filter(t =>
    filter === 'All' || (reviewStatuses[t.theme.id] ?? 'New') === filter
  )

  const counts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = themes.filter(t => (reviewStatuses[t.theme.id] ?? 'New') === s).length
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 font-medium">Filter:</span>
        {(['All', ...ALL_STATUSES] as const).map(s => {
          const count = s === 'All' ? themes.length : counts[s]
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                filter === s
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {s} <span className="opacity-60">({count})</span>
            </button>
          )
        })}
        <span className="ml-auto text-xs text-gray-400">
          Review status is saved in your browser.
        </span>
      </div>

      {/* Human review notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">👤</span>
        <div>
          <div className="font-semibold text-amber-800 text-sm">Human Approval Required</div>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Nothing is published automatically. Marketing and compliance must review and approve each recommendation before any content is created. Use the dropdowns below to manage the review workflow.
          </p>
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          No opportunities with status &ldquo;{filter}&rdquo;
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((t, rank) => {
          const status = reviewStatuses[t.theme.id] ?? 'New'
          const rs = reviewStyles[status]
          const pct = t.priorityScore.total
          const barColor = pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-orange-400' : 'bg-gray-400'
          const rec = t.theme.recommendation

          return (
            <div key={t.theme.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
              status === 'Approved' ? 'border-green-200' : status === 'Rejected' ? 'border-red-100 opacity-75' : 'border-gray-100'
            }`}>
              {/* Card header */}
              <div className="flex items-start gap-4 p-5 pb-4">
                {/* Score circle */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white ${
                  pct >= 70 ? 'bg-green-600' : pct >= 50 ? 'bg-orange-500' : 'bg-gray-500'
                }`}>
                  <div className="text-lg font-bold leading-none">{pct}</div>
                  <div className="text-xs opacity-70">/100</div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">#{rank + 1}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${gapBadge[t.gapLevel]}`}>
                      {t.gapLevel} Gap
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{t.entries.length} signals</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mt-1 leading-tight">
                    {rec.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 border border-gray-200">
                      {rec.format}
                    </span>
                    <span className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1 border border-indigo-200">
                      {rec.schema}
                    </span>
                    <span className="text-xs text-gray-400">{t.theme.intentStage}</span>
                  </div>
                </div>

                {/* Review status */}
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold border rounded-full px-2.5 py-1 ${rs.badge}`}>
                    {rs.icon} {status}
                  </span>
                  <select
                    value={status}
                    onChange={e => onStatusChange(t.theme.id, e.target.value as ReviewStatus)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:border-[#1e3a5f] cursor-pointer"
                  >
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Progress bars */}
              <div className="px-5 pb-3">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${barColor} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <div className="grid grid-cols-5 gap-1 mt-2">
                  {[
                    { label: 'Freq', val: t.priorityScore.frequency },
                    { label: 'Comm.', val: t.priorityScore.commercialRelevance },
                    { label: 'Urgency', val: t.priorityScore.urgency },
                    { label: 'Gap', val: t.priorityScore.competitorGap },
                    { label: 'OHRA', val: t.priorityScore.ohraOpportunity },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="text-xs font-bold text-gray-700">{s.val}</div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                    📝 Content Strategy
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{rec.explanation}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                    🤖 Why This Helps GEO
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{rec.geoReason}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
