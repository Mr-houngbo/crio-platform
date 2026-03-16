'use client'

import { marquerLeconComplete } from '@/app/actions/progression'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  leconId: string
  slug: string
  dejaComplete: boolean
  leconSuivanteId?: string
}

export default function BoutonCompletion({ leconId, slug, dejaComplete, leconSuivanteId }: Props) {
  const [complete, setComplete] = useState(dejaComplete)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    if (complete) {
      // Si déjà complété et qu'il y a une leçon suivante, naviguer vers elle
      if (leconSuivanteId) {
        router.push(`/parcours/${slug}/lecon/${leconSuivanteId}`)
      }
      return
    }

    setLoading(true)
    const result = await marquerLeconComplete(leconId, slug)
    
    if (result.success) {
      setComplete(true)
      
      // Si succès et qu'il y a une leçon suivante, rediriger après un court délai
      if (leconSuivanteId) {
        setTimeout(() => {
          router.push(`/parcours/${slug}/lecon/${leconSuivanteId}`)
        }, 800) // Délai pour voir l'animation de succès
      }
    }
    
    setLoading(false)
  }

  if (complete) {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-3 font-black px-6 py-3 rounded-xl transition-all duration-200 ${
          leconSuivanteId 
            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:scale-105' 
            : 'bg-green-600 text-white cursor-default'
        }`}
      >
        <span className="text-lg">✓</span>
        <span className="text-sm">{leconSuivanteId ? 'Leçon suivante →' : 'Terminé !'}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Enregistrement...</span>
        </>
      ) : (
        <>
          <span>🎯</span>
          <span>Terminer la leçon</span>
        </>
      )}
    </button>
  )
}