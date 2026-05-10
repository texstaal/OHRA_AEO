'use client'
import { useState } from 'react'
import type { ThemeResult } from '@/types/agent1'

const intentColors: Record<string, string> = {
  'Awareness':             'bg-sky-100 text-sky-700 border-sky-200',
  'Consideration':         'bg-blue-100 text-blue-700 border-blue-200',
  'Comparison':            'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Purchase':              'bg-green-100 text-green-700 border-green-200',
  'Post-purchase / Claim': 'bg-purple-100 text-purple-700 border-purple-200',
}

const sourceIcons: Record<string, string> = {
  'Reddit': '🟠',
  'Tweakers': '💻',
  'Google Autocomplete': '🔍',
  'YouTube comments': '▶️',
  'Review platform': '⭐',
  'AI search query': '🤖',
}

export function TrendClustersTab({ themes }: { themes: ThemeResult[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'priority' | 'count'>('priority')

  const sorted = [...themes].sort((a, b) =>
    sortBy === 'priority'
      ? b.priorityScore.total - a.priorityScore.total
      : b.entries.length - a.entries.length
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {themes.length} themes detected from customer signals. Click a row to expand example questions.
        </p>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-400 mr-1">Sort:</span>
          {(['priority', 'count'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                sortBy === s
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {s === 'priority' ? 'Priority Score' : 'Entry Count'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Theme</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Signals</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category Entry Point</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Intent Stage</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t, i) => {
                const isOpen = expanded === t.theme.id
                const pct = t.priorityScore.total
                const barColor = pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-orange-400' : 'bg-gray-400'

                return (
                  <>
                    <tr
                      key={t.theme.id}
                      onClick={() => setExpanded(isOpen ? null : t.theme.id)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors ${
                        isOpen ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs font-semibold">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{t.theme.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {Object.keys(t.competitorMentions).length} competitors mentioned
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1e3a5f] text-white text-xs font-bold">
                          {t.entries.length}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                          {t.theme.cep}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium border rounded-full px-2.5 py-1 ${intentColors[t.theme.intentStage] ?? 'bg-gray-100 text-gray-600'}`}>
                          {t.theme.intentStage}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-100 rounded-full h-2">
                            <div className={`${barColor} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="font-bold text-gray-700 text-xs w-6 text-right">{pct}</span>
                        </div>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr key={`${t.theme.id}-expanded`} className="bg-blue-50 border-b border-blue-100">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Example Customer Signals
                              </div>
                              <div className="space-y-2">
                                {t.exampleTexts.map((text, j) => (
                                  <div key={j} className="flex items-start gap-2 bg-white rounded-lg border border-blue-100 p-2.5">
                                    <span className="text-blue-400 mt-0.5 flex-shrink-0">💬</span>
                                    <span className="text-xs text-gray-700 italic leading-relaxed">&ldquo;{text}&rdquo;</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Sources & Competitors
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white rounded-lg border border-blue-100 p-2.5">
                                  <div className="text-xs text-gray-500 mb-1.5 font-medium">Signal sources</div>
                                  {Array.from(new Set(t.entries.map(e => e.source))).map(src => (
                                    <div key={src} className="text-xs text-gray-600 flex items-center gap-1">
                                      <span>{sourceIcons[src] ?? '📌'}</span>
                                      <span>{src}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="bg-white rounded-lg border border-blue-100 p-2.5">
                                  <div className="text-xs text-gray-500 mb-1.5 font-medium">Competitors mentioned</div>
                                  {Object.entries(t.competitorMentions).length > 0
                                    ? Object.entries(t.competitorMentions).sort((a, b) => b[1] - a[1]).map(([comp, count]) => (
                                        <div key={comp} className="text-xs text-gray-600 flex justify-between">
                                          <span>{comp}</span>
                                          <span className="font-semibold">{count}×</span>
                                        </div>
                                      ))
                                    : <div className="text-xs text-gray-400">None mentioned</div>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
