'use client'
import type { AgentDefinition } from '@/types'
import { StatusBadge } from './StatusBadge'

const layerColors: Record<1 | 2 | 3, string> = {
  1: 'bg-blue-50 border-blue-200 text-blue-700',
  2: 'bg-green-50 border-green-200 text-green-700',
  3: 'bg-purple-50 border-purple-200 text-purple-700',
}

const layerNames: Record<1 | 2 | 3, string> = {
  1: 'Layer 1 — Content Generation (The Factory)',
  2: 'Layer 2 — Earned Media (The Trust Builder)',
  3: 'Layer 3 — Freshness & Tracking (The Guard)',
}

export function AgentPlaceholder({ agent }: { agent: AgentDefinition }) {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Agent header */}
      <div
        className="rounded-xl p-6 text-white"
        style={{ backgroundColor: agent.color }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-white/60 text-sm font-semibold uppercase tracking-wide mb-1">
              {agent.tagline}
            </div>
            <h1 className="text-2xl font-bold">{agent.name}</h1>
            <p className="mt-2 text-white/80 text-sm leading-relaxed max-w-lg">
              {agent.description}
            </p>
          </div>
          <StatusBadge
            label={agent.status === 'active' ? 'Active' : agent.status === 'review' ? 'In Review' : 'Idle'}
            variant={agent.status === 'active' ? 'success' : agent.status === 'review' ? 'warning' : 'neutral'}
          />
        </div>
        <div className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${layerColors[agent.layer]}`}>
          {layerNames[agent.layer]}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📥</span>
          <h2 className="font-bold text-gray-800">Input</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{agent.inputLabel}</p>
        <div className="mt-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 p-4 flex items-center justify-center">
          <span className="text-xs text-gray-400">Input interface will appear here when Agent {agent.id} is fully built.</span>
        </div>
      </div>

      {/* Output */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📤</span>
          <h2 className="font-bold text-gray-800">Output</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{agent.outputLabel}</p>
        <div className="mt-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 p-4 flex items-center justify-center">
          <span className="text-xs text-gray-400">Output results will appear here when Agent {agent.id} is fully built.</span>
        </div>
      </div>

      {/* Human review */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">👤</span>
          <h2 className="font-bold text-amber-800">Human Review Gate</h2>
        </div>
        <p className="text-sm text-amber-700 leading-relaxed">{agent.humanReviewLabel}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            disabled
            className="px-4 py-2 bg-amber-200 text-amber-500 rounded-lg text-xs font-semibold cursor-not-allowed"
          >
            Approve →
          </button>
          <button
            disabled
            className="px-4 py-2 bg-white border border-amber-200 text-amber-500 rounded-lg text-xs font-semibold cursor-not-allowed"
          >
            Request Changes
          </button>
          <span className="text-xs text-amber-500">Active when agent output is ready.</span>
        </div>
      </div>

      {/* Coming next */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🚧</span>
          <h2 className="font-bold text-gray-800">Coming Next</h2>
        </div>
        <p className="text-sm text-gray-500">{agent.comingNext}</p>
      </div>
    </div>
  )
}
