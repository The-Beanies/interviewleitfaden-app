"use client"

import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  'aria-label'?: string
}

export function Progress({ value, className, 'aria-label': ariaLabel = 'Fortschritt' }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-terrazzo-grey', className)}
    >
      <div
        className="h-full rounded-full bg-botanical-green transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
