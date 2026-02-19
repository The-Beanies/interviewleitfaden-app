"use client"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-card border border-error/20 bg-error/5 p-8 max-w-md w-full">
        <h2 className="type-h3 text-carbon-black mb-2">Etwas ist schiefgelaufen</h2>
        <p className="type-body text-carbon-black/60 mb-6">
          {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
        </p>
        <button
          onClick={reset}
          className="rounded-button bg-botanical-green px-6 py-2.5 text-sm font-medium text-studio-white hover:bg-botanical-green/90 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  )
}
