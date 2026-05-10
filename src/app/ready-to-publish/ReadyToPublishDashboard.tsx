'use client'
import { useState, useEffect } from 'react'
import { FinalDraftPanel } from '@/components/agent3/FinalDraftPanel'
import type { FinalDraft } from '@/types/finalDraft'

const LS_PUBLISH = 'agent5_ready_to_publish'

export function ReadyToPublishDashboard() {
  const [drafts, setDrafts] = useState<Record<string, FinalDraft>>({})
  const [active, setActive] = useState<FinalDraft | null>(null)

  useEffect(() => {
    try {
      const pub = localStorage.getItem(LS_PUBLISH)
      if (pub) setDrafts(JSON.parse(pub))
    } catch { /* ignore */ }
  }, [])

  const list = Object.values(drafts)

  if (active) {
    return <FinalDraftPanel finalDraft={active} onClose={() => setActive(null)} />
  }

  return (
    <div className="max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">✅</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ready to Publish</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Articles that have cleared the full pipeline — Agent 3 draft, Agent 4 compliance, Agent 5 technical GEO — and are ready for the OHRA publishing team.
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-semibold">
            {list.length} article{list.length !== 1 ? 's' : ''} ready
          </span>
        </div>
      </div>

      {/* Full pipeline strip */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Full pipeline</div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { icon: '🔍', label: 'Agent 1', note: 'discovers', bg: 'bg-[#1e3a5f]' },
            { icon: '📄', label: 'Agent 2', note: 'briefs',    bg: 'bg-blue-600' },
            { icon: '✍️', label: 'Agent 3', note: 'drafts',    bg: 'bg-[#1d4ed8]' },
            { icon: '⚖️', label: 'Agent 4', note: 'compliance', bg: 'bg-orange-500' },
            { icon: '⚙️', label: 'Agent 5', note: 'technical', bg: 'bg-violet-700' },
            { icon: '✅', label: 'Publish',  note: 'ready',    bg: 'bg-green-600', active: true },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-medium ${step.bg} ${(step as { active?: boolean }).active ? 'ring-2 ring-green-400' : ''}`}>
                <span>{step.icon}</span> {step.label}
                <span className="text-white/50">{step.note}</span>
              </div>
              {i < arr.length - 1 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {list.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-base font-bold text-gray-700 mb-2">No articles ready yet</h2>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
            Articles appear here after being approved in Agent 5. Start by generating a draft in Agent 3, then move it through Agent 4 and Agent 5.
          </p>
          <div className="flex justify-center gap-3">
            <a href="/agents/draft-writing" className="px-4 py-2 bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors">
              Start in Agent 3 →
            </a>
            <a href="/agents/compliance" className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors">
              Go to Agent 4 →
            </a>
          </div>
        </div>
      )}

      {/* Articles grid */}
      {list.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map(fd => (
            <div key={fd.opportunityId} className="bg-white rounded-xl border-2 border-green-200 shadow-sm p-5 flex flex-col gap-4">
              <div>
                <div className="text-xs font-semibold text-green-600 flex items-center gap-1 mb-2">
                  <span>✅</span> Pipeline complete — ready to publish
                </div>
                <div className="font-bold text-gray-900 text-sm leading-snug mb-1">{fd.processedDraft.h1}</div>
                <div className="text-xs text-gray-400">
                  Approved {new Date(fd.processedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="flex gap-2 text-xs">
                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-gray-700">{fd.complianceFixes.length}</div>
                  <div className="text-gray-400">fixes</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                  <div className={`font-bold ${fd.techScore >= 75 ? 'text-green-600' : 'text-orange-500'}`}>{fd.techScore}</div>
                  <div className="text-gray-400">GEO score</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                  <div className={`font-bold ${fd.placeholderCount === 0 ? 'text-green-600' : 'text-amber-500'}`}>{fd.placeholderCount}</div>
                  <div className="text-gray-400">placeholders</div>
                </div>
              </div>

              <div className="text-xs text-gray-400 font-mono bg-gray-50 rounded px-2 py-1 truncate">
                /{fd.slug}
              </div>

              <button
                onClick={() => setActive(fd)}
                className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                View Final Article →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
