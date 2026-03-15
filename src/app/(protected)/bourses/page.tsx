import { createClient } from '@/lib/supabase/server'
import { Bourse } from '@/types'
import Link from 'next/link'

function getDaysLeft(dateStr: string | null) {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function StatusBadge({ days }: { days: number | null }) {
  if (days === null) return null
  if (days < 0) return (
    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">Clôturée</span>
  )
  if (days <= 7) return (
    <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
      {days}j restants
    </span>
  )
  if (days <= 30) return (
    <span className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-full">
      {days}j restants
    </span>
  )
  return (
    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
      Ouverte
    </span>
  )
}

const paysFlags: Record<string, string> = {
  'France': '🇫🇷',
  'Maroc': '🇲🇦',
  'Allemagne': '🇩🇪',
  'Chine': '🇨🇳',
  'Panafrique': '🌍',
  'International': '🌐',
}

export default async function BourseListePage() {
  const supabase = await createClient()
  const { data: bourses } = await supabase
    .from('bourses')
    .select('*')
    .eq('actif', true)
    .order('date_cloture')

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-orange-900 mb-2">Bourses & Opportunités</h1>
        <p className="text-orange-700">
          Toutes les bourses taillées pour les étudiants MIA de la FAST UAC. Clique sur une bourse pour voir le guide complet et contacter des alumni.
        </p>
      </div>

      {/* Filtres rapides */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <span className="text-sm text-orange-700 font-medium">Filtrer :</span>
        {['Tous', 'Concours', 'Dossier', 'Master', 'Doctorat'].map(f => (
          <span
            key={f}
            className="bg-white border border-orange-200 text-orange-700 text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-orange-50 transition"
          >
            {f}
          </span>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {bourses?.map((bourse: Bourse) => {
          const days = getDaysLeft(bourse.date_cloture)
          return (
            <Link
              key={bourse.id}
              href={`/bourses/${bourse.id}`}
              className="block bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 hover:shadow-sm transition group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-3xl">
                    {paysFlags[bourse.pays ?? ''] ?? '🌐'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h2 className="font-semibold text-orange-900 group-hover:text-orange-600 transition">
                        {bourse.nom}
                      </h2>
                      <StatusBadge days={days} />
                    </div>
                    <p className="text-sm text-orange-600 mb-2">{bourse.organisme} • {bourse.pays}</p>
                    <p className="text-sm text-orange-700 line-clamp-2 mb-3">{bourse.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        bourse.type === 'concours'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {bourse.type === 'concours' ? 'Concours' : 'Sur dossier'}
                      </span>
                      {bourse.niveau_cible?.map(n => (
                        <span key={n} className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-orange-500 shrink-0">
                  {bourse.date_cloture && (
                    <div>
                      <div className="text-xs text-orange-400 mb-1">Clôture</div>
                      <div className="font-medium text-orange-700">
                        {new Date(bourse.date_cloture).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}