'use client'

import { useState } from 'react'

const curriculum = [
  // L1 Semestre 1
  {
    niveau: 'L1',
    code: 'ALI2201',
    matiere: 'Algèbre linéaire',
    metier: 'Data Science & IA',
    application: 'Régression linéaire, réseaux de neurones, transformations de données',
    outil: 'NumPy, TensorFlow',
    couleur: 'purple',
  },
  {
    niveau: 'L1',
    code: 'EGO2201',
    matiere: 'Electrocinétique et optique géométrique',
    metier: 'IoT & Systèmes embarqués',
    application: 'Circuits électroniques, capteurs, microcontrôleurs',
    outil: 'Arduino, Raspberry Pi',
    couleur: 'blue',
  },
  {
    niveau: 'L1',
    code: 'EIN2201',
    matiere: 'Environnement informatique',
    metier: 'Développement Web & DevOps',
    application: 'Bases Linux, ligne de commande, environnements de développement',
    outil: 'Linux, Git, VS Code',
    couleur: 'green',
  },
  {
    niveau: 'L1',
    code: 'FVR2201',
    matiere: "Fonction d'une variable réelle",
    metier: 'Data Science & IA',
    application: 'Fonctions de coût, optimisation, dérivées pour le gradient descent',
    outil: 'Python, Matplotlib',
    couleur: 'purple',
  },
  {
    niveau: 'L1',
    code: 'LTE2202',
    matiere: 'Logique et théorie des ensembles',
    metier: 'Développement & Bases de données',
    application: 'Requêtes SQL, conditions booléennes, structures de données',
    outil: 'SQL, PostgreSQL',
    couleur: 'green',
  },
  // L1 Semestre 2
  {
    niveau: 'L1',
    code: 'ATO2202',
    matiere: 'Architecture et technologie des ordinateurs',
    metier: 'DevOps & Cybersécurité',
    application: 'Compréhension du matériel, optimisation des performances, sécurité système',
    outil: 'Linux, Docker',
    couleur: 'red',
  },
  {
    niveau: 'L1',
    code: 'CED2202',
    matiere: 'Convergence et équations différentielles',
    metier: 'Data Science & Simulation',
    application: 'Modélisation de systèmes dynamiques, prévisions temporelles',
    outil: 'Python, SciPy',
    couleur: 'purple',
  },
  {
    niveau: 'L1',
    code: 'IMS2202',
    matiere: 'Introduction à la modélisation stochastique',
    metier: 'Data Science & Finance',
    application: 'Modèles probabilistes, simulations Monte Carlo, prédiction',
    outil: 'Python, R',
    couleur: 'purple',
  },
  {
    niveau: 'L1',
    code: 'MAD2201',
    matiere: "Méthode statistique d'analyse de données",
    metier: 'Data Analyst',
    application: 'Analyse exploratoire, visualisation, décisions basées sur les données',
    outil: 'Pandas, Tableau',
    couleur: 'purple',
  },
  {
    niveau: 'L1',
    code: 'SAA2202',
    matiere: 'Structures algébriques et arithmétique',
    metier: 'Cryptographie & Cybersécurité',
    application: 'Chiffrement RSA, protocoles de sécurité, blockchain',
    outil: 'Python Cryptography, OpenSSL',
    couleur: 'red',
  },
  // L2
  {
    niveau: 'L2',
    code: 'ALC2203',
    matiere: 'Algorithmique et langage C',
    metier: 'Développement logiciel',
    application: 'Structures de données, algorithmes de tri, optimisation de code',
    outil: 'C, Python, LeetCode',
    couleur: 'green',
  },
  {
    niveau: 'L2',
    code: 'ALM2203',
    matiere: 'Algèbre multilinéaire',
    metier: 'IA & Computer Vision',
    application: 'Traitement d images, tenseurs, convolutions pour le deep learning',
    outil: 'PyTorch, OpenCV',
    couleur: 'purple',
  },
  {
    niveau: 'L2',
    code: 'FPV2203',
    matiere: 'Fonction de plusieurs variables',
    metier: 'Machine Learning',
    application: 'Gradient descent, backpropagation, optimisation multivariée',
    outil: 'TensorFlow, PyTorch',
    couleur: 'purple',
  },
  {
    niveau: 'L2',
    code: 'ATR2204',
    matiere: 'Algorithme de tri et complexité',
    metier: 'Développement Backend',
    application: 'Optimisation des APIs, performances des applications, Big O notation',
    outil: 'Python, Node.js',
    couleur: 'green',
  },
  {
    niveau: 'L2',
    code: 'AVC2204',
    matiere: 'Analyse vectorielle et analyse complexe',
    metier: 'Traitement du signal & IA',
    application: 'Traitement audio/vidéo, transformée de Fourier, compression',
    outil: 'Python, NumPy, SciPy',
    couleur: 'blue',
  },
  {
    niveau: 'L2',
    code: 'EDS2304',
    matiere: 'Equations différentielles et systèmes dynamiques',
    metier: 'Simulation & Modélisation',
    application: 'Modélisation épidémique, systèmes de contrôle, IA pour la robotique',
    outil: 'Python, MATLAB',
    couleur: 'blue',
  },
  {
    niveau: 'L2',
    code: 'GAF2204',
    matiere: 'Géométrie affine',
    metier: 'Computer Vision & 3D',
    application: 'Rendu 3D, réalité augmentée, reconnaissance d objets',
    outil: 'OpenCV, Three.js, Unity',
    couleur: 'blue',
  },
  {
    niveau: 'L2',
    code: 'PSI2204',
    matiere: 'Probabilité et statistique',
    metier: 'Data Science & ML',
    application: 'Modèles bayésiens, tests A/B, évaluation de modèles ML',
    outil: 'Python, R, Scikit-learn',
    couleur: 'purple',
  },
  {
    niveau: 'L2',
    code: 'SDA2203',
    matiere: 'Structure de données avancées',
    metier: 'Développement & Bases de données',
    application: 'Arbres, graphes, hash tables — fondations de tout système performant',
    outil: 'Python, PostgreSQL, Redis',
    couleur: 'green',
  },
  // L3
  {
    niveau: 'L3',
    code: 'ALC2215',
    matiere: 'Algèbre commutative',
    metier: 'Cryptographie & Blockchain',
    application: 'Protocoles cryptographiques, smart contracts, sécurité des données',
    outil: 'Python, Solidity',
    couleur: 'red',
  },
  {
    niveau: 'L3',
    code: 'CPP2315',
    matiere: 'Langage C++',
    metier: 'Développement système & Jeux',
    application: 'Moteurs de jeux, logiciels haute performance, systèmes embarqués',
    outil: 'C++, Unreal Engine',
    couleur: 'green',
  },
  {
    niveau: 'L3',
    code: 'IMS2315',
    matiere: 'Modélisation stochastique par R',
    metier: 'Data Science & Finance',
    application: 'Analyse financière, prévisions, modèles de risque',
    outil: 'R, Python',
    couleur: 'purple',
  },
  {
    niveau: 'L3',
    code: 'ISL2215',
    matiere: 'Méthodes numériques',
    metier: 'Simulation & IA',
    application: 'Résolution d équations complexes, simulations physiques, IA scientifique',
    outil: 'Python, MATLAB, Julia',
    couleur: 'blue',
  },
  {
    niveau: 'L3',
    code: 'POO2315',
    matiere: 'Programmation orientée objet',
    metier: 'Développement Full Stack',
    application: 'Architecture logicielle, APIs, frameworks modernes',
    outil: 'Java, Python, TypeScript',
    couleur: 'green',
  },
  {
    niveau: 'L3',
    code: 'TGR2225',
    matiere: 'Théorie des graphes',
    metier: 'IA & Réseaux sociaux',
    application: 'Algorithmes de recommandation, GPS, détection de fraude',
    outil: 'Python NetworkX, Neo4j',
    couleur: 'purple',
  },
  {
    niveau: 'L3',
    code: 'EDP2215',
    matiere: 'Equations aux dérivées partielles',
    metier: 'Simulation scientifique & IA',
    application: 'Modélisation climatique, IA physique, simulations industrielles',
    outil: 'Python, FEniCS',
    couleur: 'blue',
  },
  {
    niveau: 'L3',
    code: 'PSM2216',
    matiere: 'Probabilité au sens des mesures',
    metier: 'Machine Learning avancé',
    application: 'Théorie profonde du ML, modèles génératifs, GANs',
    outil: 'PyTorch, TensorFlow',
    couleur: 'purple',
  },
  {
    niveau: 'L3',
    code: 'SNS2216',
    matiere: 'Simulation numérique par Scilab',
    metier: 'Data Science & Ingénierie',
    application: 'Prototypage rapide, visualisation scientifique, calcul numérique',
    outil: 'Scilab, Python, Julia',
    couleur: 'blue',
  },
]

const metiers = ['Tous', 'Data Science & IA', 'Développement', 'Cybersécurité', 'IoT & Systèmes', 'Computer Vision']

const couleurs: Record<string, { bg: string; text: string; border: string; badge: string; badgeText: string }> = {
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-100',
    badge: 'bg-purple-100',
    badgeText: 'text-purple-700',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-900',
    border: 'border-green-100',
    badge: 'bg-green-100',
    badgeText: 'text-green-700',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    border: 'border-blue-100',
    badge: 'bg-blue-100',
    badgeText: 'text-blue-700',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-900',
    border: 'border-red-100',
    badge: 'bg-red-100',
    badgeText: 'text-red-700',
  },
}

export default function PontAcademiquePage() {
  const [niveauActif, setNiveauActif] = useState<'Tous' | 'L1' | 'L2' | 'L3'>('Tous')
  const [metierActif, setMetierActif] = useState('Tous')
  const [recherche, setRecherche] = useState('')

  const filtre = curriculum.filter(item => {
    const matchNiveau = niveauActif === 'Tous' || item.niveau === niveauActif
    const matchMetier = metierActif === 'Tous' || item.metier.includes(metierActif.split(' ')[0])
    const matchRecherche = recherche === '' ||
      item.matiere.toLowerCase().includes(recherche.toLowerCase()) ||
      item.metier.toLowerCase().includes(recherche.toLowerCase()) ||
      item.application.toLowerCase().includes(recherche.toLowerCase())
    return matchNiveau && matchMetier && matchRecherche
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <div className="inline-block bg-orange-100 text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          Curriculum MIA — FAST UAC
        </div>
        <h1 className="text-3xl font-bold text-orange-900 mb-3">
          Tes maths valent de l or
        </h1>
        <p className="text-orange-700 max-w-2xl leading-relaxed">
          Chaque matière que tu étudies à l UAC ouvre une porte dans le monde digital.
          Voici exactement comment tes cours se transforment en compétences recherchées sur le marché.
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Matières mappées', val: curriculum.length },
          { label: 'Métiers couverts', val: '6+' },
          { label: 'Outils concrets', val: '20+' },
          { label: 'Niveaux', val: 'L1 → L3' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-orange-100 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{s.val}</div>
            <div className="text-xs text-orange-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl p-5 border border-orange-100 mb-8 space-y-4">
        <input
          type="text"
          placeholder="Recherche une matière, un métier, un outil..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-orange-500 font-medium">Niveau :</span>
          {(['Tous', 'L1', 'L2', 'L3'] as const).map(n => (
            <button
              key={n}
              onClick={() => setNiveauActif(n)}
              className={`text-sm px-3 py-1 rounded-full transition ${
                niveauActif === n
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-orange-500 font-medium">Métier :</span>
          {metiers.map(m => (
            <button
              key={m}
              onClick={() => setMetierActif(m)}
              className={`text-sm px-3 py-1 rounded-full transition ${
                metierActif === m
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats */}
      <div className="text-sm text-orange-500 mb-4">
        {filtre.length} matière{filtre.length > 1 ? 's' : ''} trouvée{filtre.length > 1 ? 's' : ''}
      </div>

      {/* Grille */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtre.map(item => {
          const c = couleurs[item.couleur]
          return (
            <div
              key={item.code}
              className={`rounded-2xl p-5 border ${c.bg} ${c.border}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono text-orange-400">{item.code}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge} ${c.badgeText}`}>
                  {item.niveau}
                </span>
              </div>
              <h3 className={`font-semibold mb-1 text-sm ${c.text}`}>{item.matiere}</h3>
              <div className="text-xs text-orange-500 mb-2 font-medium">
                {item.metier}
              </div>
              <p className="text-xs text-orange-700 leading-relaxed mb-3">
                {item.application}
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                {item.outil.split(', ').map(o => (
                  <span key={o} className="bg-white text-orange-600 text-xs px-2 py-0.5 rounded-md border border-orange-100">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}