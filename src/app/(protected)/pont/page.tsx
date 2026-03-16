'use client'

import { useState } from 'react'
import Link from 'next/link'

const metiers = [
  {
    id: 'data',
    emoji: '📊',
    titre: 'Data Scientist',
    salaire: '2 000 — 8 000 €/mois',
    demande: 'Très forte',
    couleur: 'bg-purple-50 border-purple-100',
    couleurBadge: 'bg-purple-100 text-purple-700',
    couleurAccent: 'text-purple-600',
    description: 'Tu analyses des données massives pour aider les entreprises à prendre de meilleures décisions.',
    matieres: ['Probabilités & Stats', 'Algèbre linéaire', 'Méthodes numériques', 'Python par R'],
    outils: ['Python', 'Pandas', 'TensorFlow', 'SQL'],
    citation: 'Mes cours de stats à l UAC sont exactement ce que j utilise tous les jours chez Google.',
    alumni: 'Koffi A. — Data Scientist chez Google Paris',
  },
  {
    id: 'web',
    emoji: '🌐',
    titre: 'Développeur Full Stack',
    salaire: '1 500 — 6 000 €/mois',
    demande: 'Très forte',
    couleur: 'bg-blue-50 border-blue-100',
    couleurBadge: 'bg-blue-100 text-blue-700',
    couleurAccent: 'text-blue-600',
    description: 'Tu construis des applications web de A à Z — du design à la mise en production.',
    matieres: ['Algorithmique et langage C', 'Structure de données avancées', 'Bases de données', 'POO'],
    outils: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    citation: 'Mon cours d algo de L2 m a appris à penser comme un ingénieur. Le reste, je l ai appris en construisant.',
    alumni: 'Mariam D. — Lead Dev chez une startup à Berlin',
  },
  {
    id: 'ml',
    emoji: '🤖',
    titre: 'ML Engineer',
    salaire: '3 000 — 10 000 €/mois',
    demande: 'Explosive',
    couleur: 'bg-orange-50 border-orange-100',
    couleurBadge: 'bg-orange-100 text-orange-700',
    couleurAccent: 'text-orange-600',
    description: 'Tu conçois et déploies des modèles d intelligence artificielle qui tournent en production.',
    matieres: ['Algèbre multilinéaire', 'Equations différentielles', 'Probabilité au sens des mesures', 'Simulation numérique'],
    outils: ['PyTorch', 'TensorFlow', 'Kubernetes', 'MLflow'],
    citation: 'Les tenseurs de mon cours d algèbre multilinéaire — c est exactement les tenseurs de PyTorch.',
    alumni: 'Jean D. — ML Engineer chez Hugging Face',
  },
  {
    id: 'crypto',
    emoji: '🔐',
    titre: 'Expert Cybersécurité',
    salaire: '2 500 — 9 000 €/mois',
    demande: 'Forte',
    couleur: 'bg-red-50 border-red-100',
    couleurBadge: 'bg-red-100 text-red-700',
    couleurAccent: 'text-red-600',
    description: 'Tu protèges les systèmes informatiques contre les attaques et les failles de sécurité.',
    matieres: ['Algèbre commutative', 'Théorie des graphes', 'Structures algébriques', 'Architecture ordinateurs'],
    outils: ['Python', 'Wireshark', 'Metasploit', 'Linux'],
    citation: 'Le chiffrement RSA que j étudie aujourd hui protège des milliards de transactions bancaires.',
    alumni: 'Aïcha M. — Security Engineer chez Orange Cybersécurité',
  },
  {
    id: 'research',
    emoji: '🔬',
    titre: 'Chercheur en IA',
    salaire: '4 000 — 15 000 €/mois',
    demande: 'Forte',
    couleur: 'bg-teal-50 border-teal-100',
    couleurBadge: 'bg-teal-100 text-teal-700',
    couleurAccent: 'text-teal-600',
    description: 'Tu fais avancer la science en publiant des recherches qui repoussent les limites de l IA.',
    matieres: ['EDP', 'Topologie générale', 'Analyse vectorielle', 'Probabilité au sens des mesures'],
    outils: ['Python', 'LaTeX', 'MATLAB', 'JAX'],
    citation: 'Mon master en maths pures à l UAC m a donné la rigueur que 90% des ingénieurs n ont pas.',
    alumni: 'Ibrahim S. — PhD chez INRIA Paris',
  },
  {
    id: 'iot',
    emoji: '⚡',
    titre: 'Ingénieur IoT & Embarqué',
    salaire: '1 800 — 5 000 €/mois',
    demande: 'Croissante',
    couleur: 'bg-green-50 border-green-100',
    couleurBadge: 'bg-green-100 text-green-700',
    couleurAccent: 'text-green-600',
    description: 'Tu programmes des objets connectés — capteurs, drones, systèmes embarqués pour l industrie.',
    matieres: ['Electrocinétique', 'Mécanique du solide', 'Langage C++', 'Architecture ordinateurs'],
    outils: ['C/C++', 'Arduino', 'Raspberry Pi', 'MQTT'],
    citation: 'Mes cours de physique et de C++ sont exactement ce dont j avais besoin pour programmer des drones.',
    alumni: 'Franck K. — IoT Engineer chez Schneider Electric',
  },
]

const ponts = [
  { cours: 'Algèbre linéaire', metier: 'Machine Learning', detail: 'Régression, réseaux de neurones, transformations' },
  { cours: 'Probabilités & Stats', metier: 'Data Science', detail: 'Modèles prédictifs, A/B testing, inférence' },
  { cours: 'Algorithmique & C', metier: 'Développement', detail: 'Optimisation, complexité, performance' },
  { cours: 'Bases de données', metier: 'Full Stack', detail: 'SQL, schémas, requêtes avancées' },
  { cours: 'Algèbre commutative', metier: 'Cryptographie', detail: 'RSA, protocoles sécurisés, blockchain' },
  { cours: 'Théorie des graphes', metier: 'Réseaux sociaux & IA', detail: 'Recommandations, détection fraude, GPS' },
  { cours: 'EDP', metier: 'Simulation scientifique', detail: 'Modélisation climatique, IA physique' },
  { cours: 'Simulation numérique', metier: 'Data Science', detail: 'Prototypage, calcul scientifique' },
  { cours: 'POO', metier: 'Développement logiciel', detail: 'Architecture, APIs, frameworks modernes' },
  { cours: 'Méthodes numériques', metier: 'ML Engineer', detail: 'Optimisation numérique, gradient descent' },
  { cours: 'Analyse vectorielle', metier: 'Computer Vision', detail: 'Traitement image, réalité augmentée' },
  { cours: 'Electrocinétique', metier: 'IoT & Embarqué', detail: 'Circuits, capteurs, microcontrôleurs' },
]

export default function PontAcademiquePage() {
  const [metierActif, setMetierActif] = useState(metiers[0].id)
  const [showAllPonts, setShowAllPonts] = useState(false)

  const metier = metiers.find(m => m.id === metierActif) ?? metiers[0]
  const pontsAffiches = showAllPonts ? ponts : ponts.slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Hero inspirant */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-3 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-black mb-6">
            <span>🎓</span>
            <span>CURRICULUM MIA — FAST UAC</span>
            <span>🇧🇯</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-orange-900 mb-6 leading-tight">
            Tes maths ouvrent<br/>
            <span className="text-orange-600">toutes les portes</span>
          </h1>
          <p className="text-lg lg:text-xl text-orange-950/70 max-w-4xl mx-auto leading-relaxed">
            Ce que tu apprends à l'UAC n'est pas de la théorie abstraite.
            C'est le fondement de tous les métiers qui font tourner le monde digital.
            Voici les chemins qui s'offrent à toi.
          </p>
        </div>

        {/* Stats dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-purple-600 mb-2">6</div>
            <div className="text-sm text-orange-950/70 font-medium">Métiers porteurs</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-purple-600">Dans le digital</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-blue-600 mb-2">12+</div>
            <div className="text-sm text-orange-950/70 font-medium">Matières mappées</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-blue-600">Du L1 au L3</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-orange-600 mb-2">25+</div>
            <div className="text-sm text-orange-950/70 font-medium">Outils concrets</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-orange-600">Sur le marché</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="text-3xl lg:text-4xl font-black text-green-600 mb-2">100%</div>
            <div className="text-sm text-orange-950/70 font-medium">Applicabilité</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-xs text-green-600">Immédiate</div>
            </div>
          </div>
        </div>

        {/* Sélecteur de métier */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-orange-900 mb-4 tracking-tight">
            🎯 Explore les métiers possibles
          </h2>
          <div className="flex gap-3 flex-wrap">
            {metiers.map(m => (
              <button
                key={m.id}
                onClick={() => setMetierActif(m.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border hover:scale-105 ${
                  metierActif === m.id
                    ? 'bg-orange-600 text-white border-orange-600 shadow-lg'
                    : 'bg-white text-orange-700 border-orange-100 hover:border-orange-300'
                }`}
              >
                <span className="text-lg">{m.emoji}</span>
                <span className="hidden sm:inline">{m.titre}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card métier détaillée */}
        <div className={`rounded-2xl p-8 lg:p-10 border mb-12 ${metier.couleur} shadow-xl`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Gauche */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">{metier.emoji}</div>
                <div>
                  <h3 className="text-3xl font-black text-orange-900 tracking-tight mb-2">{metier.titre}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${metier.couleurBadge}`}>
                      Demande {metier.demande}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-orange-950/80 text-lg leading-relaxed mb-6">{metier.description}</p>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-orange-100">
                <div className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-2">
                  💰 Salaire moyen
                </div>
                <div className={`text-2xl lg:text-3xl font-black ${metier.couleurAccent}`}>
                  {metier.salaire}
                </div>
              </div>

              {/* Témoignage */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border-l-4 border-orange-400">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">💬</span>
                  <h4 className="font-black text-orange-900 text-lg">Témoignage alumni</h4>
                </div>
                <p className="text-orange-950/80 italic leading-relaxed text-lg mb-3">"{metier.citation}"</p>
                <p className="text-sm font-bold text-orange-600">{metier.alumni}</p>
              </div>
            </div>

            {/* Droite */}
            <div className="space-y-6">

              {/* Tes cours UAC */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-4">
                  📚 Tes cours UAC qui servent ici
                </div>
                <div className="space-y-3">
                  {metier.matieres.map(m => (
                    <div key={m} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full shrink-0"></div>
                      <span className="text-sm font-medium text-orange-900">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outils */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-4">
                  🛠️ Outils à maîtriser
                </div>
                <div className="flex flex-wrap gap-2">
                  {metier.outils.map(o => (
                    <span key={o} className="bg-orange-50 text-orange-700 text-sm font-bold px-3 py-2 rounded-xl border border-orange-200">
                      {o}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={metier.id === 'data' || metier.id === 'ml' || metier.id === 'research'
                  ? '/parcours/data-science'
                  : '/parcours/web-full-stack'}
                className="flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl text-lg"
              >
                <span>🚀</span>
                Commencer ce chemin
              </Link>
            </div>
          </div>
        </div>

        {/* Section ponts académiques */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-black text-orange-900 tracking-tight mb-4">
              🔗 Le tableau des connexions
            </h2>
            <p className="text-orange-950/70 max-w-3xl mx-auto text-lg leading-relaxed">
              Chaque matière que tu étudies est une compétence déguisée.
              Voici les connexions directes entre ton cursus et le marché.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mb-8">
            {pontsAffiches.map(({ cours, metier, detail }) => (
              <div key={cours}
                className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                      📖 Cours UAC
                    </div>
                    <div className="font-black text-orange-900 text-lg">{cours}</div>
                  </div>
                  <div className="text-orange-300 text-2xl px-3 shrink-0 group-hover:text-orange-500 transition-colors duration-200">
                    →
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                      💼 Métier
                    </div>
                    <div className="font-black text-orange-600 text-lg">{metier}</div>
                  </div>
                </div>
                <div className="text-sm text-orange-600/80 border-t border-orange-50 pt-3 leading-relaxed">
                  {detail}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowAllPonts(!showAllPonts)}
              className="inline-flex items-center gap-3 bg-white hover:bg-orange-50 text-orange-700 font-bold px-6 py-3 rounded-xl border border-orange-200 transition-all duration-200 hover:scale-105 text-lg"
            >
              {showAllPonts ? 'Voir moins ↑' : `Voir toutes les connexions (${ponts.length}) ↓`}
            </button>
          </div>
        </div>

        {/* Section inspirante finale */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-3xl p-10 lg:p-12 text-center">
          <div className="text-6xl mb-6">🌍</div>
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-6">
            Le monde a besoin de toi
          </h2>
          <p className="text-orange-100 max-w-4xl mx-auto mb-8 leading-relaxed text-lg">
            L'Afrique manque cruellement d'experts en data science, cybersécurité et développement.
            Tu es exactement à l'endroit qu'il faut, avec exactement les bases qu'il faut.
            Il ne manque que le chemin — CRIO est là pour ça.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/parcours"
              className="inline-flex items-center justify-center gap-3 bg-white text-orange-600 hover:bg-orange-50 font-black px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl text-lg"
            >
              <span>🎯</span>
              Choisir mon parcours
            </Link>
            <Link
              href="/bourses"
              className="inline-flex items-center justify-center gap-3 bg-orange-700 hover:bg-orange-800 text-white font-black px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl text-lg"
            >
              <span>🎓</span>
              Explorer les bourses
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}