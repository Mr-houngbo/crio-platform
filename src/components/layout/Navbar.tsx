'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleLinkClick = () => setMobileMenuOpen(false)

  return (
    <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-orange-100 px-4 md:px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <Link href="/" className="flex items-center">
          <img src="/logo.svg" alt="CRIO" className="h-9 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/parcours" className="text-sm font-medium text-orange-800 hover:text-orange-600 transition-colors duration-200">
            Parcours
          </Link>
          <Link href="/bourses" className="text-sm font-medium text-orange-800 hover:text-orange-600 transition-colors duration-200">
            Bourses
          </Link>
          <Link href="/alumni" className="text-sm font-medium text-orange-800 hover:text-orange-600 transition-colors duration-200">
            Alumni
          </Link>
          <Link href="/pont" className="text-sm font-medium text-orange-800 hover:text-orange-600 transition-colors duration-200">
            Tes maths valent de l or
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-8 rounded-lg bg-orange-100 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/profil" className="text-sm font-medium text-orange-800 hover:text-orange-600 transition-colors duration-200">
                {profile?.full_name?.split(' ')[0] ?? 'Mon espace'}
              </Link>
              <Link href="/dashboard" className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                Dashboard
              </Link>
              <button onClick={handleSignOut} className="text-sm bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                Deconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/connexion" className="text-sm font-medium text-orange-800 hover:text-orange-600 transition-colors duration-200">
                Connexion
              </Link>
              <Link href="/inscription" className="text-sm bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                S inscrire
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-orange-800 transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-orange-800 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-orange-800 transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-orange-100 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-1">
            {[
              { href: '/parcours', label: 'Parcours' },
              { href: '/bourses', label: 'Bourses' },
              { href: '/alumni', label: 'Alumni' },
              { href: '/pont', label: 'Tes maths valent de l or' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={handleLinkClick}
                className="flex items-center px-4 py-3 text-base font-medium text-orange-800 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors duration-200">
                {label}
              </Link>
            ))}

            <div className="border-t border-orange-100 pt-4 mt-4 space-y-2">
              {loading ? (
                <div className="w-full h-10 rounded-xl bg-orange-100 animate-pulse" />
              ) : user ? (
                <>
                  <Link href="/profil" onClick={handleLinkClick}
                    className="flex items-center px-4 py-3 text-base font-medium text-orange-800 hover:bg-orange-50 rounded-xl transition-colors duration-200">
                    {profile?.full_name?.split(' ')[0] ?? 'Mon espace'}
                  </Link>
                  <Link href="/dashboard" onClick={handleLinkClick}
                    className="flex items-center justify-center px-4 py-3 text-base font-medium bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-xl transition-colors duration-200">
                    Dashboard
                  </Link>
                  <button onClick={() => { handleSignOut(); handleLinkClick() }}
                    className="w-full px-4 py-3 text-base font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors duration-200">
                    Deconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/connexion" onClick={handleLinkClick}
                    className="flex items-center justify-center px-4 py-3 text-base font-medium text-orange-800 hover:bg-orange-50 rounded-xl transition-colors duration-200">
                    Connexion
                  </Link>
                  <Link href="/inscription" onClick={handleLinkClick}
                    className="flex items-center justify-center px-4 py-3 text-base font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors duration-200">
                    S inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}