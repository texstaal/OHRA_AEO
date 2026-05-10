'use client'
import type { ThemeResult } from '@/types/agent1'

const gapStyles = {
  High:   { badge: 'bg-red-100 text-red-700 border-red-200',    bar: 'bg-red-400',    icon: '🔴', label: 'High Gap' },
  Medium: { badge: 'bg-orange-100 text-orange-700 border-orange-200', bar: 'bg-orange-400', icon: '🟡', label: 'Medium Gap' },
  Low:    { badge: 'bg-green-100 text-green-700 border-green-200',  bar: 'bg-green-400',  icon: '🟢', label: 'Low Gap' },
}

export function CompetitorGapsTab({ themes }: { themes: ThemeResult[] }) {
  // All unique competitors across all themes
  const allCompetitors = Array.from(
    new Set(themes.flatMap(t => Object.keys(t.competitorMentions)))
  ).sort()

  const highGap = themes.filter(t => t.gapLevel === 'High')
  const totalCompetitorMentions = themes.reduce(
    (sum, t) => sum + Object.values(t.competitorMentions).reduce((a, b) => a + b, 0), 0
  )
  const totalOHRAMentions = themes.reduce((sum, t) => sum + t.ohraCount, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <div className="text-3xl font-bold text-red-700">{highGap.length}</div>
          <div className="text-xs text-red-600 mt-1 font-medium">High Gap Themes</div>
          <div className="text-xs text-gray-400 mt-0.5">Competitors dominate, OHRA absent</div>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 text-center">
          <div className="text-3xl font-bold text-orange-700">{totalCompetitorMentions}</div>
          <div className="text-xs text-orange-600 mt-1 font-medium">Total Competitor Mentions</div>
          <div className="text-xs text-gray-400 mt-0.5">Across all themes</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
          <div className="text-3xl font-bold text-blue-700">{totalOHRAMentions}</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">OHRA Mentions</div>
          <div className="text-xs text-gray-400 mt-0.5">In all customer signals</div>
        </div>
      </div>

      {/* Gap table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="font-semibold text-gray-800 text-sm">Competitor Visibility Gap by Theme</div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span>🔴</span> High gap</span>
            <span className="flex items-center gap-1"><span>🟡</span> Medium gap</span>
            <span className="flex items-center gap-1"><span>🟢</span> Low gap</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Theme</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Signals</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Top Competitor</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Comp. Mentions</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">OHRA Mentions</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Visibility Gap</th>
              </tr>
            </thead>
            <tbody>
              {themes
                .slice()
                .sort((a, b) => {
                  const order = { High: 0, Medium: 1, Low: 2 }
                  return order[a.gapLevel] - order[b.gapLevel]
                })
                .map(t => {
                  const g = gapStyles[t.gapLevel]
                  const totalComp = Object.values(t.competitorMentions).reduce((a, b) => a + b, 0)
                  const maxBar = t.entries.length
                  const compPct = Math.round((totalComp / maxBar) * 100)
                  const ohraPct = Math.round((t.ohraCount / maxBar) * 100)
                  return (
                    <tr key={t.theme.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{t.theme.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{t.theme.intentStage}</div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 text-xs font-medium">{t.entries.length}</td>
                      <td className="px-4 py-3">
                        {t.topCompetitor !== 'None' ? (
                          <div>
                            <div className="font-medium text-gray-700 text-xs">{t.topCompetitor}</div>
                            <div className="text-xs text-gray-400">{t.topCompetitorCount} mention{t.topCompetitorCount !== 1 ? 's' : ''}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-gray-100 rounded-full h-2">
                            <div className="bg-red-400 h-2 rounded-full" style={{ width: `${Math.min(compPct, 100)}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 w-5">{totalComp}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${Math.min(ohraPct, 100)}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 w-5">{t.ohraCount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold border rounded-full px-2.5 py-1 ${g.badge}`}>
                          {g.icon} {g.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitor breakdown */}
      {allCompetitors.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Total Competitor Mentions Across All Themes
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allCompetitors.map(comp => {
              const total = themes.reduce((sum, t) => sum + (t.competitorMentions[comp] ?? 0), 0)
              return (
                <div key={comp} className="bg-gray-50 rounded-lg border border-gray-100 p-3 text-center">
                  <div className="font-bold text-gray-800 text-xl">{total}</div>
                  <div className="text-xs text-gray-500 mt-1">{comp}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5">
            <p className="text-xs text-amber-700">
              <strong>What this means:</strong> Themes with high competitor mentions and low OHRA mentions represent the biggest content gaps. These are the areas where creating AI-optimized content would have the highest impact on OHRA&apos;s visibility in AI search results.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
