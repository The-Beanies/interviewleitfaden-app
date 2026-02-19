import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'

import { AuthSync } from '@/components/auth/AuthSync'
import StorageWarning from '@/components/ui/storage-warning'

import './globals.css'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://interview.thebeanies.de'),
  title: 'Interviewleitfaden-App',
  description:
    'Interaktive Discovery-Interview-App für strukturierte Gründergespräche, Zusammenfassungen und Auswertungen.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Interviewleitfaden-App',
    description:
      'Interaktive Discovery-Interview-App für strukturierte Gründergespräche, Zusammenfassungen und Auswertungen.',
    siteName: 'The Beanies',
    locale: 'de_DE',
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-button focus:bg-botanical-green focus:px-4 focus:py-2 focus:text-studio-white focus:shadow-level2"
        >
          Zum Inhalt springen
        </a>
        <AuthSync />
        <StorageWarning />
        {children}
      </body>
    </html>
  )
}
