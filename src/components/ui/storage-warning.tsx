'use client'

import { useEffect, useState } from 'react'

/**
 * Shows a warning banner when localStorage is nearly full (> 4 MB used).
 * localStorage typically has a 5 MB limit per origin.
 */
export default function StorageWarning() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      let total = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          total += (localStorage.getItem(key) ?? '').length
        }
      }
      // Warn when usage exceeds ~4 MB (characters ~ bytes for ASCII/latin)
      if (total > 4 * 1024 * 1024) {
        setShow(true)
      }
    } catch {
      // localStorage not available
    }
  }, [])

  if (!show) return null

  return (
    <div
      role="alert"
      className="fixed top-0 left-0 right-0 z-[90] bg-warning/90 text-carbon-black px-4 py-2 text-center type-small"
    >
      Speicherplatz fast voll. Bitte exportiere oder lösche ältere Interviews, um Datenverlust zu
      vermeiden.
      <button
        onClick={() => setShow(false)}
        className="ml-3 underline hover:no-underline"
        aria-label="Warnung schließen"
      >
        Schließen
      </button>
    </div>
  )
}
