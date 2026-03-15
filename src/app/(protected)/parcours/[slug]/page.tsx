import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ParcourDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: parcours } = await supabase
    .from('parcours')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!parcours) notFound()

  const { data: modules } = await supabase
    .from('modules')
    .select(`*, lecons(*)`)
    .eq('parcours_id', parcours.id)
    .order('ordre')

  const totalLecons = modules?.reduce((acc, m) => acc + (m.lecons?.length ?? 0), 0) ?? 0
  const icons: Record<string, string> = {
    'web-full-stack': '🌐',
    'data-science': '📊',
  }
  const typeIcons: Record<string, string> = {
    video: '▶',
    article: '📄',
    exercice: '✏️',
    projet: '🔨',
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Header parcours */}
      <div className="bg-white rounded-2xl p-8 border border-orange-100 mb-8">
        <div className="text-4xl mb-4">{icons[slug] ?? '📚'}</div>
        <h1 className="text-3xl font-bold text-orange-900 mb-3">{parcours.titre}</h1>
        <p className="text-orange-700 mb-6 leading-relaxed">{parcours.description}</p>
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
            {parcours.duree_semaines} semaines
          </span>
          <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
            {parcours.niveau}
          </span>
          <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
            {totalLecons} leçons
          </span>
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            Gratuit
          </span>
        </div>
        <Link
          href={`/parcours/${slug}/lecon/${modules?.[0]?.lecons?.[0]?.id}`}
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-xl transition"
        >
          Commencer le parcours →
        </Link>
      </div>

      {/* Liste des modules */}
      <h2 className="text-xl font-bold text-orange-900 mb-4">Contenu du parcours</h2>
      <div className="space-y-4">
        {modules?.map((module, idx) => (
          <div key={module.id} className="bg-white rounded-xl border border-orange-100 overflow-hidden">
            <div className="px-6 py-4 bg-orange-50 border-b border-orange-100">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-orange-900">{module.titre}</h3>
                  <p className="text-xs text-orange-600">{module.description}</p>
                </div>
                <span className="ml-auto text-xs text-orange-500">
                  {module.lecons?.length ?? 0} leçons
                </span>
              </div>
            </div>
            <div className="divide-y divide-orange-50">
              {module.lecons
                ?.sort((a: any, b: any) => a.ordre - b.ordre)
                .map((lecon: any) => (
                  <Link
                    key={lecon.id}
                    href={`/parcours/${slug}/lecon/${lecon.id}`}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-orange-50 transition group"
                  >
                    <span className="text-sm">{typeIcons[lecon.type]}</span>
                    <span className="text-sm text-orange-800 group-hover:text-orange-600 transition flex-1">
                      {lecon.titre}
                    </span>
                    <span className="text-xs text-orange-400">
                      {lecon.duree_minutes} min
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}