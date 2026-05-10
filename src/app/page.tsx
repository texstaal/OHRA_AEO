import { kpis } from '@/data/kpis'
import { aeoScores } from '@/data/aeoScores'
import { pipelineSteps } from '@/data/pipeline'
import { agents, layers } from '@/data/agents'
import { KPICard } from '@/components/ui/KPICard'
import { ScoreCard } from '@/components/ui/ScoreCard'
import { AEOScoreSection } from '@/components/ui/AEOScoreSection'
import { PipelineStepCard } from '@/components/ui/PipelineStep'
import { AgentCard } from '@/components/ui/AgentCard'
import { LayerSection } from '@/components/ui/LayerSection'

export default function OverviewPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">

      {/* KPI Cards */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Live KPIs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KPICard key={kpi.label} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* GEO Scores — live from Agent 8 localStorage */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            GEO Score Overview — HubSpot GEO Grader
          </h2>
          <span className="text-xs text-gray-400">Tracked weekly via Agent 8</span>
        </div>
        <AEOScoreSection />
      </section>

      {/* AI Platform Scores */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            AI Platform Visibility — Manual Spot-check
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aeoScores.map((score) => (
            <ScoreCard key={score.platform} score={score} />
          ))}
        </div>
      </section>

      {/* Content Pipeline */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Content Pipeline — Current Status
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-wrap items-start gap-0 overflow-x-auto pb-2">
            {pipelineSteps.map((step, i) => (
              <PipelineStepCard
                key={step.id}
                step={step}
                isLast={i === pipelineSteps.length - 1}
              />
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-2">
            <span className="text-amber-500">👤</span>
            <span className="text-xs text-gray-500">
              Human approval required at every gate — publishing is always human approved.
            </span>
          </div>
        </div>
      </section>

      {/* Three-Layer Architecture */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Three-Layer Architecture
        </h2>
        <div className="space-y-4">
          {layers.map((layer) => (
            <LayerSection
              key={layer.id}
              layer={layer}
              agents={agents.filter((a) => layer.agentIds.includes(a.id))}
            />
          ))}
        </div>
      </section>

      {/* Feedback Loop */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Continuous Feedback Loop
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { icon: '📈', label: 'Performance Data', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { icon: '🔍', label: 'Market Trends',    color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
              { icon: '📊', label: 'GEO Insights',     color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { icon: '🤝', label: 'Earned Media Data', color: 'bg-green-50 border-green-200 text-green-700' },
            ].map((item) => (
              <div key={item.label} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${item.color}`}>
                <span>{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            ))}
            <div className="flex items-center text-gray-400 text-lg">↓</div>
          </div>
          <div className="flex justify-center mt-3">
            <div className="bg-[#1e3a5f] text-white rounded-xl px-6 py-3 text-sm font-semibold flex items-center gap-2">
              <span>🔍</span>
              Agent 1 — Trend Discovery
              <span className="text-white/60 font-normal">→ new opportunities detected</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4 max-w-xl mx-auto">
            Insights, performance data, and market trends feed back into Agent 1 to discover new opportunities
            and continuously improve OHRA&apos;s visibility in AI search results.
          </p>
        </div>
      </section>

      {/* All Agents Grid */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          All Agents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

    </div>
  )
}
