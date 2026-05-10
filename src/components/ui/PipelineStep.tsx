'use client'
import type { PipelineStep } from '@/types'

const statusStyles: Record<PipelineStep['status'], string> = {
  done:    'bg-[#1e3a5f] text-white border-[#1e3a5f]',
  active:  'bg-blue-600 text-white border-blue-600',
  pending: 'bg-white text-gray-400 border-gray-200',
}

const statusLabel: Record<PipelineStep['status'], string> = {
  done:    'Done',
  active:  'In Progress',
  pending: 'Pending',
}

export function PipelineStepCard({ step, isLast }: { step: PipelineStep; isLast: boolean }) {
  const s = statusStyles[step.status]
  return (
    <div className="flex items-start gap-0">
      <div className="flex flex-col items-center">
        <div className={`flex flex-col items-center justify-center w-44 rounded-xl border-2 p-3 text-center ${s}`}>
          {step.agentNumber && (
            <span className="text-xs opacity-70 mb-0.5">Agent {step.agentNumber}</span>
          )}
          <span className="text-sm font-semibold leading-tight">{step.label}</span>
          <span className={`mt-1 text-xs rounded-full px-2 py-0.5 ${
            step.status === 'pending' ? 'bg-gray-100 text-gray-400' : 'bg-white/20 text-white'
          }`}>
            {statusLabel[step.status]}
          </span>
        </div>
        {step.humanReview && (
          <div className="mt-2 flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 w-44">
            <span className="text-amber-500 text-xs">👤</span>
            <span className="text-xs text-amber-700 leading-tight">{step.humanReview}</span>
          </div>
        )}
      </div>
      {!isLast && (
        <div className="flex items-center self-start mt-5">
          <div className={`h-0.5 w-6 ${step.status === 'pending' ? 'bg-gray-200' : 'bg-[#1e3a5f]'}`} />
          <span className={`text-lg ${step.status === 'pending' ? 'text-gray-300' : 'text-[#1e3a5f]'}`}>›</span>
        </div>
      )}
    </div>
  )
}
