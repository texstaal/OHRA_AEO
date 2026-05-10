'use client'
import { badgeClasses } from '@/lib/utils'
import type { BadgeVariant } from '@/types'

interface Props {
  label: string
  variant: BadgeVariant
  size?: 'sm' | 'md'
}

export function StatusBadge({ label, variant, size = 'md' }: Props) {
  const base = 'inline-flex items-center font-medium border rounded-full'
  const sizes = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
  return (
    <span className={`${base} ${sizes} ${badgeClasses(variant)}`}>
      {label}
    </span>
  )
}
