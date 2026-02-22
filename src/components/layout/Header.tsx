'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Download, FileSpreadsheet, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { SyncIndicator } from '@/components/ui/sync-indicator'
import { useAuth } from '@/hooks/use-auth'
import {
  downloadInterviewPDF,
  downloadInterviewPreviewCSV,
} from '@/lib/export'
import { cn } from '@/lib/utils'
import { useInterviewStore } from '@/stores/interview-store'

const NAV_ITEMS = [
  { href: '/', label: 'Bearbeiten' },
  { href: '/conduct', label: 'Durchführung' },
  { href: '/preview', label: 'Vorschau' },
  { href: '/insights', label: 'Auswertung' },
  { href: '/interviews', label: 'Interviews' },
] as const

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  const activeInterviewId = useInterviewStore((state) => state.activeInterviewId)
  const activeInterviewName = useInterviewStore((state) => {
    const active = state.interviews.find((i) => i.id === state.activeInterviewId)
    return active?.name ?? 'Unbenanntes Interview'
  })
  const interviews = useInterviewStore((state) => state.interviews)
  const interviewOptions = useMemo(
    () => interviews.map((i) => ({ id: i.id, name: i.name })),
    [interviews],
  )
  const getActiveInterview = useInterviewStore((state) => state.getActiveInterview)
  const setActiveInterview = useInterviewStore((state) => state.setActiveInterview)
  const createInterview = useInterviewStore((state) => state.createInterview)

  const isInterviewsRoute = pathname === '/interviews'

  const shortName = useMemo(() => {
    if (activeInterviewName.length <= 42) return activeInterviewName
    return `${activeInterviewName.slice(0, 39)}...`
  }, [activeInterviewName])

  return (
    <header className="sticky top-0 z-40 border-b border-terrazzo-grey bg-studio-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 md:px-8">
        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
            className="flex items-center gap-2 md:hidden"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="text-lg font-semibold tracking-tight text-carbon-black">
              Interviewleitfaden
            </span>
          </button>

          <Link href="/" className="hidden text-lg font-semibold tracking-tight text-carbon-black md:block">
            Interviewleitfaden
          </Link>

          <nav className="hidden shrink-0 items-center gap-1 rounded-card border border-terrazzo-grey bg-terrazzo-grey/20 p-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap rounded-button px-3 py-1.5 text-sm font-medium',
                  pathname === item.href
                    ? 'bg-botanical-green text-studio-white'
                    : 'text-carbon-black/70 hover:bg-studio-white',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          {!isInterviewsRoute ? (
            <>
              <Select
                value={activeInterviewId}
                onChange={(event) => {
                  setActiveInterview(event.target.value)
                  router.push('/')
                }}
                className="hidden min-w-[190px] max-w-[260px] md:block"
              >
                {interviewOptions.map((interview) => (
                  <option key={interview.id} value={interview.id}>
                    {interview.name}
                  </option>
                ))}
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  createInterview('Neues Interview')
                  router.push('/')
                }}
              >
                Neu
              </Button>

              <Button
                variant="outline"
                className="hidden sm:inline-flex"
                aria-label="PDF exportieren"
                onClick={() => { const i = getActiveInterview(); if (i) downloadInterviewPDF(i); }}
              >
                <Download className="size-4" />
                PDF
              </Button>

              <Button
                variant="outline"
                className="hidden sm:inline-flex"
                aria-label="CSV exportieren"
                onClick={() => { const i = getActiveInterview(); if (i) downloadInterviewPreviewCSV(i); }}
              >
                <FileSpreadsheet className="size-4" />
                CSV
              </Button>
            </>
          ) : (
            <p className="truncate text-sm text-carbon-black/60">Aktiv: {shortName}</p>
          )}

          {/* Auth section */}
          {user && (
            <div className="hidden items-center gap-2 border-l border-terrazzo-grey pl-2 sm:flex">
              <SyncIndicator />
              <span className="max-w-[140px] truncate text-xs text-carbon-black/50">{user.email}</span>
              <button
                type="button"
                onClick={() => signOut()}
                aria-label="Abmelden"
                className="rounded p-2 text-carbon-black/40 hover:text-carbon-black/70 transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <nav className="border-t border-terrazzo-grey bg-studio-white px-4 py-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block rounded-button px-3 py-2.5 text-sm font-medium',
                pathname === item.href
                  ? 'bg-botanical-green/10 text-botanical-green'
                  : 'text-carbon-black/70 hover:bg-terrazzo-grey/30',
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile export buttons */}
          {!isInterviewsRoute && (
            <div className="mt-2 flex gap-2 border-t border-terrazzo-grey pt-2">
              <Button
                variant="outline"
                size="sm"
                aria-label="PDF exportieren"
                onClick={() => {
                  const i = getActiveInterview(); if (i) downloadInterviewPDF(i)
                  setMobileMenuOpen(false)
                }}
              >
                <Download className="size-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                aria-label="CSV exportieren"
                onClick={() => {
                  { const i = getActiveInterview(); if (i) downloadInterviewPreviewCSV(i); }
                  setMobileMenuOpen(false)
                }}
              >
                <FileSpreadsheet className="size-4" />
                CSV
              </Button>
            </div>
          )}

          {/* Mobile auth section */}
          {user && (
            <div className="mt-2 flex items-center gap-2 border-t border-terrazzo-grey pt-2">
              <SyncIndicator />
              <span className="flex-1 truncate text-xs text-carbon-black/50">{user.email}</span>
              <button
                type="button"
                onClick={() => {
                  signOut()
                  setMobileMenuOpen(false)
                }}
                aria-label="Abmelden"
                className="inline-flex items-center gap-1 rounded p-2 text-xs text-carbon-black/60 hover:text-carbon-black/80"
              >
                <LogOut className="size-4" />
                Abmelden
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}
