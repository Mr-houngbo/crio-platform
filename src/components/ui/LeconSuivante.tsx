'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Props {
  leconId: string
  slug: string
  onComplete?: () => void
}

export default function LeconSuivante({ leconId, slug, onComplete }: Props) {
  const [nextLecon, setNextLecon] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fetchNextLecon = async () => {
      try {
        const supabase = createClient()
        
        // Étape 1: Récupérer la leçon actuelle avec son module
        const { data: currentLecon } = await supabase
          .from('lecons')
          .select('module_id, ordre')
          .eq('id', leconId)
          .single()

        if (!currentLecon) return

        // Étape 2: Récupérer les infos du module
        const { data: currentModule } = await supabase
          .from('modules')
          .select('parcours_id, ordre')
          .eq('id', currentLecon.module_id)
          .single()

        if (!currentModule) return

        // Étape 3: Chercher la leçon suivante dans le même module
        const { data: nextInModule } = await supabase
          .from('lecons')
          .select('*')
          .eq('module_id', currentLecon.module_id)
          .gt('ordre', currentLecon.ordre)
          .order('ordre', { ascending: true })
          .limit(1)
          .single()

        if (nextInModule) {
          setNextLecon(nextInModule)
        } else {
          // Étape 4: Chercher la première leçon du module suivant
          const { data: nextModules } = await supabase
            .from('modules')
            .select('*')
            .eq('parcours_id', currentModule.parcours_id)
            .gt('ordre', currentModule.ordre)
            .order('ordre', { ascending: true })
            .limit(1)

          if (nextModules && nextModules.length > 0) {
            const nextModule = nextModules[0]
            const { data: firstLeconNextModule } = await supabase
              .from('lecons')
              .select('*')
              .eq('module_id', nextModule.id)
              .order('ordre', { ascending: true })
              .limit(1)
              .single()

            setNextLecon(firstLeconNextModule)
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la leçon suivante:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNextLecon()
  }, [leconId])

  useEffect(() => {
    // Afficher le bouton après un délai pour ne pas perturber l'utilisateur
    const timer = setTimeout(() => {
      setShow(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading || !show || !nextLecon) return null

  const handleNextLecon = () => {
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <Link
      href={`/parcours/${slug}/lecon/${nextLecon.id}`}
      onClick={handleNextLecon}
      className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
    >
      <span className="flex items-center gap-2">
        <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">➜</span>
        Leçon suivante
      </span>
      <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
        {nextLecon.titre.length > 30 ? nextLecon.titre.substring(0, 30) + '...' : nextLecon.titre}
      </span>
    </Link>
  )
}
