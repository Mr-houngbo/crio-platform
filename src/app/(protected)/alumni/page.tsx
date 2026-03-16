import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AlumniPage() {
  const supabase = await createClient()

  const { data: alumni } = await supabase
    .from('alumni')
    .select('*, profiles(full_name, filiere, niveau), bourses(nom, pays)')
    .eq('valide', true)
    .order('annee_obtention', { ascending: false })

  const paysFlags: Record<string, string> = {
    'France': '🇫🇷', 'Maroc': '🇲🇦', 'Allemagne': '🇩🇪',
    'Chine': '🇨🇳', 'Panafrique': '🌍', 'International': '🌐',
    'Bénin': '🇧🇯', 'Canada': '🇨🇦', 'USA': '🇺🇸',
    'Royaume-Uni': '🇬🇧', 'Belgique': '🇧🇪', 'Suisse': '🇨🇭',
    'Japon': '🇯🇵', 'Australie': '🇦🇺', 'Pays-Bas': '🇳🇱',
    'Italie': '🇮🇹', 'Espagne': '🇪🇸', 'Suède': '🇸🇪'
  }

  const getInitials = (fullName: string | null) => {
    if (!fullName) return '??'
    return fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  const getYearRange = () => {
    const currentYear = new Date().getFullYear()
    return `${currentYear - 5} - ${currentYear}`
  }

  const totalAlumni = alumni?.length ?? 0
  const disponiblesCount = alumni?.filter((a: any) => a.disponible_contact).length ?? 0
  const uniquePays = new Set(alumni?.map((a: any) => a.pays_destination)).size ?? 0
  const uniqueUniversites = new Set(alumni?.map((a: any) => a.universite_destination)).size ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header inspirant */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-black mb-4">
            <span>🎓</span>
            <span>RÉSEAU ALUMNI</span>
            <span>🌍</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-orange-900 mb-4 leading-tight">
            Alumni FAST UAC
          </h1>
          <p className="text-lg lg:text-xl text-orange-950/70 max-w-3xl mx-auto leading-relaxed">
            Anciens étudiants MIA qui ont obtenu des bourses et acceptent de partager leur expérience pour inspirer la prochaine génération.
          </p>
        </div>

        {/* Stats dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-orange-600 mb-2">{totalAlumni}</div>
            <div className="text-sm text-orange-950/70 font-medium">Alumni validés</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-orange-600">Actifs</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-green-600 mb-2">{disponiblesCount}</div>
            <div className="text-sm text-orange-950/70 font-medium">Disponibles</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-green-600">Pour contacter</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-blue-600 mb-2">{uniquePays}</div>
            <div className="text-sm text-orange-950/70 font-medium">Pays représentés</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-blue-600">À l'international</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-purple-600 mb-2">{uniqueUniversites}</div>
            <div className="text-sm text-orange-950/70 font-medium">Universités</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-purple-600">Prestigieuses</div>
            </div>
          </div>
        </div>

        {/* CTA rejoindre */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-8 mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-3xl">🎓</span>
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-black text-white mb-1">
                Tu as obtenu une bourse ?
              </h2>
              <p className="text-orange-100">
                Rejoins la communauté et inspire les prochains étudiants MIA
              </p>
            </div>
          </div>
          <Link
            href="/alumni/rejoindre"
            className="inline-flex items-center gap-3 bg-white text-orange-600 hover:bg-orange-50 font-black px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl"
          >
            <span>🌟</span>
            Rejoindre les alumni
          </Link>
        </div>

        {alumni && alumni.length > 0 ? (
          <>
            {/* Filtres rapides */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100 mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-black text-orange-900">Filtrer :</span>
                {[
                  { id: 'tous', label: 'Tous', count: totalAlumni, emoji: '🎓' },
                  { id: 'disponibles', label: 'Disponibles', count: disponiblesCount, emoji: '💬' },
                  { id: 'recent', label: 'Récents', count: alumni?.filter(a => a.annee_obtention >= 2020).length, emoji: '🆕' },
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

            {/* Grid des alumni */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {alumni.map((a: any) => {
                const flag = paysFlags[a.pays_destination ?? ''] ?? '🌍'
                const initials = getInitials(a.profiles?.full_name)
                const isRecent = a.annee_obtention >= 2020
                
                return (
                  <div key={a.id} className="group">
                    <div className="bg-white rounded-2xl border border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                      
                      {/* Header */}
                      <div className={`p-6 border-b ${isRecent ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-orange-50 to-orange-100'} border-orange-100`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black border-2 ${
                              isRecent 
                                ? 'bg-gradient-to-br from-green-200 to-emerald-300 text-green-800 border-green-400' 
                                : 'bg-gradient-to-br from-orange-200 to-orange-300 text-orange-800 border-orange-400'
                            }`}>
                              {initials}
                            </div>
                            <div>
                              <h3 className="font-black text-orange-900 text-lg mb-1 group-hover:text-orange-600 transition-colors">
                                {a.profiles?.full_name}
                              </h3>
                              <div className="text-sm text-orange-950/70 font-medium">
                                {a.profiles?.filiere} • {a.profiles?.niveau}
                              </div>
                              <div className="text-xs text-orange-600 mt-1">
                                FAST UAC • {a.annee_obtention}
                              </div>
                            </div>
                          </div>
                          {a.disponible_contact && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                                ✅ Disponible
                              </span>
                              <span className="text-xs text-green-600">Pour contacter</span>
                            </div>
                          )}
                        </div>
                        
                        {isRecent && (
                          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">
                            <span>🆕</span>
                            <span>Récent</span>
                          </div>
                        )}
                      </div>

                      {/* Bourse obtenue */}
                      <div className="p-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{flag}</span>
                            <div className="flex-1">
                              <div className="font-black text-orange-900 text-sm mb-1 truncate">
                                {a.bourses?.nom}
                              </div>
                              <div className="text-xs text-blue-700 font-medium">
                                {a.universite_destination}, {a.pays_destination}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-blue-600">
                            🎓 Bourse obtenue en {a.annee_obtention}
                          </div>
                        </div>

                        {/* Témoignage */}
                        {a.temoignage && (
                          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                            <div className="flex items-start gap-2 mb-2">
                              <span className="text-lg text-orange-600">💬</span>
                              <h4 className="font-black text-orange-900 text-sm">Témoignage</h4>
                            </div>
                            <p className="text-sm text-orange-950/70 italic leading-relaxed">
                              "{a.temoignage}"
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 mt-4">
                          {a.disponible_contact && (
                            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 text-sm">
                              💬 Contacter
                            </button>
                          )}
                          <button className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 font-black px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 text-sm">
                            📄 Voir le profil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Section inspiration */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-black mb-4">
                  🌟 Rejoins ce réseau d'excellence
                </h2>
                <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                  Chaque alumni partage son expérience pour aider les prochains étudiants MIA à réaliser leur rêve d'études à l'international.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/alumni/rejoindre"
                    className="inline-flex items-center gap-3 bg-white text-purple-600 hover:bg-purple-50 font-black px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <span>🎓</span>
                    Devenir alumni
                  </Link>
                  <Link
                    href="/bourses"
                    className="inline-flex items-center gap-3 bg-purple-700 hover:bg-purple-800 text-white font-black px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <span>🎯</span>
                    Voir les bourses
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty state inspirant */
          <div className="bg-white rounded-2xl p-16 border border-orange-100 text-center">
            <div className="text-6xl mb-6">🎓</div>
            <h2 className="text-3xl font-black text-orange-900 mb-4">
              Sois le premier alumni
            </h2>
            <p className="text-orange-950/70 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Tu as obtenu une bourse ? Partage ton expérience et aide les prochains étudiants MIA à réussir leur candidature. 
              Ton parcours peut inspirer toute une génération !
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/alumni/rejoindre"
                className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-black px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl text-lg"
              >
                <span>🌟</span>
                Partager mon expérience
              </Link>
              <Link
                href="/bourses"
                className="inline-flex items-center gap-3 bg-orange-50 hover:bg-orange-100 text-orange-700 font-black px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 text-lg"
              >
                <span>🎯</span>
                Voir les bourses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
