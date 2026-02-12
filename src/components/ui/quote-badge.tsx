'use client'

import { cn } from '@/lib/utils'

interface QuoteBadgeProps {
  verbatim?: boolean
  className?: string
}

export function QuoteBadge({ verbatim = true, className }: QuoteBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        verbatim ? 'bg-botanical-green/15 text-botanical-green' : 'bg-terrazzo-grey text-carbon-black/70',
        className,
      )}
    >
      {verbatim ? 'Wörtlich' : 'Paraphrase'}
    </span>
  )
}
