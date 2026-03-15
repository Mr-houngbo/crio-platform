import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CRIO — Plateforme d\'apprentissage',
  description: 'Apprends les métiers du digital, gratuitement.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}