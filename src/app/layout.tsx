import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

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
      <body className="bg-orange-50 min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}