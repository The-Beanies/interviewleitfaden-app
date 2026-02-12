'use client'

import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-carbon-black/80" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={cn(
          'size-4 rounded border border-terrazzo-grey accent-botanical-green focus:outline-none focus:ring-2 focus:ring-botanical-green/30',
          className,
        )}
        {...props}
      />
      {label ? <span>{label}</span> : null}
    </label>
  )
}
