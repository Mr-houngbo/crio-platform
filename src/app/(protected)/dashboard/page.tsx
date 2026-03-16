import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Profile, Parcours, Module, Lecon, Bourse } from '@/types'

// Types pour les données du dashboard
interface DashboardData {
  profile: Profile | null
  parcoursDisponibles: Parcours[]
  parcoursEnCours: Parcours | null
  progressionParcours: {
    totalLecons: number
    leconsCompletees: number
    pourcentage: number
    derniereLecon?: Lecon
  } | null
  statistiques: {
    leconsCompletees: number
    parcoursEnCoursCount: number
    boursesSuivies: number
    xpTotal: number
    streak: number
  }
  boursesRecentes: Bourse[]
  achievements: {
    id: string
    titre: string
    icone: string
    obtenu: boolean
    description?: string
  }[]
  activiteRecente: {
    lecon: Lecon
    completed_at: string
  }[]
}

// Fonctions utilitaires
function calculerStreak(progressions: any[]): number {
  if (!progressions.length) return 0
  
  const dates = progressions
    .map(p => new Date(p.completed_at).toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  
  let streak = 0
  const today = new Date().toDateString()
  
  for (let i = 0; i < dates.length; i++) {
    const currentDate = new Date(dates[i])
    const expectedDate = new Date()
    expectedDate.setDate(expectedDate.getDate() - i)
    
    if (currentDate.toDateString() === expectedDate.toDateString()) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

function formaterDateRelative(date: string): string {
  const maintenant = new Date()
  const dateLecon = new Date(date)
  const diffMs = maintenant.getTime() - dateLecon.getTime()
  const diffHeures = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHeures < 1) return "il y a quelques minutes"
  if (diffHeures < 24) return `il y a ${diffHeures}h`
  const diffJours = Math.floor(diffHeures / 24)
  if (diffJours < 7) return `il y a ${diffJours}j`
  return `il y a ${Math.floor(diffJours / 7)} sem`
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return "Commence ton parcours !"
  if (streak < 3) return "Bon début !"
  if (streak < 7) return "Continue comme ça !"
  if (streak < 14) return "Tu es en feu !"
  if (streak < 30) return "Incroyable motivation !"
  return "Légende !"
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Vérification authentification
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  // Récupération parallèle de toutes les données
  const [
    profileData,
    parcoursData,
    modulesData,
    leconsData,
    progressionsData,
    alertesData,
    boursesData
  ] = await Promise.all([
    // Profil utilisateur
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    
    // Parcours disponibles
    supabase
      .from('parcours')
      .select('*')
      .eq('actif', true)
      .order('ordre'),
    
    // Modules
    supabase
      .from('modules')
      .select('*')
      .in('parcours_id', (await supabase.from('parcours').select('id').eq('actif', true)).data?.map(p => p.id) || []),
    
    // Leçons
    supabase
      .from('lecons')
      .select('*')
      .in('module_id', (await supabase.from('modules').select('id')).data?.map(m => m.id) || [])
      .order('ordre'),
    
    // Progressions utilisateur
    supabase
      .from('progression')
      .select('*')
      .eq('user_id', user.id)
      .eq('completee', true)
      .order('completed_at', { ascending: false }),
    
    // Alertes bourses
    supabase
      .from('alertes_bourses')
      .select('*')
      .eq('user_id', user.id),
    
    // Bourses récentes
    supabase
      .from('bourses')
      .select('*')
      .eq('actif', true)
      .order('date_cloture', { ascending: false })
      .limit(3)
  ])

  const profile = profileData.data
  const parcoursDisponibles = parcoursData.data || []
  const modules = modulesData.data || []
  const lecons = leconsData.data || []
  const progressions = progressionsData.data || []
  const alertes = alertesData.data || []
  const boursesRecentes = boursesData.data || []

  // Calculs des statistiques
  const leconsCompletees = progressions.length
  const xpTotal = leconsCompletees * 10
  const streak = calculerStreak(progressions)
  const boursesSuivies = alertes.length

  // Déterminer le parcours en cours
  const progressionParParcours = new Map<string, number>()
  progressions.forEach(prog => {
    const lecon = lecons.find(l => l.id === prog.lecon_id)
    if (lecon) {
      const module = modules.find(m => m.id === lecon.module_id)
      if (module) {
        const parcoursId = module.parcours_id
        progressionParParcours.set(parcoursId, (progressionParParcours.get(parcoursId) || 0) + 1)
      }
    }
  })

  const parcoursEnCoursId = Array.from(progressionParParcours.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  const parcoursEnCours = parcoursDisponibles.find(p => p.id === parcoursEnCoursId)

  // Calculer la progression du parcours en cours
  let progressionParcours = null
  if (parcoursEnCours) {
    const parcoursModules = modules.filter(m => m.parcours_id === parcoursEnCours.id)
    const parcoursLecons = lecons.filter(l => parcoursModules.some(m => m.id === l.module_id))
    const leconsCompleteesParcours = progressions.filter(prog => 
      parcoursLecons.some(l => l.id === prog.lecon_id)
    ).length
    
    progressionParcours = {
      totalLecons: parcoursLecons.length,
      leconsCompletees: leconsCompleteesParcours,
      pourcentage: Math.round((leconsCompleteesParcours / parcoursLecons.length) * 100),
      derniereLecon: lecons.find(l => progressions[0]?.lecon_id === l.id)
    }
  }

  // Activité récente
  const activiteRecente = progressions.slice(0, 3).map(prog => ({
    lecon: lecons.find(l => l.id === prog.lecon_id)!,
    completed_at: prog.completed_at
  })).filter(item => item.lecon)

  // Badges/Achievements
  const achievements = [
    {
      id: 'premier-pas',
      titre: 'Premier pas',
      icone: '🎯',
      obtenu: !!profile,
      description: 'Inscription completed'
    },
    {
      id: 'premiere-lecon',
      titre: 'Première leçon',
      icone: '✅',
      obtenu: leconsCompletees >= 1,
      description: '1ère leçon complétée'
    },
    {
      id: 'en-feu',
      titre: 'En feu',
      icone: '🔥',
      obtenu: streak >= 3,
      description: '3 leçons d\'affilée'
    },
    {
      id: 'assidu',
      titre: 'Assidu',
      icone: '📚',
      obtenu: leconsCompletees >= 10,
      description: '10 leçons complétées'
    },
    {
      id: 'champion',
      titre: 'Champion',
      icone: '🏆',
      obtenu: !!progressionParcours && progressionParcours.pourcentage >= 100,
      description: 'Parcours complet'
    },
    {
      id: 'boursier',
      titre: 'Boursier',
      icone: '🎓',
      obtenu: boursesSuivies >= 1,
      description: 'Alerte bourse activée'
    }
  ]

  const prenom = profile?.full_name?.split(' ')[0] ?? 'Etudiant'
  const parcoursEnCoursCount = progressionParParcours.size

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Grid principal : contenu + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Colonne principale (70% sur desktop) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Salutation personnalisée */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-orange-900 mb-2">
                    Bonjour, {prenom} 👋
                  </h1>
                  <p className="text-orange-950/70">
                    {profile?.filiere && profile?.niveau
                      ? `${profile.filiere} • ${profile.niveau} • FAST UAC`
                      : 'FAST UAC'}
                  </p>
                </div>
                {streak > 0 && (
                  <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-semibold">
                    🔥 {streak} jours consécutifs
                  </div>
                )}
              </div>
            </div>

            {/* Continuer mon parcours (card hero) */}
            {progressionParcours ? (
              <Link 
                href={`/parcours/${parcoursEnCours?.slug}`}
                className="block bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-2xl p-6 hover:from-orange-700 hover:to-orange-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-black mb-2">Continuer mon parcours</h2>
                    <p className="text-orange-100 text-lg">{parcoursEnCours?.titre}</p>
                  </div>
                  <div className="text-4xl">🚀</div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression</span>
                    <span>{progressionParcours.leconsCompletees}/{progressionParcours.totalLecons} leçons</span>
                  </div>
                  <div className="w-full bg-orange-800/30 rounded-full h-3">
                    <div 
                      className="bg-white rounded-full h-3 transition-all duration-500"
                      style={{ width: `${progressionParcours.pourcentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-black">{progressionParcours.pourcentage}%</p>
                    <p className="text-orange-100 text-sm">
                      {progressionParcours.derniereLecon 
                        ? `Dernière leçon: ${progressionParcours.derniereLecon.titre}`
                        : 'Commence maintenant !'
                      }
                    </p>
                  </div>
                  <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-black hover:bg-orange-50 transition">
                    Continuer →
                  </button>
                </div>
              </Link>
            ) : (
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-2xl p-6">
                <h2 className="text-2xl font-black mb-4">Commence ton parcours</h2>
                <p className="text-orange-100 mb-6">
                  Choisis un parcours et commence ton adventure dans le digital !
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {parcoursDisponibles.slice(0, 2).map(parcours => (
                    <Link
                      key={parcours.id}
                      href={`/parcours/${parcours.slug}`}
                      className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 hover:bg-white/20 transition"
                    >
                      <h3 className="font-semibold mb-2">{parcours.titre}</h3>
                      <p className="text-orange-100 text-sm">
                        {parcours.duree_semaines} semaines • {parcours.niveau}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mes statistiques */}
            <div>
              <h2 className="text-xl font-black text-orange-900 mb-4">Mes statistiques</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                  <div className="text-3xl font-black text-orange-600 mb-2">{leconsCompletees}</div>
                  <div className="text-orange-950/70 text-sm font-medium">Leçons complétées</div>
                  {leconsCompletees > 0 && (
                    <div className="mt-3 text-xs text-green-600 font-medium">+{leconsCompletees * 10} XP</div>
                  )}
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                  <div className="text-3xl font-black text-orange-600 mb-2">{parcoursEnCoursCount}</div>
                  <div className="text-orange-950/70 text-sm font-medium">Parcours en cours</div>
                  {parcoursEnCoursCount > 0 && (
                    <div className="mt-3 text-xs text-orange-600 font-medium">Continue !</div>
                  )}
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                  <div className="text-3xl font-black text-orange-600 mb-2">{boursesSuivies}</div>
                  <div className="text-orange-950/70 text-sm font-medium">Bourses suivies</div>
                  {boursesSuivies > 0 && (
                    <div className="mt-3 text-xs text-green-600 font-medium">Alertes actives</div>
                  )}
                </div>
              </div>
            </div>

            {/* Explorer les parcours */}
            <div>
              <h2 className="text-xl font-black text-orange-900 mb-4">Explorer les parcours</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {parcoursDisponibles.map(parcours => {
                  const estEnCours = parcours.id === parcoursEnCoursId
                  const parcoursModules = modules.filter(m => m.parcours_id === parcours.id)
                  const parcoursLecons = lecons.filter(l => parcoursModules.some(m => m.id === l.module_id))
                  const leconsCompleteesCeParcours = progressions.filter(prog => 
                    parcoursLecons.some(l => l.id === prog.lecon_id)
                  ).length
                  const pourcentage = Math.round((leconsCompleteesCeParcours / parcoursLecons.length) * 100)
                  
                  return (
                    <Link
                      key={parcours.id}
                      href={`/parcours/${parcours.slug}`}
                      className="bg-white rounded-2xl p-6 border border-orange-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl mb-2">
                          {parcours.slug === 'web-full-stack' ? '🌐' : 
                           parcours.slug === 'data-science' ? '📊' : '🚀'}
                        </div>
                        {estEnCours && (
                          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-lg font-medium">
                            En cours
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-black text-orange-900 mb-2">{parcours.titre}</h3>
                      <p className="text-orange-950/70 text-sm mb-4">
                        {parcours.duree_semaines} semaines • {parcours.niveau}
                      </p>
                      
                      {leconsCompleteesCeParcours > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-orange-600">Progression</span>
                            <span className="text-orange-600">{pourcentage}%</span>
                          </div>
                          <div className="w-full bg-orange-100 rounded-full h-2">
                            <div 
                              className="bg-orange-600 rounded-full h-2 transition-all duration-500"
                              style={{ width: `${pourcentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <button className="w-full bg-orange-600 text-white py-2 rounded-xl font-medium hover:bg-orange-700 transition">
                        {leconsCompleteesCeParcours > 0 ? 'Continuer' : 'Commencer'}
                      </button>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Bourses à ne pas manquer */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-orange-900">Bourses à ne pas manquer</h2>
                <Link href="/bourses" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                  Voir toutes →
                </Link>
              </div>
              
              {boursesRecentes.length > 0 ? (
                <div className="space-y-3">
                  {boursesRecentes.map(bourse => {
                    const deadline = new Date(bourse.date_cloture!)
                    const joursRestants = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    const estUrgent = joursRestants <= 7
                    const estSuivi = alertes.some(a => a.bourse_id === bourse.id)
                    
                    return (
                      <div key={bourse.id} className="bg-white rounded-2xl p-4 border border-orange-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">
                                {bourse.pays === 'France' ? '🇫🇷' : 
                                 bourse.pays === 'Canada' ? '🇨🇦' : 
                                 bourse.pays === 'USA' ? '🇺🇸' : '🌍'}
                              </span>
                              <h3 className="font-black text-orange-900">{bourse.nom}</h3>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-orange-950/70">
                              <span>{bourse.organisme}</span>
                              <span>•</span>
                              <span>{bourse.type}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                              estUrgent 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {joursRestants <= 0 ? 'Expirée' : 
                               joursRestants === 1 ? 'Demain' : 
                               `${joursRestants} jours`}
                            </span>
                            
                            {estSuivi ? (
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-medium">
                                ✓ Suivi
                              </span>
                            ) : (
                              <button className="bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-orange-700 transition">
                                Activer alerte
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border border-orange-100 text-center">
                  <div className="text-4xl mb-4">🎓</div>
                  <p className="text-orange-950/70 mb-4">
                    Découvre les bourses disponibles pour ne manquer aucune opportunité.
                  </p>
                  <Link
                    href="/bourses"
                    className="inline-block bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-700 transition"
                  >
                    Explorer les bourses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar droite (30% sur desktop) */}
          <div className="space-y-6">
            
            {/* Progression globale */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100">
              <h3 className="font-black text-orange-900 mb-4">Progression globale</h3>
              
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  {/* Cercle de progression CSS */}
                  <div className="absolute inset-0 rounded-full border-8 border-orange-100"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-orange-600 border-t-transparent border-r-transparent transition-all duration-500"
                    style={{
                      transform: `rotate(${(leconsCompletees / Math.max(lecons.length, 1)) * 360 - 45}deg)`
                    }}
                  ></div>
                  <div className="absolute inset-2 bg-orange-50 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-orange-600">
                      {Math.round((leconsCompletees / Math.max(lecons.length, 1)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-center text-orange-950/70 text-sm">
                {leconsCompletees} leçons sur {lecons.length} complétées
              </p>
            </div>

            {/* Streak & XP */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100">
              <h3 className="font-black text-orange-900 mb-4">Performance</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <span className="font-medium text-orange-950/70">Streak</span>
                  </div>
                  <span className="font-black text-orange-600 text-xl">{streak} jours</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <span className="font-medium text-orange-950/70">Points XP</span>
                  </div>
                  <span className="font-black text-orange-600 text-xl">{xpTotal}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-orange-50 rounded-xl">
                <p className="text-orange-700 text-sm font-medium text-center">
                  {getStreakMessage(streak)}
                </p>
              </div>
            </div>

            {/* Achievements / Badges */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100">
              <h3 className="font-black text-orange-900 mb-4">Mes badges</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`aspect-square rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-200 ${
                      achievement.obtenu 
                        ? 'bg-orange-100 text-orange-700 hover:scale-105' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    title={achievement.description}
                  >
                    <span className="text-2xl mb-1">
                      {achievement.obtenu ? achievement.icone : '🔒'}
                    </span>
                    <span className="text-xs font-medium leading-tight">
                      {achievement.titre}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-2xl p-6 border border-orange-100">
              <h3 className="font-black text-orange-900 mb-4">Activité récente</h3>
              
              {activiteRecente.length > 0 ? (
                <div className="space-y-3">
                  {activiteRecente.map((activite, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">
                          {activite.lecon.type === 'video' ? '🎥' :
                           activite.lecon.type === 'article' ? '📄' :
                           activite.lecon.type === 'exercice' ? '💪' : '🚀'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-orange-950 truncate">
                          {activite.lecon.titre}
                        </p>
                        <p className="text-xs text-orange-950/70">
                          {formaterDateRelative(activite.completed_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-orange-950/70 text-sm">
                    Commence ton parcours pour voir ton activité ici !
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}