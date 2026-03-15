'use client'

import { marquerLeconComplete } from '@/app/actions/progression'
import { useState } from 'react'

interface Props {
  leconId: string
  slug: string
  dejaCComplete: boolean
}

export default function BoutonCompletion({ leconId, slug, dejaCComplete }: Props) {
  const [complete, setComplete] = useState(dejaCComplete)
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
      <button
        disabled
        className="bg-green-600 text-white font-medium px-6 py-3 rounded-xl flex items-center gap-2 cursor-default"
      >
        <span>✓</span> Lecon completee
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-xl transition disabled:opacity-50"
    >
      {loading ? 'Enregistrement...' : 'Marquer comme complete'}
    </button>
  )
}