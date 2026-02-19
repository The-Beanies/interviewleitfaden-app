'use client'

import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  name: string
  options: RadioOption[]
  className?: string
  renderSuffix?: (value: string) => ReactNode
}

export function RadioGroup({
  value,
  onValueChange,
  name,
  options,
  className,
  renderSuffix,
}: RadioGroupProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      {options.map((option) => {
        const id = `${name}-${option.value}`
        const checked = value === option.value

        return (
          <label
            key={option.value}
            htmlFor={id}
            className={cn(
              'flex cursor-pointer items-start gap-2 rounded-card border p-3',
              checked ? 'border-botanical-green bg-botanical-green/5' : 'border-terrazzo-grey bg-studio-white',
            )}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onValueChange(option.value)}
              className="mt-0.5 size-4 accent-botanical-green"
            />
            <span className="flex-1">
              <span className="block text-sm font-medium text-carbon-black">{option.label}</span>
              {option.description ? (
                <span className="block text-xs text-carbon-black/60">{option.description}</span>
              ) : null}
            </span>
            {renderSuffix ? renderSuffix(option.value) : null}
          </label>
        )
      })}
    </div>
  )
}
