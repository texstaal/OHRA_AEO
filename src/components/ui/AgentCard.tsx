'use client'
import Link from 'next/link'
import type { AgentDefinition } from '@/types'
import { StatusBadge } from './StatusBadge'
import type { BadgeVariant } from '@/types'

const statusVariant: Record<AgentDefinition['status'], BadgeVariant> = {
  active:       'success',
  idle:         'neutral',
  review:       'warning',
  'coming-soon': 'purple',
}

const statusLabel: Record<AgentDefinition['status'], string> = {
  active:       'Active',
  idle:         'Idle',
  review:       'In Review',
  'coming-soon': 'Coming Soon',
}

export function AgentCard({ agent }: { agent: AgentDefinition }) {
  return (
    <Link href={`/agents/${agent.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 border-l-4 hover:shadow-md transition-shadow h-full"
           style={{ borderLeftColor: agent.color }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
              {agent.tagline}
            </div>
            <div className="font-bold text-gray-900 text-base group-hover:text-[#1e3a5f] transition-colors">
              {agent.name}
            </div>
          </div>
          <StatusBadge label={statusLabel[agent.status]} variant={statusVariant[agent.status]} size="sm" />
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{agent.description}</p>
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Layer {agent.layer}
          </span>
          <span className="text-xs font-medium text-[#1e3a5f] group-hover:underline">
            View agent →
          </span>
        </div>
      </div>
    </Link>
  )
}
