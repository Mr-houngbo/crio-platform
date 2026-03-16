import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
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

  const totalLecons = modules?.reduce((acc: number, m: any) => acc + (m.lecons?.length ?? 0), 0) ?? 0
  const totalDuration = modules?.reduce((acc: number, m: any) => 
    acc + (m.lecons?.reduce((leconAcc: number, lecon: any) => leconAcc + (lecon.duree_minutes ?? 0), 0) ?? 0), 0
  ) ?? 0

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const parcoursIcons: Record<string, string> = {
    'web-full-stack': '🌐',
    'data-science': '📊',
  }

  const typeIcons: Record<string, string> = {
    video: '▶️',
    article: '📄',
    exercice: '✏️',
    projet: '🔨',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl mx-auto md:mx-0">
              {parcoursIcons[slug] ?? '📚'}
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm mb-2">
                <span>🎯</span>
                <span className="text-xs md:text-sm">{parcours.niveau}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold">{parcours.titre}</h1>
            </div>
          </div>
          
          <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-3xl leading-relaxed text-center md:text-left">
            {parcours.description}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span className="text-sm md:text-base">{formatDuration(totalDuration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📖</span>
              <span className="text-sm md:text-base">{totalLecons} leçons</span>
            </div>
            <div className="flex items-center gap-2">
              <span>�</span>
              <span className="text-sm md:text-base">{modules?.length ?? 0} modules</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⭐</span>
              <span className="text-sm md:text-base">Gratuit</span>
            </div>
          </div>

          <div className="text-center md:text-left">
            <Link
              href={`/parcours/${slug}/lecon/${modules?.[0]?.lecons?.[0]?.id}`}
              className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl transition transform hover:scale-105 shadow-lg w-full md:w-auto justify-center"
            >
              <span>▶️</span>
              Commencer le parcours
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-orange-500 rounded-full opacity-20 blur-2xl md:blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-orange-400 rounded-full opacity-20 blur-xl md:blur-2xl"></div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content - Modules */}
          <div className="lg:col-span-2">
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Contenu du parcours</h2>
              <p className="text-sm md:text-base text-gray-600">Découvre les étapes pour maîtriser {parcours.titre.toLowerCase()}</p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {modules?.map((module: any, idx: number) => (
                <div key={module.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 md:px-6 py-3 md:py-4 border-b border-orange-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base md:text-lg">{module.titre}</h3>
                          {module.description && (
                            <p className="text-xs md:text-sm text-gray-600 mt-1">{module.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-orange-600">
                          {module.lecons?.length ?? 0} leçons
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDuration(module.lecons?.reduce((acc: number, lecon: any) => acc + (lecon.duree_minutes ?? 0), 0) ?? 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-50">
                    {module.lecons
                      ?.sort((a: any, b: any) => a.ordre - b.ordre)
                      .map((lecon: any, leconIdx: number) => (
                        <Link
                          key={lecon.id}
                          href={`/parcours/${slug}/lecon/${lecon.id}`}
                          className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 hover:bg-gray-50 transition group"
                        >
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-6 md:w-8 h-6 md:h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm md:text-base">
                              {typeIcons[lecon.type] ?? '📚'}
                            </div>
                            <span className="text-xs md:text-sm text-gray-400 font-medium">
                              {idx + 1}.{leconIdx + 1}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition text-sm md:text-base">
                              {lecon.titre}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                              <span className="text-xs text-gray-500 capitalize">{lecon.type}</span>
                              {lecon.duree_minutes && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <span>⏱️</span>
                                  {lecon.duree_minutes} min
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="opacity-0 group-hover:opacity-100 transition">
                            <span className="text-orange-500 text-sm md:text-base">▶️</span>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4 md:space-y-6">
              {/* Progress Card */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 md:p-6 text-white">
                <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Ta progression</h3>
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <div className="flex justify-between text-xs md:text-sm mb-1">
                      <span>0 leçons complétées</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white rounded-full h-2 w-0"></div>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-white/80">
                    Commence dès maintenant pour suivre ta progression
                  </p>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">En résumé</h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Durée totale</span>
                    <span className="font-semibold text-xs md:text-sm">{formatDuration(totalDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Modules</span>
                    <span className="font-semibold text-xs md:text-sm">{modules?.length ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Leçons</span>
                    <span className="font-semibold text-xs md:text-sm">{totalLecons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Niveau</span>
                    <span className="font-semibold text-xs md:text-sm">{parcours.niveau}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Certification</span>
                    <span className="font-semibold text-xs md:text-sm text-green-600">Gratuite</span>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 md:p-6 text-white">
                <h3 className="font-bold text-base md:text-lg mb-2">Prêt à commencer ?</h3>
                <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4">
                  Rejoins les étudiants qui transforment leur avenir avec CRIO
                </p>
                <Link
                  href={`/parcours/${slug}/lecon/${modules?.[0]?.lecons?.[0]?.id}`}
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-center py-2 md:py-3 rounded-xl transition text-sm md:text-base"
                >
                  Commencer maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}