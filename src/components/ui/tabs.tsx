"use client"

import { cn } from '@/lib/utils'

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  tabs: Array<{ value: string; label: string }>
  className?: string
}

export function Tabs({ value, onValueChange, tabs, className }: TabsProps) {
  return (
    <div className={cn('inline-flex rounded-card border border-terrazzo-grey bg-studio-white p-1', className)}>
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onValueChange(tab.value)}
            className={cn(
              'rounded-button px-3 py-1.5 text-sm font-medium transition',
              active ? 'bg-botanical-green text-studio-white' : 'text-carbon-black/70 hover:bg-terrazzo-grey/30',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
