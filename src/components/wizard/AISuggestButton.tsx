'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface AISuggestButtonProps<T> {
  label: string
  onSuggest: () => Promise<T>
  onApply: (payload: T) => void
}

export function AISuggestButton<T>({ label, onSuggest, onApply }: AISuggestButtonProps<T>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          setLoading(true)
          setError(null)
          try {
            const suggestion = await onSuggest()
            onApply(suggestion)
          } catch (suggestionError) {
            const message =
              suggestionError instanceof Error ? suggestionError.message : 'KI-Vorschlag konnte nicht geladen werden.'
            setError(message)
          } finally {
            setLoading(false)
          }
        }}
        disabled={loading}
      >
        {loading ? 'Analysiere...' : label}
      </Button>
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  )
}
