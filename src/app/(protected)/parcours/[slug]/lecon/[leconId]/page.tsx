import { createClient } from '@/lib/supabase/server'
import BoutonCompletion from '@/components/ui/BoutonCompletion'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string; leconId: string }>
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/)
  return match ? match[1] : null
}

function ContenuLecon({ lecon }: { lecon: any }) {
  if (lecon.type === 'video' && lecon.contenu_url) {
    const youtubeId = getYoutubeId(lecon.contenu_url)
    if (youtubeId) {
      return (
        <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          {/* Overlay décoratif */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
      )
    }
    return (
      <div className="p-12 text-center space-y-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
        <div className="text-6xl mb-4">🎥</div>
        <h3 className="text-2xl font-black text-orange-900 mb-4">Vidéo externe</h3>
        <p className="text-orange-950/70 max-w-lg mx-auto mb-8">
          Cette vidéo s'ouvre dans une nouvelle fenêtre pour une meilleure expérience d'apprentissage.
        </p>
        <a 
          href={lecon.contenu_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl text-lg"
        >
          <span>🔗</span>
          Ouvrir la vidéo
        </a>
      </div>
    )
  }

  if (lecon.type === 'article') {
    return (
      <div className="p-12 text-center space-y-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-2xl font-black text-orange-900 mb-4">Article à lire</h3>
        <p className="text-orange-950/70 max-w-lg mx-auto mb-8">
          Prends le temps de lire attentivement cet article pour approfondir tes connaissances sur ce sujet.
        </p>
        <a 
          href={lecon.contenu_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-black px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl text-lg"
        >
          <span>📖</span>
          Lire l'article
        </a>
        
        {/* Conseils de lecture */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200 max-w-md mx-auto">
          <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            Conseils de lecture
          </h4>
          <ul className="text-sm text-orange-950/70 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Prends des notes pour retenir les points clés</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Relis les passages difficiles si nécessaire</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Essaie de résumer ce que tu as appris</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  if (lecon.type === 'exercice') {
    return (
      <div className="p-12 text-center space-y-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
        <div className="text-6xl mb-4">✏️</div>
        <h3 className="text-2xl font-black text-orange-900 mb-4">Exercice pratique</h3>
        <p className="text-orange-950/70 max-w-lg mx-auto mb-8">
          Mets en pratique ce que tu as appris avec cet exercice. La pratique est la clé de la maîtrise !
        </p>
        
        {/* Zone d'exercice interactive */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-200 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse delay-150"></div>
            <span className="text-purple-700 font-medium">Pratique en cours...</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-purple-900 mb-2">🎯 Objectif</h4>
              <p className="text-sm text-purple-700">Appliquer les concepts appris</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-purple-900 mb-2">⏱️ Durée</h4>
              <p className="text-sm text-purple-700">{lecon.duree_minutes || 30} minutes</p>
            </div>
          </div>
          
          <div className="bg-purple-100 rounded-xl p-4">
            <p className="text-sm text-purple-700 font-medium text-center">
              💡 <strong>Conseil :</strong> Prends ton temps pour comprendre chaque étape avant de passer à la suivante.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (lecon.type === 'projet') {
    return (
      <div className="p-12 text-center space-y-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
        <div className="text-6xl mb-4">🔨</div>
        <h3 className="text-2xl font-black text-orange-900 mb-4">Projet pratique</h3>
        <p className="text-orange-950/70 max-w-lg mx-auto mb-8">
          Applique toutes tes connaissances dans ce projet concret. C'est l'occasion de créer quelque chose d'impressionnant !
        </p>
        
        {/* Stats du projet */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-black text-blue-900 mb-1">Objectif</h4>
            <p className="text-sm text-blue-700">Projet complet</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
            <div className="text-3xl mb-2">⏱️</div>
            <h4 className="font-black text-blue-900 mb-1">Temps</h4>
            <p className="text-sm text-blue-700">{lecon.duree_minutes || 60} minutes</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
            <div className="text-3xl mb-2">🏆</div>
            <h4 className="font-black text-blue-900 mb-1">Résultat</h4>
            <p className="text-sm text-blue-700">Portfolio-ready</p>
          </div>
        </div>
        
        {/* Étapes du projet */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-200 max-w-md mx-auto">
          <h4 className="font-semibold text-orange-900 mb-4">📋 Étapes recommandées</h4>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <span className="text-sm text-orange-950/70">Analyser les besoins</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <span className="text-sm text-orange-950/70">Développer la solution</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <span className="text-sm text-orange-950/70">Tester et améliorer</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-12 text-center space-y-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200">
      <div className="text-6xl mb-4">📚</div>
      <h3 className="text-2xl font-black text-orange-900 mb-4">Contenu de la leçon</h3>
      <p className="text-orange-950/70 max-w-lg mx-auto">
        Découvre ce contenu interactif et progresse à ton rythme.
      </p>
    </div>
  )
}

export default async function LeconPage({ params }: Props) {
  const { slug, leconId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: lecon } = await supabase
    .from('lecons')
    .select('*, modules(titre, ordre, parcours_id, parcours(titre, slug))')
    .eq('id', leconId)
    .single()

  if (!lecon) notFound()

  const { data: progression } = await supabase
    .from('progression')
    .select('completee')
    .eq('user_id', user?.id ?? '')
    .eq('lecon_id', leconId)
    .single()

  const dejaComplete = progression?.completee ?? false

  // Récupérer leçons du même module pour navigation
  const { data: leconsDuModule } = await supabase
    .from('lecons')
    .select('id, titre, ordre, type')
    .eq('module_id', lecon.module_id)
    .order('ordre')

  const currentIndex = leconsDuModule?.findIndex((l: any) => l.id === leconId) ?? 0
  const leconPrecedente = currentIndex > 0 ? leconsDuModule?.[currentIndex - 1] : null
  const leconSuivante = currentIndex < (leconsDuModule?.length ?? 0) - 1
    ? leconsDuModule?.[currentIndex + 1]
    : null

  // Progression dans le module
  const { data: progressionModule } = await supabase
    .from('progression')
    .select('lecon_id')
    .eq('user_id', user?.id ?? '')
    .eq('completee', true)
    .in('lecon_id', leconsDuModule?.map((l: any) => l.id) ?? [])

  const completedInModule = progressionModule?.length ?? 0
  const totalInModule = leconsDuModule?.length ?? 0
  const modulePct = totalInModule > 0 ? Math.round((completedInModule / totalInModule) * 100) : 0

  const typeLabels: Record<string, string> = {
    video: 'Vidéo',
    article: 'Article',
    exercice: 'Exercice',
    projet: 'Projet',
  }

  const typeIcons: Record<string, string> = {
    video: '🎥',
    article: '📄',
    exercice: '💪',
    projet: '🚀',
  }

  const typeColors: Record<string, { bg: string, text: string, border: string }> = {
    video: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    article: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    exercice: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    projet: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Breadcrumb moderne */}
        <div className="flex items-center gap-3 text-sm mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100">
          <Link 
            href="/dashboard" 
            className="text-orange-600 hover:text-orange-700 transition font-medium"
          >
            🏠 Dashboard
          </Link>
          <span className="text-orange-300">•</span>
          <Link 
            href="/parcours" 
            className="text-orange-600 hover:text-orange-700 transition font-medium"
          >
            📚 Parcours
          </Link>
          <span className="text-orange-300">•</span>
          <Link 
            href={`/parcours/${slug}`} 
            className="text-orange-600 hover:text-orange-700 transition font-medium"
          >
            {lecon.modules?.parcours?.titre}
          </Link>
          <span className="text-orange-300">•</span>
          <span className="text-orange-900 font-semibold">{lecon.titre}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header de la leçon */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-orange-100 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-3xl border-2 border-orange-300">
                  {typeIcons[lecon.type] ?? '📚'}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${typeColors[lecon.type]?.bg} ${typeColors[lecon.type]?.text} ${typeColors[lecon.type]?.border}`}>
                      {typeLabels[lecon.type]}
                    </span>
                    <span className="text-orange-950/70 text-sm">
                      Module : {lecon.modules?.titre}
                    </span>
                    {lecon.duree_minutes && (
                      <span className="text-orange-950/70 text-sm flex items-center gap-1">
                        <span>⏱️</span>
                        {lecon.duree_minutes} min
                      </span>
                    )}
                    {dejaComplete && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                        ✅ Complétée
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-black text-orange-900 mb-3 leading-tight">
                    {lecon.titre}
                  </h1>
                </div>
              </div>
            </div>

            {/* Contenu de la leçon */}
            <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm">
              <ContenuLecon lecon={lecon} />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-orange-100 shadow-sm">
              
              {/* Leçon précédente */}
              {leconPrecedente ? (
                <Link
                  href={`/parcours/${slug}/lecon/${leconPrecedente.id}`}
                  className="flex items-center gap-3 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-4 py-3 rounded-xl transition-all duration-200 group"
                >
                  <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                  <div className="text-left">
                    <div className="text-xs text-orange-600">Précédente</div>
                    <div className="text-sm truncate max-w-32">{leconPrecedente.titre}</div>
                  </div>
                </Link>
              ) : (
                <Link
                  href={`/parcours/${slug}`}
                  className="flex items-center gap-3 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-4 py-3 rounded-xl transition-all duration-200"
                >
                  <span className="text-lg">←</span>
                  <div className="text-left">
                    <div className="text-xs text-orange-600">Retour</div>
                    <div className="text-sm">Parcours</div>
                  </div>
                </Link>
              )}

              {/* Bouton de completion */}
              <BoutonCompletion
                leconId={leconId}
                slug={slug}
                dejaComplete={dejaComplete}
                leconSuivanteId={leconSuivante?.id}
              />

              {/* Leçon suivante */}
              {leconSuivante ? (
                <Link
                  href={`/parcours/${slug}/lecon/${leconSuivante.id}`}
                  className="flex items-center gap-3 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-4 py-3 rounded-xl transition-all duration-200 group justify-end"
                >
                  <div className="text-right">
                    <div className="text-xs text-orange-600">Suivante</div>
                    <div className="text-sm truncate max-w-32">{leconSuivante.titre}</div>
                  </div>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ) : (
                <div className="w-24"></div> // Spacer pour équilibrer
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Progression du module */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
              <h3 className="font-black text-orange-900 text-lg mb-4">
                {lecon.modules?.titre}
              </h3>
              
              {/* Progression globale */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-orange-950/70">Progression</span>
                  <span className="font-black text-orange-600">{modulePct}%</span>
                </div>
                <div className="w-full bg-orange-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full h-3 transition-all duration-500"
                    style={{ width: `${modulePct}%` }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs text-orange-950/70">
                    {completedInModule} / {totalInModule} leçons
                  </span>
                </div>
              </div>

              {/* Liste des leçons */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {leconsDuModule?.map((l: any, idx: number) => {
                  const isCurrentLecon = l.id === leconId
                  const isDone = progressionModule?.some((p: any) => p.lecon_id === l.id)
                  
                  return (
                    <Link
                      key={l.id}
                      href={`/parcours/${slug}/lecon/${l.id}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isCurrentLecon
                          ? 'bg-orange-600 text-white shadow-lg scale-105'
                          : isDone
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'hover:bg-orange-50 text-orange-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isCurrentLecon
                          ? 'bg-white/20 text-white'
                          : isDone
                          ? 'bg-green-200 text-green-700'
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {isDone && !isCurrentLecon ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm">
                          {l.titre}
                        </div>
                        <div className={`text-xs ${
                          isCurrentLecon ? 'text-white/80' : 'text-orange-950/50'
                        }`}>
                          {typeLabels[l.type]}
                        </div>
                      </div>
                      {isCurrentLecon && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
              <h3 className="font-black text-orange-900 text-lg mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Link
                  href={`/parcours/${slug}`}
                  className="block w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-4 py-3 rounded-xl transition-all duration-200 text-center"
                >
                  📊 Vue d'ensemble du parcours
                </Link>
                <Link
                  href="/dashboard"
                  className="block w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-4 py-3 rounded-xl transition-all duration-200 text-center"
                >
                  🏠 Retour au dashboard
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}