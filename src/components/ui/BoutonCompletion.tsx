'use client'

import { marquerLeconComplete } from '@/app/actions/progression'
import { useState } from 'react'

interface Props {
  leconId: string
  slug: string
  dejaComplete: boolean
}

export default function BoutonCompletion({ leconId, slug, dejaComplete }: Props) {
  const [complete, setComplete] = useState(dejaComplete)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (complete) return
    setLoading(true)
    const result = await marquerLeconComplete(leconId, slug)
    if (result.success) {
      setComplete(true)
    }
    setLoading(false)
  }

  if (complete) {
    return (
      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg cursor-default">
        <span className="text-xl">✅</span>
        <span>Leçon complétée</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Enregistrement...</span>
        </>
      ) : (
        <>
          <span className="text-xl">🎯</span>
          <span>Marquer comme complétée</span>
        </>
      )}
    </button>
  )
}