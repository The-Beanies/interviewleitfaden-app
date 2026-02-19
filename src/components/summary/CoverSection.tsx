import type { Interview } from '@/types'
import { statusLabel } from '@/lib/labels'

export function CoverSection({ interview }: { interview: Interview }) {
  return (
    <section id="cover" className="mx-auto flex min-h-[40vh] w-full max-w-5xl flex-col justify-center px-4 py-10 md:px-8">
      <p className="type-small uppercase tracking-wide text-carbon-black/50">Discovery-Interview</p>
      <h1 className="type-display mt-3 text-carbon-black">{interview.name}</h1>
      <div className="mt-4 space-y-1 type-body text-carbon-black/70">
        <p>Status: {statusLabel(interview.status)}</p>
        <p>Erstellt: {new Date(interview.createdAt).toLocaleString('de-DE')}</p>
        <p>Aktualisiert: {new Date(interview.updatedAt).toLocaleString('de-DE')}</p>
      </div>
    </section>
  )
}
