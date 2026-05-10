import type { BadgeVariant } from '@/types'

export function scoreToVariant(score: number, max: number = 100): BadgeVariant {
  const pct = (score / max) * 100
  if (pct >= 70) return 'success'
  if (pct >= 45) return 'warning'
  return 'error'
}

export function scoreLabel(score: number, max: number = 100): string {
  const pct = (score / max) * 100
  if (pct >= 70) return 'Good'
  if (pct >= 45) return 'Fair'
  return 'Needs work'
}

export function badgeClasses(variant: BadgeVariant): string {
  const map: Record<BadgeVariant, string> = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200',
    error:   'bg-red-100 text-red-700 border-red-200',
    info:    'bg-blue-100 text-blue-700 border-blue-200',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
    purple:  'bg-purple-100 text-purple-700 border-purple-200',
  }
  return map[variant]
}

export function clsx(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function pct(value: number, max: number): number {
  return Math.round((value / max) * 100)
}
