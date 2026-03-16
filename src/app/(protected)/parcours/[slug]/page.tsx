import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ParcourDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: parcours } = await supabase
    .from('parcours')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!parcours) notFound()

  const { data: modules } = await supabase
    .from('modules')
    .select('*, lecons(*)')
    .eq('parcours_id', parcours.id)
    .order('ordre')

  const { data: progressions } = await supabase
    .from('progression')
    .select('lecon_id, completee, completed_at')
    .eq('user_id', user?.id ?? '')
    .eq('completee', true)
    .order('completed_at', { ascending: false })

  const completedIds = new Set(progressions?.map((p: any) => p.lecon_id) ?? [])
  const totalLecons = modules?.reduce((acc, m) => acc + (m.lecons?.length ?? 0), 0) ?? 0
  const completedCount = modules?.reduce((acc, m) =>
    acc + (m.lecons?.filter((l: any) => completedIds.has(l.id)).length ?? 0), 0) ?? 0
  const pct = totalLecons > 0 ? Math.round((completedCount / totalLecons) * 100) : 0

  // Calculer la prochaine leçon non complétée
  const premiereLeconNonComplete = modules
    ?.flatMap((m: any) => m.lecons?.sort((a: any, b: any) => a.ordre - b.ordre) ?? [])
    .find((l: any) => !completedIds.has(l.id))

  // Calculer le streak pour ce parcours
  const streakParcours = progressions?.length ?? 0

  // Calculer le temps total
  const totalMinutes = modules?.reduce((acc, m) => 
   acc + (m.lecons?.reduce((leconAcc: number, lecon: any) => leconAcc + (lecon.duree_minutes ?? 0), 0) ?? 0), 0
  ) ?? 0

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`
    return `${mins}min`
  }

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return "à l'instant"
    if (diffHours < 24) return `il y a ${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `il y a ${diffDays}j`
    return `il y a ${Math.floor(diffDays / 7)} sem`
  }

  // Icônes et labels
  const parcoursIcons: Record<string, string> = {
    'web-full-stack': '🌐',
    'data-science': '📊',
  }

  const typeIcons: Record<string, string> = {
    video: '🎥',
    article: '📄',
    exercice: '💪',
    projet: '🚀',
  }

  const typeLabels: Record<string, string> = {
    video: 'Vidéo',
    article: 'Article', 
    exercice: 'Exercice',
    projet: 'Projet',
  }

  const getProgressionMessage = (percentage: number) => {
    if (percentage === 0) return "🚀 Prêt à commencer ?"
    if (percentage < 25) return "🌱 Bon début !"
    if (percentage < 50) return "💪 Continue comme ça !"
    if (percentage < 75) return "🔥 Tu progresses bien !"
    if (percentage < 100) return "⚡ Bientôt terminé !"
    return "🏆 Parcours complété !"
  }

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-400'
    if (streak < 3) return 'text-orange-600'
    if (streak < 7) return 'text-orange-700'
    if (streak < 14) return 'text-red-600'
    return 'text-purple-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      
      {/* Hero Section avec progression */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        {/* Background décoratif */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400 rounded-full opacity-20 blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-orange-200 mb-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <span>•</span>
            <Link href="/parcours" className="hover:text-white transition-colors">
              Parcours
            </Link>
            <span>•</span>
            <span className="text-white font-medium">{parcours.titre}</span>
          </div>

          {/* Header principal */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            
            {/* Colonne gauche : Infos parcours */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border-2 border-white/30">
                  {parcoursIcons[slug] ?? '📚'}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold border border-white/30">
                      {parcours.niveau}
                    </span>
                    <span className="bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold border border-green-300/30">
                      🎓 Gratuit
                    </span>
                    {completedCount > 0 && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold border border-white/30">
                        🔥 {streakParcours} leçons
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black mb-3 leading-tight">
                    {parcours.titre}
                  </h1>
                  <p className="text-lg text-white/90 leading-relaxed mb-6">
                    {parcours.description}
                  </p>
                </div>
              </div>

              {/* Stats principales */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl lg:text-3xl font-black mb-1">{modules?.length ?? 0}</div>
                  <div className="text-sm text-white/80">Modules</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl lg:text-3xl font-black mb-1">{totalLecons}</div>
                  <div className="text-sm text-white/80">Leçons</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl lg:text-3xl font-black mb-1">{formatDuration(totalMinutes)}</div>
                  <div className="text-sm text-white/80">Durée totale</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl lg:text-3xl font-black mb-1">{parcours.duree_semaines}</div>
                  <div className="text-sm text-white/80">Semaines</div>
                </div>
              </div>

              {/* CTA principal */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/parcours/${slug}/lecon/${premiereLeconNonComplete?.id ?? modules?.[0]?.lecons?.[0]?.id}`}
                  className="inline-flex items-center justify-center gap-3 bg-white text-orange-600 hover:bg-orange-50 font-black px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl text-lg"
                >
                  <span className="text-xl">{completedCount > 0 ? '▶️' : '🚀'}</span>
                  {completedCount > 0 ? 'Continuer le parcours' : 'Commencer le parcours'}
                </Link>
                {completedCount > 0 && (
                  <button className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-200">
                    📊 Voir ma progression
                  </button>
                )}
              </div>
            </div>

            {/* Colonne droite : Progression */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="font-black text-xl mb-4">Ta progression</h3>
                
                {/* Cercle de progression */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-4 border-white border-t-transparent border-r-transparent transition-all duration-1000"
                      style={{
                        transform: `rotate(${(pct / 100) * 360 - 45}deg)`
                      }}
                    ></div>
                    <div className="absolute inset-3 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-black">{pct}%</div>
                        <div className="text-xs text-white/80">complété</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats progression */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Leçons complétées</span>
                    <span className="font-bold">{completedCount}/{totalLecons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">XP gagnés</span>
                    <span className="font-bold">+{completedCount * 10}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Dernière activité</span>
                    <span className="font-bold">
                      {progressions?.[0] ? formatDateRelative(progressions[0].completed_at) : 'Jamais'}
                    </span>
                  </div>
                </div>

                {/* Message motivant */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-sm font-medium text-center">
                    {getProgressionMessage(pct)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal : Modules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-black text-orange-900 mb-2">
            Contenu du parcours
          </h2>
          <p className="text-orange-950/70 text-lg">
            Maîtrise {parcours.titre.toLowerCase()} étape par étape
          </p>
        </div>

        <div className="space-y-6">
          {modules?.map((module, moduleIdx) => {
            const moduleLecons = module.lecons?.sort((a: any, b: any) => a.ordre - b.ordre) ?? []
            const moduleCompleted = moduleLecons.filter((l: any) => completedIds.has(l.id)).length
            const moduleTotal = moduleLecons.length
            const modulePercentage = moduleTotal > 0 ? Math.round((moduleCompleted / moduleTotal) * 100) : 0
            const isModuleComplete = moduleCompleted === moduleTotal && moduleTotal > 0
            const moduleDuration = moduleLecons.reduce((acc: number, l: any) => acc + (l.duree_minutes ?? 0), 0)

            return (
              <div key={module.id} className="bg-white rounded-2xl border border-orange-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                
                {/* Header du module */}
                <div className={`px-6 py-5 border-b border-orange-100 ${
                  isModuleComplete ? 'bg-green-50' : 'bg-orange-50'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black border-2 ${
                        isModuleComplete 
                          ? 'bg-green-500 text-white border-green-600' 
                          : 'bg-orange-600 text-white border-orange-700'
                      }`}>
                        {isModuleComplete ? '✓' : moduleIdx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-orange-900 text-lg mb-1">{module.titre}</h3>
                        {module.description && (
                          <p className="text-orange-950/70 text-sm">{module.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-black text-orange-600">{moduleCompleted}/{moduleTotal}</div>
                        <div className="text-xs text-orange-950/70">leçons</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-orange-600">{modulePercentage}%</div>
                        <div className="text-xs text-orange-950/70">terminé</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-orange-600">{formatDuration(moduleDuration)}</div>
                        <div className="text-xs text-orange-950/70">durée</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Barre de progression du module */}
                  {moduleCompleted > 0 && (
                    <div className="mt-4">
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div 
                          className={`rounded-full h-2 transition-all duration-500 ${
                            isModuleComplete ? 'bg-green-500' : 'bg-orange-600'
                          }`}
                          style={{ width: `${modulePercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Leçons du module */}
                <div className="divide-y divide-orange-50">
                  {moduleLecons.map((lecon: any, leconIdx: number) => {
                    const isCompleted = completedIds.has(lecon.id)
                    const isNext = !isCompleted && moduleLecons[leconIdx - 1] && completedIds.has(moduleLecons[leconIdx - 1].id)
                    
                    return (
                      <Link
                        key={lecon.id}
                        href={`/parcours/${slug}/lecon/${lecon.id}`}
                        className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 group ${
                          isCompleted 
                            ? 'bg-green-50/50 hover:bg-green-50' 
                            : isNext 
                              ? 'bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-500' 
                              : 'hover:bg-orange-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 transition-all duration-200 ${
                            isCompleted 
                              ? 'bg-green-100 text-green-600 border-green-300' 
                              : isNext
                                ? 'bg-orange-600 text-white border-orange-700 group-hover:scale-110'
                                : 'bg-orange-100 text-orange-600 border-orange-300 group-hover:bg-orange-200'
                          }`}>
                            {isCompleted ? '✓' : typeIcons[lecon.type] ?? '📚'}
                          </div>
                          <div className="text-xs font-bold text-orange-950/50">
                            {moduleIdx + 1}.{leconIdx + 1}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm lg:text-base mb-1 transition-colors duration-200 ${
                            isCompleted 
                              ? 'text-green-700 line-through' 
                              : 'text-orange-900 group-hover:text-orange-600'
                          }`}>
                            {lecon.titre}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-orange-950/70">
                            <span className="flex items-center gap-1">
                              <span>{typeLabels[lecon.type]}</span>
                            </span>
                            {lecon.duree_minutes && (
                              <span className="flex items-center gap-1">
                                <span>⏱️</span>
                                <span>{lecon.duree_minutes} min</span>
                              </span>
                            )}
                            {isCompleted && (
                              <span className="flex items-center gap-1 text-green-600">
                                <span>✓</span>
                                <span>Complété</span>
                              </span>
                            )}
                            {isNext && (
                              <span className="flex items-center gap-1 text-orange-600 font-semibold">
                                <span>👉</span>
                                <span>Suivant</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className={`transition-all duration-200 ${
                          isCompleted ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          <span className="text-orange-500 text-xl">→</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Section encouragement final */}
        {completedCount > 0 && completedCount < totalLecons && (
          <div className="mt-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-black mb-4">
              {getProgressionMessage(pct)}
            </h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Tu as déjà complété {completedCount} leçons et gagné {completedCount * 10} XP ! 
              Continue sur cette lancée pour maîtriser {parcours.titre.toLowerCase()}.
            </p>
            <Link
              href={`/parcours/${slug}/lecon/${premiereLeconNonComplete?.id}`}
              className="inline-flex items-center gap-3 bg-white text-orange-600 hover:bg-orange-50 font-black px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl"
            >
              <span>🚀</span>
              Continuer avec la prochaine leçon
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}