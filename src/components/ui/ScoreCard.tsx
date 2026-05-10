'use client'
import { pct } from '@/lib/utils'
import type { AEOPlatformScore } from '@/types'
import { platformColors } from '@/data/aeoScores'

const metrics = [
  { key: 'brandRecognition' as const,  maxKey: 'brandRecognitionMax' as const,  label: 'Brand Recognition' },
  { key: 'marketScore' as const,       maxKey: 'marketScoreMax' as const,        label: 'Market Score' },
  { key: 'presenceQuality' as const,   maxKey: 'presenceQualityMax' as const,    label: 'Presence Quality' },
  { key: 'brandSentiment' as const,    maxKey: 'brandSentimentMax' as const,     label: 'Brand Sentiment' },
  { key: 'shareOfVoice' as const,      maxKey: 'shareOfVoiceMax' as const,       label: 'Share of Voice' },
]

function ProgressBar({ value, max, barClass }: { value: number; max: number; barClass: string }) {
  const width = pct(value, max)
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className={`${barClass} h-2 rounded-full transition-all`} style={{ width: `${width}%` }} />
    </div>
  )
}

export function ScoreCard({ score }: { score: AEOPlatformScore }) {
  const c = platformColors[score.platform]
  const overallPct = pct(score.overall, score.maxOverall)

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5 flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={`font-bold text-base ${c.text}`}>{score.platform}</div>
          <div className="text-xs text-gray-500">HubSpot AEO Grader</div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${c.text}`}>{score.overall}</div>
          <div className="text-xs text-gray-400">/ 100</div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${c.bar} h-3 rounded-full`}
          style={{ width: `${overallPct}%` }}
        />
      </div>

      <div className="space-y-2.5">
        {metrics.map((m) => {
          const val = score[m.key]
          const max = score[m.maxKey]
          return (
            <div key={m.key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{m.label}</span>
                <span className="font-semibold text-gray-700">{val} / {max}</span>
              </div>
              <ProgressBar value={val} max={max} barClass={c.bar} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
