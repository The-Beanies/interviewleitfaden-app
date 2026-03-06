"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="de">
      <body className="bg-studio-white">
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Etwas ist schiefgelaufen</h2>
            <p className="text-sm text-gray-600 mb-6">
              {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
            </p>
            <button
              onClick={reset}
              className="rounded-lg bg-green-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-800 transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
