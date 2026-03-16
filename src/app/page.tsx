import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bourses } = await supabase
    .from('bourses')
    .select('*')
    .eq('actif', true)
    .order('date_cloture', { ascending: true })
    .limit(3)

  const countryFlags: Record<string, string> = {
    'France': '🇫🇷', 'Maroc': '🇲🇦', 'Allemagne': '🇩🇪',
    'Chine': '🇨🇳', 'Panafrique': '🌍', 'International': '🌐',
    'Bénin': '🇧🇯', 'Canada': '🇨🇦', 'USA': '🇺🇸',
    'Royaume-Uni': '🇬🇧', 'Belgique': '🇧🇪',
  }

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const deadlineBadge = (days: number | null) => {
    if (days === null) return { color: 'bg-gray-100 text-gray-500', text: 'Ouvert' }
    if (days < 0) return { color: 'bg-gray-100 text-gray-500', text: 'Expirée' }
    if (days === 0) return { color: 'bg-red-50 text-red-600', text: "Aujourd hui" }
    if (days < 7) return { color: 'bg-red-50 text-red-600', text: `${days}j restants` }
    if (days < 30) return { color: 'bg-orange-50 text-orange-600', text: `${days}j restants` }
    return { color: 'bg-green-50 text-green-700', text: 'Ouverte' }
  }

  return (
    <div className="min-h-screen bg-orange-50">

      {/* HERO */}
      <section className="pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">

            {/* Gauche — contenu */}
            <div className="md:col-span-3 space-y-6">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full">
                Pour les étudiants MIA de la FAST UAC — Bénin 🇧🇯
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-orange-900 leading-tight tracking-tight">
                Transforme tes maths<br />
                <span className="text-orange-600">en métiers du digital</span>
              </h1>
              <p className="text-base md:text-lg text-orange-950/70 leading-relaxed max-w-xl">
                CRIO te montre comment chaque cours de ton cursus MIA s applique dans le monde professionnel.
                Parcours gratuits, bourses répertoriées, alumni disponibles.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {user ? (
                  <>
                    <Link href="/dashboard" className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5">
                      Mon dashboard
                    </Link>
                    <Link href="/parcours" className="inline-flex items-center justify-center bg-white border border-orange-200 hover:border-orange-400 text-orange-800 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5">
                      Voir les parcours
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/inscription" className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5">
                      Commencer gratuitement
                    </Link>
                    <Link href="/parcours" className="inline-flex items-center justify-center bg-white border border-orange-200 hover:border-orange-400 text-orange-800 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5">
                      Voir les parcours
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Droite — composition abstraite */}
            <div className="hidden md:flex md:col-span-2 items-center justify-center">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 rounded-full bg-orange-100/60" />
                <div className="absolute inset-8 rounded-full bg-orange-100/80" />
                <div className="absolute inset-16 rounded-full bg-orange-200/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="text-6xl">🦎</div>
                    <div className="text-sm font-semibold text-orange-700 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      CRIO
                    </div>
                  </div>
                </div>
                {/* Éléments flottants */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 text-xs font-medium text-orange-700 shadow-sm border border-orange-100">
                  {'</>'}  Web
                </div>
                <div className="absolute bottom-8 left-2 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 text-xs font-medium text-orange-700 shadow-sm border border-orange-100">
                  📊 Data
                </div>
                <div className="absolute top-16 left-0 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 text-xs font-medium text-orange-700 shadow-sm border border-orange-100">
                  🎓 Bourse
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-y border-orange-100 py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-orange-100">
            {[
              { val: '2', label: 'Parcours complets' },
              { val: '100%', label: 'Gratuit pour toujours' },
              { val: '30+', label: 'Matières mappées' },
              { val: '6', label: 'Bourses répertoriées' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center py-4 px-4">
                <div className="text-2xl md:text-4xl font-black text-orange-600 mb-1 tracking-tight">{val}</div>
                <div className="text-xs md:text-sm text-orange-700/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-orange-900 tracking-tight mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-orange-700/70 max-w-xl mx-auto">
              De l étudiant MIA au professionnel du digital — en 3 étapes simples
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { num: '01', emoji: '👤', title: 'Tu t inscris', desc: 'Crée ton compte gratuit en 30 secondes avec ta filière et ton niveau UAC' },
              { num: '02', emoji: '🎯', title: 'Tu choisis ton parcours', desc: 'Web Full Stack ou Data Science — taillés pour le cursus MIA de la FAST UAC' },
              { num: '03', emoji: '🚀', title: 'Tu apprends et évolues', desc: 'Leçons, exercices, bourses et alumni — tout au même endroit, gratuitement' },
            ].map(({ num, emoji, title, desc }) => (
              <div key={num} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-orange-100 hover:border-orange-300 hover:-translate-y-1 transition-all duration-200">
                <div className="text-xs font-black text-orange-300 tracking-widest mb-4">{num}</div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{emoji}</div>
                <h3 className="text-lg font-bold text-orange-900 mb-2">{title}</h3>
                <p className="text-sm text-orange-700/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARCOURS */}
      <section className="py-16 md:py-24 bg-white border-y border-orange-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-orange-900 tracking-tight mb-4">
              Les parcours disponibles
            </h2>
            <p className="text-orange-700/70 max-w-xl mx-auto">
              Chaque parcours est construit autour de ton cursus MIA — pas de contenu générique
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              {
                emoji: '🌐',
                title: 'Développement Web Full Stack',
                desc: 'De HTML jusqu au déploiement. Tes cours d algo et de bases de données servent directement ici.',
                tags: ['12 semaines', 'Débutant', 'Gratuit'],
                href: '/parcours/web-full-stack',
              },
              {
                emoji: '📊',
                title: 'Data Science & Intelligence Artificielle',
                desc: 'Python, ML, deep learning. Tes cours de stats et d algèbre linéaire prennent tout leur sens.',
                tags: ['14 semaines', 'Intermédiaire', 'Gratuit'],
                href: '/parcours/data-science',
              },
            ].map(({ emoji, title, desc, tags, href }) => (
              <div key={href} className="group bg-orange-50 rounded-2xl p-6 md:p-8 border border-orange-100 hover:border-orange-400 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                  {emoji}
                </div>
                <h3 className="text-xl font-bold text-orange-900 mb-3">{title}</h3>
                <p className="text-sm text-orange-700/70 mb-6 leading-relaxed">{desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map(tag => (
                    <span key={tag} className="bg-white text-orange-700 px-3 py-1 rounded-full text-xs font-medium border border-orange-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={href} className="block text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
                  Découvrir ce parcours
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PONT ACADÉMIQUE */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl text-3xl mb-6">🔗</div>
          <h2 className="text-2xl md:text-4xl font-black text-orange-900 tracking-tight mb-4">
            Tes maths valent de l or
          </h2>
          <p className="text-base md:text-lg text-orange-700/70 max-w-2xl mx-auto mb-10">
            Découvre comment chaque matière de ton cursus se transforme en compétence digitale recherchée
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 max-w-4xl mx-auto">
            {[
              { cours: 'Algèbre linéaire', metier: 'Machine Learning' },
              { cours: 'Probabilités & Stats', metier: 'Data Science' },
              { cours: 'Algorithmique', metier: 'Développement Backend' },
            ].map(({ cours, metier }) => (
              <div key={cours} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-orange-100 hover:border-orange-300 hover:-translate-y-1 transition-all duration-200">
                <div className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">Cours UAC</div>
                <div className="font-bold text-orange-900 mb-3">{cours}</div>
                <div className="text-orange-400 text-xl mb-3">↓</div>
                <div className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">Métier digital</div>
                <div className="font-bold text-orange-600">{metier}</div>
              </div>
            ))}
          </div>
          <Link href="/pont" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5">
            Explorer toutes les connexions
          </Link>
        </div>
      </section>

      {/* BOURSES */}
      <section className="py-16 md:py-24 bg-white border-y border-orange-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-orange-900 tracking-tight mb-4">
              Bourses à ne pas manquer
            </h2>
            <p className="text-orange-700/70 max-w-xl mx-auto">
              Toutes les opportunités taillées pour les profils MIA — avec guides et alumni
            </p>
          </div>
          {bourses && bourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
                {bourses.map((bourse: any) => {
                  const days = bourse.date_cloture ? getDaysLeft(bourse.date_cloture) : null
                  const badge = deadlineBadge(days)
                  const flag = countryFlags[bourse.pays] || '🌍'
                  return (
                    <Link key={bourse.id} href={`/bourses/${bourse.id}`}
                      className="group bg-orange-50 rounded-2xl p-5 border border-orange-100 hover:border-orange-300 hover:-translate-y-1 transition-all duration-200 block">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-2xl">{flag}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      <h3 className="font-bold text-orange-900 mb-1 text-sm group-hover:text-orange-600 transition-colors duration-200">
                        {bourse.nom}
                      </h3>
                      <p className="text-xs text-orange-600/70 mb-3">{bourse.organisme}</p>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        bourse.type === 'concours' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {bourse.type === 'concours' ? 'Concours' : 'Dossier'}
                      </span>
                    </Link>
                  )
                })}
              </div>
              <div className="text-center">
                <Link href="/bourses" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5">
                  Voir toutes les bourses
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-orange-600">Aucune bourse disponible pour le moment</div>
          )}
        </div>
      </section>

      {/* ALUMNI */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-orange-900 tracking-tight mb-4">
              Rejoins une communauté qui avance
            </h2>
            <p className="text-orange-700/70 max-w-xl mx-auto">
              Des anciens étudiants MIA qui ont obtenu des bourses et construisent leur carrière
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
            {[
              { initials: 'KA', name: 'Koffi Aho', bourse: 'Bourse Excellence Eiffel', dest: 'Master Data Science • France 🇫🇷', quote: 'CRIO m a ouvert les portes que je ne connaissais pas. Aujourd hui je suis à Paris.' },
              { initials: 'MA', name: 'Mariam Adé', bourse: 'Bourse Chevening', dest: 'ML Engineering • Royaume-Uni 🇬🇧', quote: 'Les ponts académiques m ont aidée à comprendre le lien avec mon cursus MIA.' },
              { initials: 'JD', name: 'Jean Dogba', bourse: 'Bourse Canada', dest: 'Web Development • Canada 🇨🇦', quote: 'Les parcours gratuits m ont donné les bases pour réussir mes entretiens.' },
            ].map(({ initials, name, bourse, dest, quote }) => (
              <div key={name} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 hover:border-orange-300 hover:-translate-y-1 transition-all duration-200">
                <div className="w-14 h-14 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-black text-lg mb-4">
                  {initials}
                </div>
                <h3 className="font-bold text-orange-900 mb-1">{name}</h3>
                <p className="text-xs text-orange-600 mb-1 font-medium">{bourse}</p>
                <p className="text-xs text-orange-500 mb-4">{dest}</p>
                <p className="text-sm text-orange-950/60 italic leading-relaxed">"{quote}"</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/alumni" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5">
              Voir les alumni
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 md:py-28 bg-orange-600">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Prêt à transformer<br />ton cursus en carrière ?
          </h2>
          <p className="text-lg md:text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Rejoins les étudiants MIA qui apprennent autrement
          </p>
          <Link href={user ? '/dashboard' : '/inscription'}
            className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-lg">
            {user ? 'Mon dashboard' : 'Créer mon compte gratuit'}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-orange-950 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="mb-10 pb-10 border-b border-white/10 text-center">
            <p className="text-orange-200/70 text-sm italic">
              "La seule plateforme qui transforme tes équations en opportunités de carrière."
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="text-xl font-black mb-2">CRIO</div>
              <p className="text-orange-200/60 text-sm leading-relaxed">
                Plateforme pour les étudiants MIA de la FAST UAC 🇧🇯
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-orange-200">Apprendre</h4>
              <div className="space-y-2">
                <Link href="/parcours" className="block text-orange-200/60 hover:text-white text-sm transition-colors duration-200">Parcours</Link>
                <Link href="/pont" className="block text-orange-200/60 hover:text-white text-sm transition-colors duration-200">Pont académique</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-orange-200">Opportunités</h4>
              <div className="space-y-2">
                <Link href="/bourses" className="block text-orange-200/60 hover:text-white text-sm transition-colors duration-200">Bourses</Link>
                <Link href="/alumni" className="block text-orange-200/60 hover:text-white text-sm transition-colors duration-200">Alumni</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-orange-200">Compte</h4>
              <div className="space-y-2">
                <Link href="/inscription" className="block text-orange-200/60 hover:text-white text-sm transition-colors duration-200">Inscription</Link>
                <Link href="/connexion" className="block text-orange-200/60 hover:text-white text-sm transition-colors duration-200">Connexion</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-orange-200/40 text-xs">
            © 2025 CRIO — Construit pour les étudiants de la FAST UAC 🇧🇯
          </div>
        </div>
      </footer>

    </div>
  )
}