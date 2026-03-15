'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="w-full bg-white border-b border-orange-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <Link href="/" className="text-xl font-bold text-orange-600">
          CRIO
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/parcours" className="text-sm text-orange-800 hover:text-orange-600 transition">
            Parcours
          </Link>
          <Link href="/bourses" className="text-sm text-orange-800 hover:text-orange-600 transition">
            Bourses
          </Link>
          <Link href="/alumni" className="text-sm text-orange-800 hover:text-orange-600 transition">
            Alumni
          </Link>
          <Link href="/pont" className="text-sm text-orange-800 hover:text-orange-600 transition">
            Tes maths valent de l or
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-orange-100 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/profil" className="text-sm text-orange-800 hover:text-orange-600">
                {profile?.full_name?.split(' ')[0] ?? 'Mon espace'}
              </Link>
              <Link
                href="/dashboard"
                className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1.5 rounded-lg transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg transition"
              >
                Deconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/connexion"
                className="text-sm text-orange-800 hover:text-orange-600 transition"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="text-sm bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg transition"
              >
                S inscrire
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}