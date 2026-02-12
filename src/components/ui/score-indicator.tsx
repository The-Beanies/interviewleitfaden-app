'use client'

import { cn } from '@/lib/utils'

interface ScoreIndicatorProps {
  label: string
  value: number
  max?: number
  className?: string
}

function getScoreColor(value: number, max: number): string {
  const ratio = value / max
  if (ratio >= 0.7) return 'bg-botanical-green'
  if (ratio >= 0.4) return 'bg-warning'
  return 'bg-error'
}

function getScoreTextColor(value: number, max: number): string {
  const ratio = value / max
  if (ratio >= 0.7) return 'text-botanical-green'
  if (ratio >= 0.4) return 'text-warning'
  return 'text-error'
}

export function ScoreIndicator({ label, value, max = 5, className }: ScoreIndicatorProps) {
  const normalized = Math.round(Math.max(0, Math.min(max, value)) * 10) / 10
  const percentage = (normalized / max) * 100

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-carbon-black/70">{label}</span>
        <span className={cn('font-semibold', getScoreTextColor(normalized, max))}>
          {normalized}/{max}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-terrazzo-grey">
        <div
          className={cn('h-full rounded-full transition-all', getScoreColor(normalized, max))}
          style={{ width: `${Math.max(percentage, normalized > 0 ? 2 : 0)}%` }}
        />
      </div>
    </div>
  )
}
