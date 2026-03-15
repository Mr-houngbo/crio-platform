import { createClient } from '@/lib/supabase/server'
import { Parcours } from '@/types'
import Link from 'next/link'

export default async function ParcoursPage() {
  const supabase = await createClient()
  const { data: parcours } = await supabase
    .from('parcours')
    .select('*')
    .eq('actif', true)
    .order('ordre')

  const icons: Record<string, string> = {
    'web-full-stack': '🌐',
    'data-science': '📊',
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-orange-900 mb-2">Les parcours</h1>
        <p className="text-orange-700">
          Choisis ton chemin. Chaque parcours est construit pour les étudiants MIA de la FAST UAC.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {parcours?.map((p: Parcours) => (
          <Link
            key={p.id}
            href={`/parcours/${p.slug}`}
            className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-400 hover:shadow-md transition group"
          >
            <div className="text-3xl mb-4">{icons[p.slug] ?? '📚'}</div>
            <h2 className="text-xl font-semibold text-orange-900 mb-2 group-hover:text-orange-600 transition">
              {p.titre}
            </h2>
            <p className="text-sm text-orange-700 mb-4 leading-relaxed">{p.description}</p>
            <div className="flex items-center gap-2 text-xs text-orange-600">
              <span className="bg-orange-50 px-3 py-1 rounded-full">{p.duree_semaines} semaines</span>
              <span className="bg-orange-50 px-3 py-1 rounded-full">{p.niveau}</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">Gratuit</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}