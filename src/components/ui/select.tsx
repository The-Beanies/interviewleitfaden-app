'use client'

import type { SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-button border border-terrazzo-grey bg-studio-white px-3 text-sm text-carbon-black focus:border-botanical-green focus:outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
