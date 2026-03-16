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
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-2xl"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )
    }
    return (
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-12 text-center border border-orange-200">
        <div className="text-6xl mb-6">🎥</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Vidéo externe</h3>
        <p className="text-gray-600 mb-6">Cette vidéo s'ouvre dans une nouvelle fenêtre</p>
        <a 
          href={lecon.contenu_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-xl transition transform hover:scale-105 shadow-lg"
        >
          <span>🔗</span>
          Ouvrir la vidéo
        </a>
      </div>
    )
  }

  if (lecon.type === 'article') {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-12 text-center border border-green-200">
        <div className="text-6xl mb-6">📄</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Article à lire</h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Prends le temps de lire attentivement cet article pour approfondir tes connaissances sur ce sujet.
        </p>
        <a 
          href={lecon.contenu_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl transition transform hover:scale-105 shadow-lg"
        >
          <span>📖</span>
          Lire l'article
        </a>
      </div>
    )
  }

  if (lecon.type === 'exercice') {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-12 text-center border border-purple-200">
        <div className="text-6xl mb-6">✏️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Exercice pratique</h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Mets en pratique ce que tu as appris avec cet exercice. La pratique est la clé de la maîtrise !
        </p>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
          <p className="text-sm text-gray-500 mb-4">
            💡 <strong>Conseil :</strong> Prends ton temps pour comprendre chaque étape avant de passer à la suivante.
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Pratique en cours...</span>
          </div>
        </div>
      </div>
    )
  }

  if (lecon.type === 'projet') {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 text-center border border-blue-200">
        <div className="text-6xl mb-6">🔨</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Projet pratique</h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Applique toutes tes connaissances dans ce projet concret. C'est l'occasion de créer quelque chose d'impressionnant !
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-1">Objectif</h4>
            <p className="text-sm text-gray-600">Créer un projet complet</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <div className="text-2xl mb-2">⏱️</div>
            <h4 className="font-semibold text-gray-900 mb-1">Temps</h4>
            <p className="text-sm text-gray-600">{lecon.duree_minutes || 60} minutes</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <div className="text-2xl mb-2">🏆</div>
            <h4 className="font-semibold text-gray-900 mb-1">Résultat</h4>
            <p className="text-sm text-gray-600">Portfolio-ready</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border border-gray-200">
      <div className="text-6xl mb-6">📚</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Contenu de la leçon</h3>
      <p className="text-gray-600">Découvre ce contenu interactif.</p>
    </div>
  )
}

export default async function LeconPage({ params }: Props) {
  const { slug, leconId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: lecon } = await supabase
    .from('lecons')
    .select('*, modules(titre, parcours_id, parcours(titre, slug))')
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

  const typeIcons: Record<string, string> = {
    video: '🎥',
    article: '📄',
    exercice: '✏️',
    projet: '🔨',
  }

  const typeColors: Record<string, string> = {
    video: 'bg-red-100 text-red-700 border-red-200',
    article: 'bg-green-100 text-green-700 border-green-200',
    exercice: 'bg-purple-100 text-purple-700 border-purple-200',
    projet: 'bg-blue-100 text-blue-700 border-blue-200',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Breadcrumb moderne */}
        <div className="flex items-center gap-3 text-sm mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
          <Link 
            href="/parcours" 
            className="text-gray-600 hover:text-orange-600 transition font-medium"
          >
            🏠 Parcours
          </Link>
          <span className="text-gray-400">/</span>
          <Link 
            href={`/parcours/${slug}`} 
            className="text-gray-600 hover:text-orange-600 transition font-medium"
          >
            {lecon.modules?.parcours?.titre}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-orange-600 font-semibold">{lecon.titre}</span>
        </div>

        {/* Header de la leçon */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{typeIcons[lecon.type] ?? '📚'}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{lecon.titre}</h1>
                  <p className="text-gray-600">{lecon.modules?.titre}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${typeColors[lecon.type] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  <span>{typeIcons[lecon.type] ?? '📚'}</span>
                  <span className="capitalize">{lecon.type}</span>
                </span>
                
                {lecon.duree_minutes && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    <span>⏱️</span>
                    {lecon.duree_minutes} minutes
                  </span>
                )}
                
                {dejaComplete && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                    <span>✅</span>
                    Complétée
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <ContenuLecon lecon={lecon} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100">
          <Link 
            href={`/parcours/${slug}`} 
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition font-medium"
          >
            <span>←</span>
            Retour au parcours
          </Link>
          
          <BoutonCompletion
            leconId={leconId}
            slug={slug}
            dejaComplete={dejaComplete}
          />
        </div>

      </div>
    </div>
  )
}