'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function DashboardPage() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-orange-100 rounded w-1/3" />
          <div className="h-4 bg-orange-50 rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-orange-900 mb-1">
          Bonjour, {profile?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-orange-700">
          {profile?.filiere} • {profile?.niveau} • FAST UAC
        </p>
      </div>

      {/* Cards rapides */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-2xl p-6 border border-orange-100">
          <div className="text-2xl font-bold text-orange-600 mb-1">0</div>
          <div className="text-sm text-orange-700">Leçons complétées</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-orange-100">
          <div className="text-2xl font-bold text-orange-600 mb-1">0</div>
          <div className="text-sm text-orange-700">Parcours en cours</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-orange-100">
          <div className="text-2xl font-bold text-orange-600 mb-1">0</div>
          <div className="text-sm text-orange-700">Bourses suivies</div>
        </div>
      </div>

      {/* Parcours disponibles */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-orange-900 mb-4">Commence un parcours</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/parcours/web-full-stack" className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition group">
            <div className="text-2xl mb-3">🌐</div>
            <h3 className="font-semibold text-orange-900 mb-1 group-hover:text-orange-600 transition">
              Développement Web Full Stack
            </h3>
            <p className="text-sm text-orange-600">12 semaines • Débutant</p>
          </Link>
          <Link href="/parcours/data-science" className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition group">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-orange-900 mb-1 group-hover:text-orange-600 transition">
              Data Science & IA
            </h3>
            <p className="text-sm text-orange-600">14 semaines • Intermédiaire</p>
          </Link>
        </div>
      </div>

      {/* Bourses à venir */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-orange-900">Bourses à ne pas manquer</h2>
          <Link href="/bourses" className="text-sm text-orange-600 hover:underline">
            Voir toutes →
          </Link>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-orange-100 text-center">
          <p className="text-orange-600 text-sm">
            Les bourses arrivent bientôt. Active les alertes pour ne rien manquer.
          </p>
          <Link
            href="/bourses"
            className="inline-block mt-3 text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            Explorer les bourses
          </Link>
        </div>
      </div>

    </div>
  )
}