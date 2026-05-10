'use client'
import { useMemo } from 'react'
import { seedEntries } from '@/data/agent8Data'
import type { AEOEntry } from '@/types/agent8'

function loadEntries(): AEOEntry[] {
  try {
    const stored = JSON.parse(localStorage.getItem('agent8_aeo_entries') ?? 'null')
    if (Array.isArray(stored) && stored.length > 0) return stored
  } catch { /* ignore */ }
  return seedEntries
}

const deltaColor = (d: number) =>
  d > 0 ? 'text-green-600' : d < 0 ? 'text-red-500' : 'text-gray-400'

const deltaIcon = (d: number) =>
  d > 0 ? '↑' : d < 0 ? '↓' : '→'

const statusBadge = (d: number) =>
  d >= 3 ? 'bg-green-100 text-green-700 border-green-200'
  : d <= -3 ? 'bg-red-100 text-red-700 border-red-200'
  : 'bg-orange-100 text-orange-700 border-orange-200'

const statusLabel = (d: number) =>
  d >= 3 ? 'Improving' : d <= -3 ? 'Declining' : 'Stable'

export function AEOScoreSection() {
  const { latest, prev, weekLabel } = useMemo(() => {
    const sorted = loadEntries().sort((a, b) => a.date.localeCompare(b.date))
    return {
      latest:    sorted[sorted.length - 1] ?? null,
      prev:      sorted[sorted.length - 2] ?? null,
      weekLabel: sorted[sorted.length - 1]?.date ?? '—',
    }
  }, [])

  if (!latest) return null

  const totalDelta = prev ? latest.total - prev.total : null

  const subs = [
    { label: 'Visibility', now: latest.visibility, was: prev?.visibility },
    { label: 'Content',    now: latest.content,    was: prev?.content },
    { label: 'Authority',  now: latest.authority,  was: prev?.authority },
    { label: 'Technical',  now: latest.technical,  was: prev?.technical },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total score card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
        <div>
          <div className="text-xs text-gray-400 font-medium mb-1">Total AEO Score</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">{latest.total}</span>
            <span className="text-gray-400 text-sm">/ 100</span>
          </div>
          {totalDelta !== null && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge(totalDelta)}`}>
                {statusLabel(totalDelta)}
              </span>
              <span className={`text-sm font-bold ${deltaColor(totalDelta)}`}>
                {deltaIcon(totalDelta)} {totalDelta > 0 ? `+${totalDelta}` : totalDelta} vs last week
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-50">
          <div className="text-xs text-gray-400">Week of {weekLabel}</div>
          <div className="text-xs text-gray-400">HubSpot AEO Grader · OHRA · Netherlands</div>
        </div>
      </div>

      {/* Sub-scores card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="text-xs text-gray-400 font-medium mb-3">Sub-scores</div>
        <div className="space-y-2.5">
          {subs.map(s => {
            const d = s.was !== undefined ? s.now - s.was : null
            return (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{s.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{s.now}</span>
                  {d !== null && (
                    <span className={`text-xs font-semibold ${deltaColor(d)}`}>
                      {deltaIcon(d)}{d !== 0 ? ` ${Math.abs(d)}` : ''}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Week-on-week summary card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="text-xs text-gray-400 font-medium mb-3">Week-on-Week</div>
        {prev && totalDelta !== null ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-center">
                <div className="text-xs text-gray-400">Previous</div>
                <div className="text-2xl font-bold text-gray-400">{prev.total}</div>
              </div>
              <div className={`text-2xl font-bold ${deltaColor(totalDelta)}`}>→</div>
              <div className="text-center">
                <div className="text-xs text-gray-400">This week</div>
                <div className="text-2xl font-bold text-gray-900">{latest.total}</div>
              </div>
            </div>
            <div className="space-y-1">
              {subs.map(s => {
                const d = s.was !== undefined ? s.now - s.was : 0
                if (d === 0) return null
                return (
                  <div key={s.label} className={`text-xs font-medium ${deltaColor(d)}`}>
                    {deltaIcon(d)} {s.label} {d > 0 ? `+${d}` : d}
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-400">Add a second weekly entry in Agent 8 to see the comparison.</p>
        )}
      </div>
    </div>
  )
}
