import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-orange-100 text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Pour les étudiants MIA de la FAST UAC
        </div>
        <h1 className="text-5xl font-bold text-orange-900 mb-6 leading-tight">
          Transforme tes maths<br />en métiers du digital
        </h1>
        <p className="text-lg text-orange-700 max-w-2xl mx-auto mb-10">
          CRIO te montre comment ce que tu apprends à l université
          s applique directement dans le monde professionnel.
          Parcours gratuits, à ton rythme, taillés pour toi.
        </p>
        <div className="flex items-center justify-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-8 py-3 rounded-xl transition"
              >
                Mon dashboard
              </Link>
              <Link
                href="/parcours"
                className="bg-white hover:bg-orange-50 text-orange-800 font-medium px-8 py-3 rounded-xl border border-orange-200 transition"
              >
                Voir les parcours
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/inscription"
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-8 py-3 rounded-xl transition"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/parcours"
                className="bg-white hover:bg-orange-50 text-orange-800 font-medium px-8 py-3 rounded-xl border border-orange-200 transition"
              >
                Voir les parcours
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-orange-100 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-1">2</div>
            <div className="text-sm text-orange-700">Parcours disponibles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-1">100%</div>
            <div className="text-sm text-orange-700">Gratuit pour toujours</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-1">MIA</div>
            <div className="text-sm text-orange-700">Taillé pour ta filière</div>
          </div>
        </div>
      </section>

      {/* Parcours */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-orange-900 mb-2">Les parcours</h2>
        <p className="text-orange-700 mb-8">Choisis ton chemin vers le marché du travail digital</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl">🌐</span>
            </div>
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Développement Web Full Stack</h3>
            <p className="text-sm text-orange-700 mb-4">
              De HTML jusqu au déploiement. Crée des applications web complètes.
              Tes cours d algo et de bases de données servent directement ici.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-600">
              <span className="bg-orange-50 px-2 py-1 rounded-md">12 semaines</span>
              <span className="bg-orange-50 px-2 py-1 rounded-md">Débutant</span>
              <span className="bg-orange-50 px-2 py-1 rounded-md">Gratuit</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Data Science & Intelligence Artificielle</h3>
            <p className="text-sm text-orange-700 mb-4">
              Python, analyse de données, Machine Learning. Tes cours de stats
              et d algèbre linéaire prennent tout leur sens ici.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-600">
              <span className="bg-orange-50 px-2 py-1 rounded-md">14 semaines</span>
              <span className="bg-orange-50 px-2 py-1 rounded-md">Intermédiaire</span>
              <span className="bg-orange-50 px-2 py-1 rounded-md">Gratuit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pont académique */}
     {/* Pont académique teaser */}
      <section className="bg-white border-y border-orange-100 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-orange-900 mb-3">
            Tes maths valent de l or
          </h2>
          <p className="text-orange-700 max-w-xl mx-auto mb-6">
            Découvre comment chaque matière de ton cursus MIA se transforme en compétence digitale recherchée sur le marché.
          </p>
          <Link
            href="/pont"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-xl transition"
          >
            Explorer les connexions
          </Link>
        </div>
      </section>

      {/* CTA final — seulement si pas connecté */}
      {!user && (
        <section className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-orange-900 mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-orange-700 mb-8">
            Rejoins les étudiants MIA qui transforment leur cursus en carrière digitale.
          </p>
          <Link
            href="/inscription"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-8 py-3 rounded-xl transition"
          >
            Créer mon compte gratuit
          </Link>
        </section>
      )}

    </div>
  )
}