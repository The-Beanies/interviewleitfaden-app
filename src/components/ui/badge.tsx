"use client"

import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-terrazzo-grey/30 px-2 py-1 text-xs font-medium text-carbon-black/70',
        className,
      )}
      {...props}
    />
  )
}
