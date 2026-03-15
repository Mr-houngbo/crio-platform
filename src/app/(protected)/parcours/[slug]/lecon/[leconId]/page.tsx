import { createClient } from '@/lib/supabase/server'
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
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            allowFullScreen
          />
        </div>
      )
    }
    return (
      <div className="p-8 text-center">
        <a href={lecon.contenu_url} target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">
          Ouvrir la video
        </a>
      </div>
    )
  }

  if (lecon.type === 'article') {
    return (
      <div className="p-8">
        <p className="text-orange-700 mb-4">Lis attentivement cet article.</p>
        
          <a href={lecon.contenu_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl transition">
          Lire l article
        </a>
      </div>
    )
  }

  return (
    <div className="p-8 text-center">
      <div className="text-4xl mb-4">✏️</div>
      <h3 className="font-semibold text-orange-900 mb-2">Exercice pratique</h3>
      <p className="text-orange-700 text-sm">Mets en pratique ce que tu as appris.</p>
    </div>
  )
}

export default async function LeconPage({ params }: Props) {
  const { slug, leconId } = await params
  const supabase = await createClient()

  const { data: lecon } = await supabase
    .from('lecons')
    .select('*, modules(titre, parcours_id, parcours(titre, slug))')
    .eq('id', leconId)
    .single()

  if (!lecon) notFound()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      <div className="flex items-center gap-2 text-sm text-orange-500 mb-6">
        <Link href="/parcours" className="hover:text-orange-700">Parcours</Link>
        <span>/</span>
        <Link href={`/parcours/${slug}`} className="hover:text-orange-700">
          {lecon.modules?.parcours?.titre}
        </Link>
        <span>/</span>
        <span className="text-orange-800">{lecon.titre}</span>
      </div>

      <h1 className="text-2xl font-bold text-orange-900 mb-2">{lecon.titre}</h1>
      <div className="flex items-center gap-3 mb-8 text-sm text-orange-600">
        <span>{lecon.modules?.titre}</span>
        <span>•</span>
        <span>{lecon.duree_minutes} min</span>
        <span>•</span>
        <span className="capitalize">{lecon.type}</span>
      </div>

      <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden mb-8">
        <ContenuLecon lecon={lecon} />
      </div>

      <div className="flex items-center justify-between">
        <Link href={`/parcours/${slug}`} className="text-sm text-orange-600 hover:underline">
          Retour au parcours
        </Link>
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-xl transition">
          Marquer comme complete
        </button>
      </div>

    </div>
  )
}