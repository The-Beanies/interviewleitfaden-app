import type { ReactNode } from 'react'

interface SectionWrapperProps {
  id?: string
  title: string
  subtitle?: string
  children: ReactNode
}

export function SectionWrapper({ id, title, subtitle, children }: SectionWrapperProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <div className="rounded-card border border-terrazzo-grey bg-studio-white p-5 shadow-level1 md:p-6">
        <header className="mb-4 border-b border-terrazzo-grey pb-3">
          <h2 className="type-h3 text-carbon-black">{title}</h2>
          {subtitle ? <p className="mt-1 type-body text-carbon-black/60">{subtitle}</p> : null}
        </header>
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  )
}
