import { createClient } from '@/lib/supabase/server'
import { Bourse } from '@/types'
import Link from 'next/link'

function getDaysLeft(dateStr: string | null) {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getDeadlineMessage(days: number | null): string {
  if (days === null) return "Date limite non spécifiée"
  if (days < 0) return "Expirée"
  if (days === 0) return "Dernier jour !"
  if (days === 1) return "Demain !"
  if (days <= 7) return `${days} jours restants`
  if (days <= 30) return `${days} jours restants`
  return "Date limite lointaine"
}

function getDeadlineColor(days: number | null): string {
  if (days === null) return "bg-gray-100 text-gray-600"
  if (days < 0) return "bg-gray-100 text-gray-500"
  if (days <= 3) return "bg-red-500 text-white font-black"
  if (days <= 7) return "bg-red-100 text-red-700 font-bold"
  if (days <= 30) return "bg-orange-100 text-orange-700"
  return "bg-green-100 text-green-700"
}

function getDeadlineIcon(days: number | null): string {
  if (days === null) return "📅"
  if (days < 0) return "❌"
  if (days <= 3) return "🔥"
  if (days <= 7) return "⚠️"
  if (days <= 30) return "⏰"
  return "✅"
}

const paysFlags: Record<string, string> = {
  'France': '🇫🇷', 'Maroc': '🇲🇦', 'Allemagne': '🇩🇪',
  'Chine': '🇨🇳', 'Panafrique': '🌍', 'International': '🌐',
  'Bénin': '🇧🇯', 'Canada': '🇨🇦', 'USA': '🇺🇸',
  'Royaume-Uni': '🇬🇧',
}

const typeIcons: Record<string, string> = {
  'concours': '🏆',
  'dossier': '📋',
  'mixte': '🎯'
}

const typeColors: Record<string, { bg: string, text: string, border: string }> = {
  'concours': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'dossier': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'mixte': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' }
}

export default async function BourseListePage() {
  const supabase = await createClient()

  // Récupération parallèle des données
  const [{ data: bourses }, { data: alertes }] = await Promise.all([
    supabase
      .from('bourses')
      .select('*')
      .eq('actif', true)
      .order('date_cloture', { ascending: true }),
    
    supabase
      .from('alertes_bourses')
      .select('bourse_id')
  ])

  const suiviesIds = new Set(alertes?.map((a: any) => a.bourse_id) ?? [])

  // Filtrage intelligent
  const ouvertes = bourses?.filter((b: Bourse) => {
    const days = getDaysLeft(b.date_cloture)
    return days === null || days >= 0
  }) ?? []

  const fermees = bourses?.filter((b: Bourse) => {
    const days = getDaysLeft(b.date_cloture)
    return days !== null && days < 0
  }) ?? []

  const urgentes = ouvertes.filter((b: Bourse) => {
    const days = getDaysLeft(b.date_cloture)
    return days !== null && days <= 7
  })

  const totalBourses = bourses?.length ?? 0
  const pourcentageSuivies = totalBourses > 0 ? Math.round((suiviesIds.size / totalBourses) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header inspirant */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-black mb-4">
            <span>🎓</span>
            <span>OPPORTUNITÉS MONDIALES</span>
            <span>🌍</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-orange-900 mb-4 leading-tight">
            Bourses &<br/>Opportunités
          </h1>
          <p className="text-lg lg:text-xl text-orange-950/70 max-w-3xl mx-auto leading-relaxed">
            Toutes les bourses taillées pour les étudiants MIA de la FAST UAC.
            Ne manque aucune deadline et transforme ton avenir ! 🚀
          </p>
        </div>

        {/* Stats dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-orange-600 mb-2">{totalBourses}</div>
            <div className="text-sm text-orange-950/70 font-medium">Bourses total</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-orange-600">Disponibles</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-green-600 mb-2">{ouvertes.length}</div>
            <div className="text-sm text-orange-950/70 font-medium">Ouvertes</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-green-600">Postuler maintenant</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-red-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-red-600 mb-2">{urgentes.length}</div>
            <div className="text-sm text-orange-950/70 font-medium">Urgentes</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-red-600">≤ 7 jours</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-purple-600 mb-2">{suiviesIds.size}</div>
            <div className="text-sm text-orange-950/70 font-medium">Suivies</div>
            <div className="mt-3">
              <div className="w-full bg-purple-100 rounded-full h-2">
                <div 
                  className="bg-purple-600 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${pourcentageSuivies}%` }}
                />
              </div>
              <div className="text-xs text-purple-600 mt-1">{pourcentageSuivies}%</div>
            </div>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="bg-white rounded-2xl p-6 border border-orange-100 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-black text-orange-900">Filtrer :</span>
            {[
              { id: 'tous', label: 'Toutes', count: totalBourses, emoji: '🌍' },
              { id: 'ouvertes', label: 'Ouvertes', count: ouvertes.length, emoji: '🟢' },
              { id: 'urgentes', label: 'Urgentes', count: urgentes.length, emoji: '🔥' },
              { id: 'concours', label: 'Concours', count: bourses?.filter(b => b.type === 'concours').length, emoji: '🏆' },
              { id: 'dossier', label: 'Dossier', count: bourses?.filter(b => b.type === 'dossier').length, emoji: '📋' },
              { id: 'suivies', label: 'Suivies', count: suiviesIds.size, emoji: '🔔' },
            ].map(filter => (
              <button
                key={filter.id}
                className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <span>{filter.emoji}</span>
                <span className="text-sm">{filter.label}</span>
                <span className="bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full text-xs font-black">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Alertes bourses urgentes */}
        {urgentes.length > 0 && (
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black mb-1">Alertes urgentes !</h2>
                  <p className="text-white/90">{urgentes.length} bourses ferment dans moins de 7 jours</p>
                </div>
              </div>
              <div className="text-3xl font-black animate-pulse">
                {urgentes.length}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {urgentes.slice(0, 4).map(bourse => {
                const days = getDaysLeft(bourse.date_cloture)
                const flag = paysFlags[bourse.pays ?? ''] ?? '🌍'
                const suivie = suiviesIds.has(bourse.id)
                
                return (
                  <Link
                    key={bourse.id}
                    href={`/bourses/${bourse.id}`}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-200 border border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{flag}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{bourse.nom}</h3>
                          {suivie && <span>🔔</span>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <span>{getDeadlineIcon(days)}</span>
                          <span>{getDeadlineMessage(days)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Bourses ouvertes */}
        {ouvertes.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl lg:text-3xl font-black text-orange-900 flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                Bourses ouvertes
                <span className="text-lg font-normal text-orange-950/70">({ouvertes.length})</span>
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {ouvertes.map((bourse: Bourse) => {
                const days = getDaysLeft(bourse.date_cloture)
                const suivie = suiviesIds.has(bourse.id)
                const flag = paysFlags[bourse.pays ?? ''] ?? '🌍'
                const typeConfig = typeColors[bourse.type] ?? typeColors.dossier
                
                return (
                  <Link
                    key={bourse.id}
                    href={`/bourses/${bourse.id}`}
                    className="group bg-white rounded-2xl border border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Header */}
                    <div className={`p-6 border-b ${typeConfig.bg} ${typeConfig.border}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                            {flag}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-black border ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}>
                                {typeIcons[bourse.type] ?? '📋'} {bourse.type === 'concours' ? 'CONCOURS' : bourse.type === 'dossier' ? 'DOSSIER' : 'MIXTE'}
                              </span>
                              {suivie && (
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">
                                  🔔 SUIVIE
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-black text-orange-900 group-hover:text-orange-600 transition-colors duration-200 leading-tight mb-2">
                              {bourse.nom}
                            </h3>
                            <p className="text-orange-950/70 font-medium">
                              {bourse.organisme} • {bourse.pays}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Deadline */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${getDeadlineColor(days)}`}>
                        <span>{getDeadlineIcon(days)}</span>
                        <span>{getDeadlineMessage(days)}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <p className="text-orange-950/70 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {bourse.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bourse.niveau_cible?.map(niveau => (
                          <span key={niveau} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-xs font-bold border border-orange-200">
                            {niveau}
                          </span>
                        ))}
                        {bourse.domaines_eligibles?.slice(0, 2).map(domaine => (
                          <span key={domaine} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-200">
                            {domaine}
                          </span>
                        ))}
                      </div>
                      
                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-orange-950/50">
                          {bourse.date_cloture && (
                            <span>Clôture : {new Date(bourse.date_cloture).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-orange-600 group-hover:text-orange-700 transition-colors duration-200">
                          <span className="text-sm font-black">Voir les détails</span>
                          <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Bourses fermées */}
        {fermees.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-600 flex items-center gap-3">
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                Bourses fermées
                <span className="text-sm font-normal text-gray-500">({fermees.length})</span>
              </h2>
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Voir tout
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
              {fermees.slice(0, 6).map((bourse: Bourse) => {
                const flag = paysFlags[bourse.pays ?? ''] ?? '🌍'
                
                return (
                  <Link
                    key={bourse.id}
                    href={`/bourses/${bourse.id}`}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl grayscale opacity-50">{flag}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-600 text-sm truncate mb-1">{bourse.nom}</h3>
                        <p className="text-xs text-gray-500">{bourse.organisme}</p>
                      </div>
                      <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
                        Expirée
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!bourses || bourses.length === 0) && (
          <div className="bg-white rounded-2xl p-16 border border-orange-100 text-center">
            <div className="text-6xl mb-6">🎓</div>
            <h3 className="text-2xl font-black text-orange-900 mb-4">Aucune bourse disponible</h3>
            <p className="text-orange-950/70 mb-8 max-w-md mx-auto">
              Reviens bientôt pour de nouvelles opportunités qui transformeront ton avenir !
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <span>🏠</span>
              Retour au dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}