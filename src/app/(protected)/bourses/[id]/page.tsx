import { createClient } from '@/lib/supabase/server'
import BoutonAlerte from '@/components/ui/BoutonAlerte'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

function getDaysLeft(dateStr: string | null) {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getDeadlineInfo(days: number | null) {
  if (days === null) return { 
    color: 'bg-gray-100 text-gray-600', 
    text: 'Date non spécifiée',
    icon: '📅',
    urgency: 'low'
  }
  if (days < 0) return { 
    color: 'bg-gray-100 text-gray-500', 
    text: 'Expirée',
    icon: '❌',
    urgency: 'expired'
  }
  if (days === 0) return { 
    color: 'bg-red-500 text-white font-black', 
    text: "DERNIER JOUR !",
    icon: '🔥',
    urgency: 'critical'
  }
  if (days === 1) return { 
    color: 'bg-red-500 text-white font-black', 
    text: "DEMAIN !",
    icon: '⚠️',
    urgency: 'critical'
  }
  if (days <= 3) return { 
    color: 'bg-red-100 text-red-700 font-bold', 
    text: `${days} jours restants`,
    icon: '🔥',
    urgency: 'high'
  }
  if (days <= 7) return { 
    color: 'bg-red-50 text-red-600 font-bold', 
    text: `${days} jours restants`,
    icon: '⚠️',
    urgency: 'medium'
  }
  if (days <= 30) return { 
    color: 'bg-orange-100 text-orange-700', 
    text: `${days} jours restants`,
    icon: '⏰',
    urgency: 'low'
  }
  return { 
    color: 'bg-green-100 text-green-700', 
    text: 'Ouverte',
    icon: '✅',
    urgency: 'low'
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Non spécifiée'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default async function BourseDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Récupération parallèle de toutes les données
  const { data: { user } } = await supabase.auth.getUser()
  
  const [
    { data: bourse },
    { data: epreuves },
    { data: alumni },
    { data: alerte },
  ] = await Promise.all([
    supabase.from('bourses').select('*').eq('id', id).single(),
    supabase.from('epreuves').select('*').eq('bourse_id', id).order('annee', { ascending: false }),
    supabase.from('alumni').select('*, profiles(full_name, niveau, filiere)').eq('bourse_id', id).eq('valide', true),
    supabase.from('alertes_bourses').select('id').eq('user_id', user?.id ?? '').eq('bourse_id', id).single(),
  ])

  if (!bourse) notFound()

  const dejaSuivie = !!alerte
  const days = getDaysLeft(bourse.date_cloture)
  const deadlineInfo = getDeadlineInfo(days)

  const paysFlags: Record<string, string> = {
    'France': '🇫🇷', 'Maroc': '🇲🇦', 'Allemagne': '🇩🇪',
    'Chine': '🇨🇳', 'Panafrique': '🌍', 'International': '🌐',
    'Bénin': '🇧🇯', 'Canada': '🇨🇦', 'USA': '🇺🇸',
    'Royaume-Uni': '🇬🇧', 'Belgique': '🇧🇪', 'Suisse': '🇨🇭',
    'Japon': '🇯🇵', 'Australie': '🇦🇺', 'Pays-Bas': '🇳🇱'
  }

  const flag = paysFlags[bourse.pays ?? ''] ?? '🌍'

  const typeIcons: Record<string, string> = {
    'sujet': '📄',
    'corrige': '✅', 
    'rapport': '📋'
  }

  const typeLabels: Record<string, string> = {
    'sujet': 'Sujet',
    'corrige': 'Corrigé',
    'rapport': 'Rapport'
  }

  const typeColors: Record<string, { bg: string, text: string, border: string }> = {
    'sujet': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'corrige': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'rapport': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
  }

  // Calculer le pourcentage de progression de la deadline
  const deadlineProgress = days !== null && days >= 0 ? Math.max(0, Math.min(100, (30 - days) / 30 * 100)) : 0

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
            href="/bourses" 
            className="text-orange-600 hover:text-orange-700 transition font-medium"
          >
            🎓 Bourses
          </Link>
          <span className="text-orange-300">•</span>
          <span className="text-orange-900 font-semibold">{bourse.nom}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header bourse avec deadline urgente */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-orange-100 shadow-sm">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-4xl border-2 border-orange-300 shadow-lg">
                  {flag}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-black border ${deadlineInfo.color}`}>
                      {deadlineInfo.icon} {deadlineInfo.text}
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border ${
                      bourse.type === 'concours' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      🏆 {bourse.type === 'concours' ? 'CONCOURS' : 'SUR DOSSIER'}
                    </span>
                    {dejaSuivie && (
                      <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold border border-purple-200">
                        🔔 SUIVIE
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl lg:text-4xl font-black text-orange-900 mb-3 leading-tight">
                    {bourse.nom}
                  </h1>
                  <p className="text-lg text-orange-950/70 font-medium">
                    {bourse.organisme} • {bourse.pays}
                  </p>
                </div>
              </div>

              {/* Deadline progress bar si urgent */}
              {deadlineInfo.urgency === 'critical' || deadlineInfo.urgency === 'high' ? (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-bold text-red-600">⚠️ Deadline urgente</span>
                    <span className="font-black text-red-600">{deadlineInfo.text}</span>
                  </div>
                  <div className="w-full bg-red-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 rounded-full h-3 transition-all duration-500 animate-pulse"
                      style={{ width: `${deadlineProgress}%` }}
                    />
                  </div>
                </div>
              ) : null}

              <p className="text-orange-950/70 leading-relaxed text-lg mb-6">
                {bourse.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                {bourse.niveau_cible?.map((n: string) => (
                  <span key={n} className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-bold border border-orange-200">
                    🎓 {n}
                  </span>
                ))}
                {bourse.domaines_eligibles?.map((d: string) => (
                  <span key={d} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-200">
                    💻 {d}
                  </span>
                ))}
              </div>

              {/* Boutons d'action principaux */}
              <div className="flex flex-wrap gap-4">
                {bourse.lien_officiel && (
                  <a 
                    href={bourse.lien_officiel} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl text-lg"
                  >
                    <span>🌐</span>
                    Site officiel
                  </a>
                )}
                {bourse.plateforme_depot && (
                  <a 
                    href={bourse.plateforme_depot} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white hover:bg-orange-50 text-orange-700 font-black px-6 py-4 rounded-xl border-2 border-orange-200 transition-all duration-200 hover:scale-105 text-lg"
                  >
                    <span>📝</span>
                    Plateforme de dépôt
                  </a>
                )}
                <BoutonAlerte bourseId={id} dejaSuivie={dejaSuivie} />
              </div>
            </div>

            {/* Banque d'épreuves */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-orange-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-orange-900 flex items-center gap-3">
                  <span className="text-3xl">📄</span>
                  Banque d'épreuves
                </h2>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                  {epreuves?.length ?? 0} disponibles
                </span>
              </div>
              
              {epreuves && epreuves.length > 0 ? (
                <div className="space-y-4">
                  {epreuves.map((ep: any) => {
                    const typeConfig = typeColors[ep.type] ?? typeColors.sujet
                    
                    return (
                      <div key={ep.id} className="group">
                        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${typeConfig.bg} ${typeConfig.border}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${typeConfig.bg} ${typeConfig.text} border-2 ${typeConfig.border}`}>
                              {typeIcons[ep.type] ?? '📄'}
                            </div>
                            <div>
                              <div className="font-black text-orange-900 text-lg mb-1">
                                {typeLabels[ep.type] ?? ep.type} {ep.annee}
                              </div>
                              <div className="text-sm text-orange-950/70">
                                {bourse.nom}
                              </div>
                            </div>
                          </div>
                          {ep.fichier_url && (
                            <a 
                              href={ep.fichier_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black transition-all duration-200 hover:scale-105 ${
                                ep.type === 'corrige' 
                                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                                  : 'bg-orange-600 hover:bg-orange-700 text-white'
                              }`}
                            >
                              <span>⬇️</span>
                              Télécharger
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-xl font-black text-orange-900 mb-2">
                    Pas encore d'épreuves disponibles
                  </h3>
                  <p className="text-orange-950/70 mb-6 max-w-md mx-auto">
                    Tu as des anciens sujets ? Contacte-nous pour les ajouter et aider la communauté !
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <span>✉️</span>
                    Nous contacter
                  </Link>
                </div>
              )}
            </div>

            {/* Alumni */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-orange-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-orange-900 flex items-center gap-3">
                  <span className="text-3xl">🎓</span>
                  Alumni FAST UAC
                </h2>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  {alumni?.length ?? 0} disponibles
                </span>
              </div>
              
              <p className="text-orange-950/70 text-lg mb-6">
                Anciens étudiants MIA qui ont obtenu cette bourse et acceptent de partager leur expérience.
              </p>
              
              {alumni && alumni.length > 0 ? (
                <div className="space-y-6">
                  {alumni.map((a: any) => (
                    <div key={a.id} className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 border border-orange-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center text-orange-800 font-black text-xl border-2 border-orange-400">
                            {a.profiles?.full_name?.charAt(0) ?? '?'}
                          </div>
                          <div>
                            <div className="font-black text-orange-900 text-xl mb-1">
                              {a.profiles?.full_name}
                            </div>
                            <div className="text-orange-950/70 font-medium">
                              {a.annee_obtention} • {a.universite_destination}, {a.pays_destination}
                            </div>
                            <div className="text-sm text-orange-600 mt-1">
                              {a.profiles?.filiere} • {a.profiles?.niveau}
                            </div>
                          </div>
                        </div>
                        {a.disponible_contact && (
                          <div className="flex flex-col items-center gap-2">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                              ✅ Disponible
                            </span>
                            <span className="text-xs text-green-600">Pour contacter</span>
                          </div>
                        )}
                      </div>
                      
                      {a.temoignage && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-100">
                          <p className="text-orange-950/70 italic leading-relaxed text-sm border-l-4 border-orange-400 pl-4">
                            "{a.temoignage}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="text-5xl mb-4">🤝</div>
                  <h3 className="text-xl font-black text-orange-900 mb-2">
                    Pas encore d'alumni pour cette bourse
                  </h3>
                  <p className="text-orange-950/70 mb-6 max-w-md mx-auto">
                    Sois le premier à partager ton expérience et aider les futurs étudiants !
                  </p>
                  <Link
                    href="/alumni/rejoindre"
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <span>🌟</span>
                    Rejoindre le réseau
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Deadline urgente */}
            <div className={`rounded-2xl p-6 border ${
              deadlineInfo.urgency === 'critical' || deadlineInfo.urgency === 'high'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-red-700'
                : 'bg-white border-orange-100'
            }`}>
              <h3 className={`font-black mb-4 flex items-center gap-2 ${
                deadlineInfo.urgency === 'critical' || deadlineInfo.urgency === 'high'
                  ? 'text-white'
                  : 'text-orange-900'
              }`}>
                <span className="text-2xl">⏰</span>
                Deadline
              </h3>
              
              <div className={`text-center mb-4 ${
                deadlineInfo.urgency === 'critical' || deadlineInfo.urgency === 'high'
                  ? 'text-white'
                  : 'text-orange-900'
              }`}>
                <div className="text-4xl font-black mb-2">
                  {deadlineInfo.icon}
                </div>
                <div className="text-lg font-bold">
                  {deadlineInfo.text}
                </div>
              </div>
              
              <div className={`space-y-3 ${
                deadlineInfo.urgency === 'critical' || deadlineInfo.urgency === 'high'
                  ? 'text-white/90'
                  : 'text-orange-950/70'
              }`}>
                <div className="flex justify-between">
                  <span>Ouverture</span>
                  <span className="font-bold">{formatDate(bourse.date_ouverture)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Clôture</span>
                  <span className="font-bold">{formatDate(bourse.date_cloture)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type dépôt</span>
                  <span className="font-bold">{bourse.plateforme_depot ? 'En ligne' : 'Physique'}</span>
                </div>
              </div>
            </div>

            {/* Alertes */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
              <h3 className="font-black text-orange-900 mb-2 flex items-center gap-2">
                <span className="text-xl">🔔</span>
                Ne rate pas la deadline
              </h3>
              <p className="text-orange-950/70 text-sm mb-4">
                Active les alertes pour recevoir une notification 30 jours et 7 jours avant la clôture.
              </p>
              <BoutonAlerte bourseId={id} dejaSuivie={dejaSuivie} />
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
              <h3 className="font-black text-orange-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Link
                  href="/bourses"
                  className="block w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-4 py-3 rounded-xl transition-all duration-200 text-center"
                >
                  🎓 Toutes les bourses
                </Link>
                <Link
                  href="/dashboard"
                  className="block w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold px-4 py-3 rounded-xl transition-all duration-200 text-center"
                >
                  🏠 Retour au dashboard
                </Link>
              </div>
            </div>

            {/* Partage */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-6 border border-orange-200">
              <h3 className="font-black text-orange-900 mb-2 flex items-center gap-2">
                <span className="text-xl">📢</span>
                Partager cette bourse
              </h3>
              <p className="text-orange-950/70 text-sm mb-4">
                Aide tes camarades à découvrir cette opportunité !
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-white hover:bg-orange-50 text-orange-700 font-semibold px-3 py-2 rounded-xl transition-all duration-200 text-sm">
                  📱 WhatsApp
                </button>
                <button className="flex-1 bg-white hover:bg-orange-50 text-orange-700 font-semibold px-3 py-2 rounded-xl transition-all duration-200 text-sm">
                  📧 Email
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}