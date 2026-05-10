'use client'
import type { AnalysisResult } from '@/types/agent1'

const gapColor: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
}

interface Props {
  analysis: AnalysisResult
  dataSource: 'sample' | 'uploaded'
}

export function OverviewTab({ analysis, dataSource }: Props) {
  const highGap    = analysis.themes.filter(t => t.gapLevel === 'High').length
  const highPrio   = analysis.themes.filter(t => t.priorityScore.total >= 70).length
  const topTheme   = analysis.themes[0]

  const stats = [
    { label: 'Entries Analyzed', value: analysis.totalEntries, icon: '📊', color: 'border-[#1e3a5f]', text: 'text-[#1e3a5f]' },
    { label: 'Themes Detected', value: analysis.themes.length, icon: '🏷️', color: 'border-blue-500', text: 'text-blue-700' },
    { label: 'High-Priority Opportunities', value: highPrio, icon: '⚡', color: 'border-orange-500', text: 'text-orange-600' },
    { label: 'High Competitor Gaps', value: highGap, icon: '🔴', color: 'border-red-500', text: 'text-red-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 border-l-4 ${s.color}`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-bold ${s.text}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top opportunity */}
      {topTheme && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            🏆 Top Priority Opportunity
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#1e3a5f] flex flex-col items-center justify-center text-white">
              <div className="text-xl font-bold">{topTheme.priorityScore.total}</div>
              <div className="text-xs opacity-70">/ 100</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 text-base">{topTheme.theme.label}</div>
              <div className="text-sm text-gray-500 mt-0.5">{topTheme.theme.cep}</div>
              <div className="mt-2 text-sm text-gray-700 leading-relaxed italic">
                &ldquo;{topTheme.exampleTexts[0]}&rdquo;
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${gapColor[topTheme.gapLevel]}`}>
                {topTheme.gapLevel} Gap
              </div>
              <div className="text-xs text-gray-400 mt-1">{topTheme.entries.length} signals</div>
            </div>
          </div>
        </div>
      )}

      {/* Priority score breakdown for top 5 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Priority Score Breakdown — Top {Math.min(5, analysis.themes.length)} Themes
        </div>
        <div className="space-y-3">
          {analysis.themes.slice(0, 5).map((t, i) => {
            const pct = (t.priorityScore.total / 100) * 100
            const barColor = t.priorityScore.total >= 70 ? 'bg-green-500' : t.priorityScore.total >= 50 ? 'bg-orange-400' : 'bg-gray-400'
            return (
              <div key={t.theme.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-5 font-bold">#{i + 1}</span>
                    <span className="font-medium text-gray-800">{t.theme.label}</span>
                  </div>
                  <span className="font-bold text-gray-700">{t.priorityScore.total}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${barColor} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Score methodology */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">
          How the Priority Score Works
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Frequency', desc: 'How often this theme appears', max: 20 },
            { label: 'Commercial Value', desc: 'Revenue potential for OHRA', max: 20 },
            { label: 'Urgency', desc: 'How time-sensitive the topic is', max: 20 },
            { label: 'Competitor Gap', desc: 'How underrepresented OHRA is', max: 20 },
            { label: 'OHRA Opportunity', desc: 'Fit with OHRA\'s offering', max: 20 },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg border border-blue-100 p-3 text-center">
              <div className="font-bold text-blue-800 text-sm">{s.label}</div>
              <div className="text-blue-600 font-bold text-lg mt-1">0–{s.max}</div>
              <div className="text-xs text-gray-500 mt-1 leading-tight">{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-blue-600">
          Total Score = Frequency + Commercial Value + Urgency + Competitor Gap + OHRA Opportunity (max 100)
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Data source: {dataSource === 'sample' ? 'preloaded sample dataset' : 'uploaded CSV file'} · {analysis.totalEntries} entries · {analysis.uncategorized} uncategorized
      </div>
    </div>
  )
}
