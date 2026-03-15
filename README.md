# CRIO — Plateforme d'Apprentissage

> Transforme tes maths en métiers du digital.

Plateforme d'apprentissage gratuite et personnalisée pour les étudiants en Mathématiques-Informatique et Applications (MIA) de la Faculté des Sciences et Techniques (FAST) de l'Université d'Abomey-Calavi (UAC), Bénin.

---

## Pourquoi CRIO ?

Les étudiants MIA de la FAST UAC apprennent des mathématiques, de l'informatique et de la physique sans toujours savoir à quoi ces cours servent dans le monde professionnel. CRIO résout ce problème en :

- **Montrant les connexions** entre les cours universitaires et les métiers du digital
- **Proposant des parcours gratuits** taillés pour le marché de l'emploi africain
- **Centralisant les opportunités de bourses** avec guides, épreuves et témoignages d'alumni
- **Connectant les étudiants** avec des anciens qui ont réussi

---

## Fonctionnalités

### Parcours d'apprentissage
- Développement Web Full Stack (12 semaines)
- Data Science & Intelligence Artificielle (14 semaines)
- Contenu 100% gratuit, à ton rythme
- Vidéos YouTube intégrées, articles et exercices pratiques
- Système de progression avec suivi des leçons complétées

### Le Pont Académique
- Correspondance entre chaque matière du cursus MIA et un métier digital
- Couvre tout le curriculum L1, L2, L3
- Filtres par niveau et par métier
- Répond à la question : "A quoi servent mes cours ?"

### Section Bourses
- Répertoire des bourses taillées pour les profils MIA
- Guide de candidature étape par étape
- Banque d'épreuves pour les concours
- Alertes avant les deadlines (30j et 7j)
- Réseau alumni — anciens étudiants disponibles pour partager leur expérience

### Espace étudiant
- Dashboard personnalisé avec stats de progression
- Profil modifiable (filière, niveau)
- Suivi des bourses favorites

### Communauté Alumni
- Profils des anciens étudiants MIA ayant obtenu des bourses
- Témoignages et conseils
- Formulaire pour rejoindre en tant qu'alumni

---

## Stack Technique

| Couche | Technologie |
|--------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase (Auth, Database, Storage) |
| Déploiement | Vercel |
| Base de données | PostgreSQL via Supabase |

---

## Installation locale

### Prérequis
- Node.js v18+
- Compte Supabase
- Compte Vercel (pour le déploiement)

### 1. Cloner le repo
```bash
git clone https://github.com/Mr-houngbo/crio-platform.git
cd crio-platform
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_SUPABASE_URL=ton_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta_supabase_anon_key
```

### 4. Configurer la base de données

Dans Supabase → SQL Editor, exécute le script de setup disponible dans `/docs/supabase-setup.sql`.

### 5. Lancer le serveur de développement
```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

---

## Structure du projet
```
src/
├── app/
│   ├── (auth)/           # Pages publiques auth
│   │   ├── connexion/
│   │   └── inscription/
│   ├── (protected)/      # Pages nécessitant authentification
│   │   ├── dashboard/
│   │   ├── parcours/
│   │   ├── bourses/
│   │   ├── pont/
│   │   ├── alumni/
│   │   └── profil/
│   ├── actions/          # Server actions
│   └── api/              # Routes API
├── components/
│   ├── layout/           # Navbar, Footer
│   └── ui/               # Composants réutilisables
├── hooks/                # Hooks personnalisés
├── lib/supabase/         # Configuration Supabase
└── types/                # Types TypeScript
```

---

## Base de données

### Tables principales

| Table | Description |
|-------|-------------|
| `profiles` | Profils étudiants (filière, niveau) |
| `parcours` | Parcours d'apprentissage |
| `modules` | Chapitres d'un parcours |
| `lecons` | Unité atomique de contenu |
| `progression` | Suivi par étudiant |
| `pont_academique` | Liens cours UAC → métiers |
| `bourses` | Opportunités de bourses |
| `epreuves` | Banque de sujets |
| `alumni` | Profils alumni validés |
| `alertes_bourses` | Abonnements aux alertes |

---

## Déploiement

### Vercel (recommandé)

1. Connecte ton repo GitHub à Vercel
2. Ajoute les variables d'environnement dans Settings
3. Chaque push sur `master` déclenche un déploiement automatique

### Variables d'environnement requises
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Cible

- **Étudiants** : MIA L1, L2, L3 de la FAST UAC — Université d'Abomey-Calavi, Bénin
- **Extension prévue** : Filière PC (Physique-Chimie) en année 2
- **Marché visé** : Afrique francophone

---

## Roadmap

### V1 (actuelle)
- [x] Auth complète
- [x] 2 parcours avec leçons
- [x] Système de progression
- [x] Section bourses avec 6 opportunités
- [x] Pont Académique — curriculum MIA complet
- [x] Profil étudiant
- [x] Page alumni
- [x] Déploiement Vercel

### V2 (prochaine)
- [ ] Alertes email avant deadlines bourses
- [ ] Environnements virtuels (Replit embed)
- [ ] Cohortes — groupes de 15 étudiants
- [ ] Messagerie alumni → étudiant
- [ ] Filière PC

---

## Contribuer

CRIO est un projet open source au service des étudiants africains. Les contributions sont les bienvenues.

1. Fork le repo
2. Crée une branche `git checkout -b feature/ma-feature`
3. Commit `git commit -m 'feat: ma feature'`
4. Push `git push origin feature/ma-feature`
5. Ouvre une Pull Request

---

## Licence

MIT — libre d'utilisation, de modification et de distribution.

---

**Vibecoded avec passion pour les étudiants de la FAST UAC — Bénin** 🇧🇯
