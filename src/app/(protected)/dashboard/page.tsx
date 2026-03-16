import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: progressions } = await supabase
    .from('progression')
    .select('*')
    .eq('user_id', user.id)
    .eq('completee', true)

  const { data: alertes } = await supabase
    .from('alertes_bourses')
    .select('*')
    .eq('user_id', user.id)

  const leconsFaites = progressions?.length ?? 0
  const boursesSuivies = alertes?.length ?? 0

  const prenom = profile?.full_name?.split(' ')[0] ?? 'Etudiant'

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">

      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-900 mb-1">
          Bonjour, {prenom} 👋
        </h1>
        <p className="text-sm md:text-base text-orange-700">
          {profile?.filiere && profile?.niveau
            ? `${profile.filiere} • ${profile.niveau} • FAST UAC`
            : 'FAST UAC'}
        </p>
      </div>

      {/* Stats réelles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-orange-100">
          <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1">{leconsFaites}</div>
          <div className="text-xs md:text-sm text-orange-700">Leçons complétées</div>
          {leconsFaites > 0 && (
            <div className="mt-2 text-xs text-green-600">Continue comme ça !</div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-orange-100">
          <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1">
            {leconsFaites > 0 ? 1 : 0}
          </div>
          <div className="text-xs md:text-sm text-orange-700">Parcours en cours</div>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-orange-100">
          <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1">{boursesSuivies}</div>
          <div className="text-xs md:text-sm text-orange-700">Bourses suivies</div>
        </div>
      </div>

      {/* Parcours */}
      <div className="mb-8 md:mb-10">
        <h2 className="text-lg md:text-xl font-bold text-orange-900 mb-4">Commence un parcours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/parcours/web-full-stack" className="bg-white rounded-2xl p-4 md:p-6 border border-orange-100 hover:border-orange-300 transition group">
            <div className="text-xl md:text-2xl mb-3">🌐</div>
            <h3 className="font-semibold text-orange-900 mb-1 group-hover:text-orange-600 transition text-sm md:text-base">
              Développement Web Full Stack
            </h3>
            <p className="text-xs md:text-sm text-orange-600">12 semaines • Débutant</p>
          </Link>
          <Link href="/parcours/data-science" className="bg-white rounded-2xl p-4 md:p-6 border border-orange-100 hover:border-orange-300 transition group">
            <div className="text-xl md:text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-orange-900 mb-1 group-hover:text-orange-600 transition text-sm md:text-base">
              Data Science & IA
            </h3>
            <p className="text-xs md:text-sm text-orange-600">14 semaines • Intermédiaire</p>
          </Link>
        </div>
      </div>

      {/* Bourses */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg md:text-xl font-bold text-orange-900">Bourses à ne pas manquer</h2>
          <Link href="/bourses" className="text-xs md:text-sm text-orange-600 hover:underline">
            Voir toutes
          </Link>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-orange-100 text-center">
          <p className="text-xs md:text-sm text-orange-600 mb-3">
            Active les alertes pour ne manquer aucune deadline.
          </p>
          <Link
            href="/bourses"
            className="inline-block mt-3 text-xs md:text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            Explorer les bourses
          </Link>
        </div>
      </div>

    </div>
  )
}