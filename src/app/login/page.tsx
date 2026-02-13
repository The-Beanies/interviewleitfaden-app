'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) {
          setError(signUpError.message)
          return
        }
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })
        if (signInError) {
          setError(signInError.message)
          return
        }
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-studio-white px-4">
      <div className="w-full max-w-md rounded-card border border-terrazzo-grey bg-studio-white p-8 shadow-level2">
        <h1 className="type-h3 mb-2 text-center text-carbon-black">
          Interviewleitfaden
        </h1>
        <p className="mb-8 text-center text-sm text-carbon-black/60">
          {isSignUp
            ? 'Erstelle einen Account, um deine Interviews zu sichern.'
            : 'Melde dich an, um deine Interviews zu verwalten.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-carbon-black"
            >
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full rounded-button border border-terrazzo-grey bg-studio-white px-3 py-2 text-sm text-carbon-black placeholder:text-carbon-black/40 focus:border-botanical-green focus:outline-none focus:ring-2 focus:ring-botanical-green/30"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-carbon-black"
            >
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              required
              minLength={6}
              className="w-full rounded-button border border-terrazzo-grey bg-studio-white px-3 py-2 text-sm text-carbon-black placeholder:text-carbon-black/40 focus:border-botanical-green focus:outline-none focus:ring-2 focus:ring-botanical-green/30"
            />
          </div>

          {error && (
            <p className="rounded-button bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-button bg-botanical-green px-4 py-2.5 text-sm font-semibold text-studio-white transition-colors hover:bg-botanical-green/90 disabled:opacity-50"
          >
            {loading
              ? 'Wird geladen...'
              : isSignUp
                ? 'Account erstellen'
                : 'Anmelden'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-sm text-botanical-green-text hover:underline"
          >
            {isSignUp
              ? 'Bereits registriert? Anmelden'
              : 'Noch kein Account? Registrieren'}
          </button>
        </div>
      </div>
    </div>
  )
}
