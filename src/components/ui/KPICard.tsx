'use client'
import type { KPI } from '@/types'

const colorMap: Record<KPI['color'], { border: string; icon: string; text: string }> = {
  navy:   { border: 'border-[#1e3a5f]', icon: 'bg-[#1e3a5f]', text: 'text-[#1e3a5f]' },
  green:  { border: 'border-green-600',  icon: 'bg-green-600',  text: 'text-green-700' },
  purple: { border: 'border-purple-600', icon: 'bg-purple-600', text: 'text-purple-700' },
  orange: { border: 'border-orange-500', icon: 'bg-orange-500', text: 'text-orange-600' },
  red:    { border: 'border-red-500',    icon: 'bg-red-500',    text: 'text-red-600' },
  blue:   { border: 'border-blue-600',   icon: 'bg-blue-600',   text: 'text-blue-700' },
}

const trendIcon: Record<'up' | 'down' | 'stable', string> = {
  up:     '↑',
  down:   '↓',
  stable: '→',
}

const trendColor: Record<'up' | 'down' | 'stable', string> = {
  up:     'text-green-600',
  down:   'text-red-500',
  stable: 'text-gray-400',
}

export function KPICard({ kpi }: { kpi: KPI }) {
  const c = colorMap[kpi.color]
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 border-l-4 ${c.border} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <span className={`w-9 h-9 rounded-lg ${c.icon} flex items-center justify-center text-lg`}>
          {kpi.icon}
        </span>
        {kpi.trend && (
          <span className={`text-xs font-semibold ${trendColor[kpi.trend]}`}>
            {trendIcon[kpi.trend]} {kpi.trendValue}
          </span>
        )}
      </div>
      <div className={`text-3xl font-bold ${c.text}`}>
        {kpi.value}{kpi.unit && <span className="text-lg font-medium text-gray-400">{kpi.unit}</span>}
      </div>
      <div className="text-sm text-gray-500 mt-1 leading-tight">{kpi.label}</div>
    </div>
  )
}
