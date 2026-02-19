"use client"

import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
}

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-terrazzo-grey', className)}>
      <div
        className="h-full rounded-full bg-botanical-green transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
