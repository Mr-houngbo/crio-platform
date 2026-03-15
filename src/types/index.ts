export type Filiere = 'MIA' | 'PC'
export type Niveau = 'L1' | 'L2' | 'L3' | 'Master' | 'Doctorat'

export interface Profile {
  id: string
  full_name: string | null
  filiere: Filiere | null
  niveau: Niveau | null
  universite: string
  avatar_url: string | null
  created_at: string
}

export interface Parcours {
  id: string
  slug: string
  titre: string
  description: string | null
  duree_semaines: number | null
  niveau: string | null
  image_url: string | null
  ordre: number
  actif: boolean
}

export interface Module {
  id: string
  parcours_id: string
  titre: string
  description: string | null
  ordre: number
}

export interface Lecon {
  id: string
  module_id: string
  titre: string
  type: 'video' | 'article' | 'exercice' | 'projet'
  contenu_url: string | null
  duree_minutes: number | null
  ordre: number
}

export interface Bourse {
  id: string
  nom: string
  organisme: string | null
  pays: string | null
  type: 'concours' | 'dossier' | 'mixte'
  niveau_cible: string[]
  domaines_eligibles: string[]
  date_ouverture: string | null
  date_cloture: string | null
  lien_officiel: string | null
  plateforme_depot: string | null
  description: string | null
  actif: boolean
}

export interface Alumni {
  id: string
  user_id: string
  bourse_id: string
  annee_obtention: number | null
  pays_destination: string | null
  universite_destination: string | null
  temoignage: string | null
  disponible_contact: boolean
  valide: boolean
}