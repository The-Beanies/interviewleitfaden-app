'use client'

import type { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon-black/40 p-4">
      <div className="w-full max-w-lg rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="type-h4 text-carbon-black">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-button px-2 py-1 text-sm text-carbon-black/60 hover:bg-terrazzo-grey/30"
            aria-label="Schliessen"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3">{children}</div>
        {footer ? <div className="mt-4 border-t border-terrazzo-grey pt-3">{footer}</div> : null}
      </div>
    </div>
  )
}
