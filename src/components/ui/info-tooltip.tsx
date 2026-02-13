'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'

interface InfoTooltipProps {
  text: string
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="Info"
        className="rounded p-1 text-carbon-black/40 hover:text-carbon-black/70 transition-colors"
      >
        <HelpCircle className="size-4" />
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-card border border-terrazzo-grey bg-studio-white px-3 py-2 text-xs text-carbon-black/80 shadow-level2">
          {text}
        </span>
      )}
    </span>
  )
}
