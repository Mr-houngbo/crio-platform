import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BourseDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: bourse } = await supabase
    .from('bourses')
    .select('*')
    .eq('id', id)
    .single()

  if (!bourse) notFound()

  const { data: epreuves } = await supabase
    .from('epreuves')
    .select('*')
    .eq('bourse_id', id)
    .order('annee', { ascending: false })

  const { data: alumni } = await supabase
    .from('alumni')
    .select('*, profiles(full_name, niveau, filiere)')
    .eq('bourse_id', id)
    .eq('valide', true)

  const typeLabels: Record<string, string> = {
    sujet: 'Sujet',
    corrige: 'Corrige',
    rapport: 'Rapport',
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Retour */}
      <Link href="/bourses" className="text-sm text-orange-600 hover:underline mb-6 inline-block">
        Retour aux bourses
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl p-8 border border-orange-100 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-orange-900 mb-1">{bourse.nom}</h1>
            <p className="text-orange-600">{bourse.organisme} • {bourse.pays}</p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full shrink-0 ${
            bourse.type === 'concours'
              ? 'bg-purple-50 text-purple-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            {bourse.type === 'concours' ? 'Concours' : 'Sur dossier'}
          </span>
        </div>

        <p className="text-orange-700 leading-relaxed mb-6">{bourse.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <div className="text-xs text-orange-500 mb-1">Ouverture</div>
            <div className="text-sm font-medium text-orange-900">
              {bourse.date_ouverture
                ? new Date(bourse.date_ouverture).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                : 'N/A'}
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <div className="text-xs text-orange-500 mb-1">Cloture</div>
            <div className="text-sm font-medium text-orange-900">
              {bourse.date_cloture
                ? new Date(bourse.date_cloture).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                : 'N/A'}
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <div className="text-xs text-orange-500 mb-1">Niveaux</div>
            <div className="text-sm font-medium text-orange-900">
              {bourse.niveau_cible?.join(', ')}
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <div className="text-xs text-orange-500 mb-1">Plateforme</div>
            <div className="text-sm font-medium text-orange-900 truncate">
              {bourse.plateforme_depot ? 'En ligne' : 'N/A'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {bourse.lien_officiel && (
            
              <a href={bourse.lien_officiel}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
            >
              Site officiel
            </a>
          )}
          {bourse.plateforme_depot && (
            
            <a href={bourse.plateforme_depot}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-orange-50 text-orange-700 text-sm font-medium px-5 py-2.5 rounded-xl border border-orange-200 transition"
            >
              Plateforme de depot
            </a>
          )}
        </div>
      </div>

      {/* Banque d'epreuves */}
      <div className="bg-white rounded-2xl p-6 border border-orange-100 mb-6">
        <h2 className="text-lg font-bold text-orange-900 mb-4">
          Banque d epreuves
        </h2>
        {epreuves && epreuves.length > 0 ? (
          <div className="space-y-2">
            {epreuves.map(ep => (
              <div key={ep.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-sm">📄</span>
                  <div>
                    <span className="text-sm font-medium text-orange-900">
                      {typeLabels[ep.type]} {ep.annee}
                    </span>
                  </div>
                </div>
                {ep.fichier_url && (
                  
                <a href={ep.fichier_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 transition"
                  >
                    Telecharger
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-orange-600 text-sm mb-2">
              Pas encore d epreuves disponibles pour cette bourse.
            </p>
            <p className="text-orange-400 text-xs">
              Tu as des anciens sujets ? Contacte-nous pour les ajouter.
            </p>
          </div>
        )}
      </div>

      {/* Alumni */}
      <div className="bg-white rounded-2xl p-6 border border-orange-100">
        <h2 className="text-lg font-bold text-orange-900 mb-1">Alumni FAST UAC</h2>
        <p className="text-sm text-orange-600 mb-4">
          Des anciens etudiants MIA qui ont obtenu cette bourse et acceptent de partager leur experience.
        </p>
        {alumni && alumni.length > 0 ? (
          <div className="space-y-4">
            {alumni.map((a: any) => (
              <div key={a.id} className="border border-orange-100 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-medium text-orange-900">
                      {a.profiles?.full_name}
                    </span>
                    <span className="text-sm text-orange-500 ml-2">
                      {a.annee_obtention} • {a.universite_destination}, {a.pays_destination}
                    </span>
                  </div>
                  {a.disponible_contact && (
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                      Disponible
                    </span>
                  )}
                </div>
                {a.temoignage && (
                  <p className="text-sm text-orange-700 italic mb-3">
                    {a.temoignage}
                  </p>
                )}
                {a.disponible_contact && (
                  <button className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg transition">
                    Envoyer un message
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-orange-600 text-sm mb-2">
              Pas encore d alumni pour cette bourse.
            </p>
            <p className="text-orange-400 text-xs">
              Tu as obtenu cette bourse ? Rejoins la communaute CRIO et aide les prochains.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}