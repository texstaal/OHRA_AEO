'use client'
import { useState, useMemo } from 'react'
import { seedEntries } from '@/data/agent8Data'
import type { AEOEntry, WeekComparison } from '@/types/agent8'

const LS_KEY = 'agent8_aeo_entries'

// ── Score comparison logic ────────────────────────────────────────────────────

function buildComparison(current: AEOEntry, prev: AEOEntry): WeekComparison {
  const delta = current.total - prev.total
  const status = delta >= 3 ? 'Improving' : delta <= -3 ? 'Declining' : 'Stable'

  const subDeltas = [
    { label: 'Visibility', delta: current.visibility - prev.visibility },
    { label: 'Content',    delta: current.content    - prev.content    },
    { label: 'Authority',  delta: current.authority  - prev.authority  },
    { label: 'Technical',  delta: current.technical  - prev.technical  },
  ]

  // Auto-generate written analysis from deltas
  const dir = delta > 0 ? `improved by ${delta} point${delta !== 1 ? 's' : ''}` : delta < 0 ? `declined by ${Math.abs(delta)} point${Math.abs(delta) !== 1 ? 's' : ''}` : 'stayed the same'
  const biggest = [...subDeltas].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0]
  const biggestDir = biggest.delta > 0 ? 'improved' : biggest.delta < 0 ? 'declined' : 'unchanged'

  let analysis = `This week, OHRA's AEO score ${dir} (${prev.total} → ${current.total}). `
  if (biggest.delta !== 0) {
    analysis += `The largest movement was in ${biggest.label}, which ${biggestDir} by ${Math.abs(biggest.delta)} point${Math.abs(biggest.delta) !== 1 ? 's' : ''}. `
  }
  if (status === 'Improving') {
    analysis += 'Recent GEO and content improvements appear to be positively impacting visibility.'
  } else if (status === 'Declining') {
    analysis += 'A review of recent changes is recommended — the score has dropped enough to warrant attention.'
  } else {
    analysis += 'Scores are holding steady. Continue executing the content and technical GEO roadmap.'
  }

  // Rule-based recommendations based on lowest sub-scores
  const subs = [
    { label: 'visibility', score: current.visibility },
    { label: 'content',    score: current.content    },
    { label: 'authority',  score: current.authority  },
    { label: 'technical',  score: current.technical  },
  ].sort((a, b) => a.score - b.score)

  const recMap: Record<string, string> = {
    visibility: 'Improve visibility by publishing answer-first content targeting high-intent Dutch insurance queries.',
    content:    'Expand FAQ sections and add comparison tables to key pages — these are primary AI extraction surfaces.',
    authority:  'Improve authority by securing OHRA mentions on third-party comparison sites and Dutch insurance review platforms.',
    technical:  'Update JSON-LD schema (FAQPage, Article, HowTo) on recently updated pages to improve machine readability.',
  }

  const recommendations = subs.slice(0, 2).map(s => recMap[s.label])
  if (status === 'Declining') {
    recommendations.push('Run Agent 7 Freshness Check to identify pages that may have become outdated since last week.')
  } else {
    recommendations.push('Run Agent 6 Earned Media scan to identify new third-party mention opportunities.')
  }

  return { status, delta, subDeltas, analysis, recommendations }
}

function exportToCSV(entries: AEOEntry[]): string {
  const header = 'date,total,visibility,content,authority,technical,notes'
  const rows = entries.map(e =>
    [e.date, e.total, e.visibility, e.content, e.authority, e.technical, `"${e.notes}"`].join(',')
  )
  return [header, ...rows].join('\n')
}

function exportToMarkdown(entries: AEOEntry[], cmp: WeekComparison | null): string {
  const latest = entries[entries.length - 1]
  const lines = [
    '# OHRA Weekly AEO Score Report',
    `**Company:** OHRA | **Location:** Netherlands | **Product:** Car Insurance`,
    `**Latest entry:** ${latest?.date ?? '—'} | **Score:** ${latest?.total ?? '—'}/100`,
    '',
    cmp ? `## Week-on-Week Change\n${cmp.analysis}` : '',
    '',
    '## Score History',
    'Date | Total | Visibility | Content | Authority | Technical',
    '---- | ----- | ---------- | ------- | --------- | ---------',
    ...entries.map(e => `${e.date} | ${e.total} | ${e.visibility} | ${e.content} | ${e.authority} | ${e.technical}`),
  ]
  return lines.join('\n')
}

// ── Simple SVG line chart ─────────────────────────────────────────────────────

function ScoreChart({ entries }: { entries: AEOEntry[] }) {
  if (entries.length < 2) return null
  const W = 560, H = 120, PAD = 20
  const scores = entries.map(e => e.total)
  const min = Math.max(0, Math.min(...scores) - 10)
  const max = Math.min(100, Math.max(...scores) + 10)
  const xStep = (W - PAD * 2) / (entries.length - 1)
  const yScale = (v: number) => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2)

  const points = entries.map((e, i) => ({ x: PAD + i * xStep, y: yScale(e.total), score: e.total, date: e.date }))
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 140 }}>
      {/* Grid lines */}
      {[min, Math.round((min + max) / 2), max].map(v => (
        <g key={v}>
          <line x1={PAD} x2={W - PAD} y1={yScale(v)} y2={yScale(v)} stroke="#f0f0f0" strokeWidth="1" />
          <text x={PAD - 4} y={yScale(v) + 4} textAnchor="end" fontSize="9" fill="#aaa">{Math.round(v)}</text>
        </g>
      ))}
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinejoin="round" />
      {/* Dots + labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#1d4ed8" />
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600">{p.score}</text>
          <text x={p.x} y={H - 4} textAnchor="middle" fontSize="8" fill="#9ca3af">{p.date.slice(5)}</text>
        </g>
      ))}
    </svg>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

const EMPTY_FORM = { date: '', total: '', visibility: '', content: '', authority: '', technical: '', notes: '' }

const statusBadge: Record<string, string> = {
  Improving: 'bg-green-100 text-green-700 border-green-200',
  Stable:    'bg-orange-100 text-orange-700 border-orange-200',
  Declining: 'bg-red-100 text-red-700 border-red-200',
}

const deltaColor = (d: number) => d > 0 ? 'text-green-600' : d < 0 ? 'text-red-600' : 'text-gray-400'
const deltaSign  = (d: number) => d > 0 ? `+${d}` : String(d)

function download(content: string, filename: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
  a.download = filename
  a.click()
}

function loadEntries(): AEOEntry[] {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) ?? 'null')
    if (Array.isArray(stored) && stored.length > 0) return stored
  } catch { /* ignore */ }
  return seedEntries
}

export function AEOTrackingDashboard() {
  const [entries, setEntries] = useState<AEOEntry[]>(loadEntries)
  const [form, setForm]       = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')

  const sorted  = useMemo(() => [...entries].sort((a, b) => a.date.localeCompare(b.date)), [entries])
  const latest  = sorted[sorted.length - 1] ?? null
  const prev    = sorted[sorted.length - 2] ?? null
  const cmp     = latest && prev ? buildComparison(latest, prev) : null

  function persist(next: AEOEntry[]) {
    setEntries(next)
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const total = Number(form.total), vis = Number(form.visibility),
          cont  = Number(form.content), auth = Number(form.authority), tech = Number(form.technical)

    if (!form.date || [total, vis, cont, auth, tech].some(v => isNaN(v) || v < 0 || v > 100)) {
      setFormError('Please fill all fields with valid scores (0–100).')
      return
    }
    const entry: AEOEntry = {
      id:         `w${Date.now()}`,
      date:       form.date,
      total, visibility: vis, content: cont, authority: auth, technical: tech,
      notes:      form.notes,
    }
    persist([...entries, entry])
    setForm(EMPTY_FORM)
    setShowForm(false)
    setFormError('')
  }

  function deleteEntry(id: string) {
    persist(entries.filter(e => e.id !== id))
  }

  const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="max-w-[1100px]">
      {/* Agent header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">📊</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent 8 — Weekly AEO Score Tracking</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Is OHRA's AEO visibility improving or declining compared to last week?
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => download(exportToCSV(sorted), 'ohra-aeo-scores.csv')}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            ↓ CSV
          </button>
          <button onClick={() => download(exportToMarkdown(sorted, cmp), 'ohra-aeo-report.md')}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            ↓ Markdown
          </button>
          <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
            Layer 3 — AEO Tracking
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Company details + latest score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Company card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">HubSpot AEO Grader Setup</div>
            <div className="space-y-1.5 text-sm">
              {[
                ['Company', 'OHRA'],
                ['Location', 'Netherlands'],
                ['Product / Service', 'Car Insurance'],
                ['Industry', 'Insurance'],
                ['Grader URL', 'hubspot.com/aeo-grader'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-gray-400 w-36 flex-shrink-0">{k}</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 italic">
              Visit the HubSpot AEO Grader, enter the details above, and manually record the scores below each week.
            </p>
          </div>

          {/* Latest score card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Latest AEO Score {latest ? `— ${latest.date}` : ''}
            </div>
            {latest ? (
              <>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl font-bold text-gray-900">{latest.total}</span>
                  <span className="text-gray-400">/100</span>
                  {cmp && (
                    <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge[cmp.status]}`}>
                      {cmp.status} {cmp.delta !== 0 ? `(${deltaSign(cmp.delta)})` : ''}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ['Visibility', latest.visibility],
                    ['Content',    latest.content],
                    ['Authority',  latest.authority],
                    ['Technical',  latest.technical],
                  ].map(([label, score]) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                      <div className="text-gray-400 mb-0.5">{label}</div>
                      <div className="text-xl font-bold text-gray-800">{score}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">No entries yet. Add your first weekly score below.</p>
            )}
          </div>
        </div>

        {/* Week-on-week comparison */}
        {cmp && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Week-on-Week Change</div>
            <div className="flex flex-wrap gap-3 mb-4">
              {cmp.subDeltas.map(sd => (
                <div key={sd.label} className="bg-gray-50 rounded-lg px-4 py-3 text-center min-w-[90px]">
                  <div className="text-xs text-gray-400 mb-1">{sd.label}</div>
                  <div className={`text-xl font-bold ${deltaColor(sd.delta)}`}>
                    {sd.delta === 0 ? '—' : deltaSign(sd.delta)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-4">{cmp.analysis}</p>
            <div className="space-y-2">
              {cmp.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart */}
        {sorted.length >= 2 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Total AEO Score Trend</div>
            <ScoreChart entries={sorted} />
          </div>
        )}

        {/* Score history table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Score History</div>
            <button
              onClick={() => setShowForm(f => !f)}
              className="px-3 py-1.5 bg-[#1d4ed8] text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              {showForm ? '✕ Cancel' : '+ Add This Week\'s Score'}
            </button>
          </div>

          {/* Input form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
              <div className="text-xs font-semibold text-blue-700 mb-2">New Weekly Entry</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Date</label>
                  <input type="date" value={form.date} onChange={f('date')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                {(['total', 'visibility', 'content', 'authority', 'technical'] as const).map(key => (
                  <div key={key}>
                    <label className="text-xs text-gray-600 mb-1 block capitalize">{key} score</label>
                    <input type="number" min="0" max="100" value={form[key]} onChange={f(key)}
                      placeholder="0–100"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Notes (optional)</label>
                <textarea value={form.notes} onChange={f('notes')} rows={2}
                  placeholder="What changed this week?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm resize-none" />
              </div>
              {formError && <p className="text-xs text-red-600">{formError}</p>}
              <button type="submit"
                className="px-4 py-2 bg-[#1d4ed8] text-white text-xs font-semibold rounded-lg hover:bg-blue-800">
                Save Entry
              </button>
            </form>
          )}

          {/* History rows */}
          <div className="space-y-1">
            <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 pb-1 border-b border-gray-100">
              <span className="col-span-2">Date</span>
              <span className="text-right">Total</span>
              <span className="text-right">Vis</span>
              <span className="text-right">Content</span>
              <span className="text-right">Auth</span>
              <span className="text-right">Tech</span>
            </div>
            {[...sorted].reverse().map((entry, i, arr) => {
              const prevEntry = arr[i + 1]
              const d = prevEntry ? entry.total - prevEntry.total : null
              return (
                <div key={entry.id}
                  className="grid grid-cols-7 gap-2 text-xs px-2 py-2 rounded-lg hover:bg-gray-50 items-center group">
                  <div className="col-span-2">
                    <div className="font-medium text-gray-700">{entry.date}</div>
                    {entry.notes && <div className="text-gray-400 truncate" title={entry.notes}>{entry.notes}</div>}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{entry.total}</span>
                    {d !== null && (
                      <span className={`ml-1 text-xs font-semibold ${deltaColor(d)}`}>
                        {deltaSign(d)}
                      </span>
                    )}
                  </div>
                  <span className="text-right text-gray-600">{entry.visibility}</span>
                  <span className="text-right text-gray-600">{entry.content}</span>
                  <span className="text-right text-gray-600">{entry.authority}</span>
                  <div className="text-right flex items-center justify-end gap-2">
                    <span className="text-gray-600">{entry.technical}</span>
                    <button onClick={() => deleteEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs transition-opacity">
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pipeline */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Agent 8 in the content pipeline
          </div>
          <p className="text-xs text-gray-500 mb-3 italic">
            This agent does not automatically change the website. It only tracks performance and recommends next actions.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {[
              { icon: '🔍', label: 'Agent 1', note: 'discovers',    bg: 'bg-[#1e3a5f]' },
              { icon: '📄', label: 'Agent 2', note: 'briefs',       bg: 'bg-blue-600' },
              { icon: '✍️', label: 'Agent 3', note: 'drafts',       bg: 'bg-[#1d4ed8]' },
              { icon: '⚖️', label: 'Agent 4', note: 'compliance',   bg: 'bg-purple-700' },
              { icon: '⚙️', label: 'Agent 5', note: 'technical',    bg: 'bg-teal-700' },
              { icon: '📡', label: 'Agent 6', note: 'earned media', bg: 'bg-amber-600' },
              { icon: '🔄', label: 'Agent 7', note: 'freshness',    bg: 'bg-emerald-700' },
              { icon: '📊', label: 'Agent 8', note: 'AEO tracking', bg: 'bg-[#1e3a5f]', active: true },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-medium ${step.bg} ${(step as { active?: boolean }).active ? 'ring-2 ring-blue-300' : ''}`}>
                  <span>{step.icon}</span> {step.label}
                  <span className="text-white/50">{step.note}</span>
                </div>
                {i < arr.length - 1 && <span className="text-gray-300">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
