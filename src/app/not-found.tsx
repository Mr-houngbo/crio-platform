import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* Icône animé */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center text-6xl mx-auto shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-500">
            🤔
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse">
            ?
          </div>
        </div>

        {/* Message d'erreur */}
        <h1 className="text-4xl md:text-6xl font-black text-orange-900 mb-4 tracking-tight">
          404
        </h1>
        
        <h2 className="text-xl md:text-2xl font-bold text-orange-800 mb-4">
          Cette page a disparu
        </h2>
        
        <p className="text-orange-700 mb-8 max-w-md mx-auto leading-relaxed">
          La page que tu cherches n'existe pas ou a été déplacée. 
          Mais ne t'inquiète pas, tout ce dont tu as besoin est juste à portée de clic !
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            <span>🏠</span>
            Retour à l'accueil
          </Link>
          
          <Link
            href="/parcours"
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 hover:border-orange-400 text-orange-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5"
          >
            <span>📚</span>
            Voir les parcours
          </Link>
        </div>

        {/* Suggestions rapides */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
          <h3 className="text-lg font-bold text-orange-900 mb-4">
            Peut-être que tu cherchais...
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <Link
              href="/parcours"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors duration-200 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📊</span>
              <div>
                <div className="font-semibold text-orange-900 group-hover:text-orange-600">Parcours d'apprentissage</div>
                <div className="text-xs text-orange-600">Web Full Stack & Data Science</div>
              </div>
            </Link>
            
            <Link
              href="/bourses"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors duration-200 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">💰</span>
              <div>
                <div className="font-semibold text-orange-900 group-hover:text-orange-600">Bourses</div>
                <div className="text-xs text-orange-600">Opportunités pour étudiants MIA</div>
              </div>
            </Link>
            
            <Link
              href="/pont"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors duration-200 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🔗</span>
              <div>
                <div className="font-semibold text-orange-900 group-hover:text-orange-600">Pont académique</div>
                <div className="text-xs text-orange-600">Maths → Métiers digital</div>
              </div>
            </Link>
            
            <Link
              href="/alumni"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors duration-200 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🌟</span>
              <div>
                <div className="font-semibold text-orange-900 group-hover:text-orange-600">Alumni</div>
                <div className="text-xs text-orange-600">Réseau d'anciens étudiants</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Message d'aide */}
        <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <p className="text-sm text-orange-700">
            <span className="font-semibold">Besoin d'aide ?</span> Contacte-nous à{' '}
            <a 
              href="mailto:support@crio.bj" 
              className="text-orange-600 hover:text-orange-700 font-medium underline"
            >
              support@crio.bj
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}
