import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center bg-studio-white">
      <div className="rounded-card border border-terrazzo-grey bg-studio-white p-8 max-w-md w-full shadow-level1">
        <p className="text-6xl font-bold text-carbon-black/10 mb-4">404</p>
        <h2 className="type-h3 text-carbon-black mb-2">Seite nicht gefunden</h2>
        <p className="type-body text-carbon-black/60 mb-6">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/interviews"
          className="inline-block rounded-button bg-botanical-green px-6 py-2.5 text-sm font-medium text-studio-white hover:bg-botanical-green/90 transition-colors"
        >
          Zur Interview-Übersicht
        </Link>
      </div>
    </div>
  )
}
