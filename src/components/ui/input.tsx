"use client"

import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-button border border-terrazzo-grey bg-studio-white px-3 text-sm text-carbon-black placeholder:text-carbon-black/40 focus:border-botanical-green focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}
