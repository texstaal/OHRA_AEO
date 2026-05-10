'use client'
import Link from 'next/link'
import type { LayerDefinition, AgentDefinition } from '@/types'
import { StatusBadge } from './StatusBadge'

const layerIcons = ['🏭', '🤝', '🛡️']

export function LayerSection({
  layer,
  agents,
}: {
  layer: LayerDefinition
  agents: AgentDefinition[]
}) {
  return (
    <div className={`rounded-xl border-2 ${layer.borderClass} ${layer.bgClass} p-5`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{layerIcons[layer.id - 1]}</span>
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Layer {layer.id}
          </div>
          <div className="font-bold text-gray-900">
            {layer.name}{' '}
            <span className="font-normal text-gray-500 text-sm">— {layer.subtitle}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.slug}`}
            className="bg-white rounded-lg border border-white/80 shadow-sm p-3 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase">{agent.tagline}</span>
              <StatusBadge
                label={agent.status === 'active' ? 'Active' : agent.status === 'review' ? 'Review' : 'Idle'}
                variant={agent.status === 'active' ? 'success' : agent.status === 'review' ? 'warning' : 'neutral'}
                size="sm"
              />
            </div>
            <div className="font-semibold text-sm text-gray-800 group-hover:text-[#1e3a5f] transition-colors">
              {agent.name}
            </div>
            <div className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">{agent.description}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
