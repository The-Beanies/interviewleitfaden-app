"use client"

import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-button border border-terrazzo-grey bg-studio-white px-3 py-2 text-sm text-carbon-black placeholder:text-carbon-black/40 focus:border-botanical-green focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}
