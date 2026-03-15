'use client'

import { toggleAlerteBourse } from '@/app/actions/alertes'
import { useState } from 'react'

interface Props {
  bourseId: string
  dejaSuivie: boolean
}

export default function BoutonAlerte({ bourseId, dejaSuivie }: Props) {
  const [active, setActive] = useState(dejaSuivie)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    const result = await toggleAlerteBourse(bourseId)
    if (result.active !== undefined) setActive(result.active)
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition disabled:opacity-50 ${
        active
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-white hover:bg-orange-50 text-orange-700 border border-orange-200'
      }`}
    >
      <span>{active ? '🔔' : '🔕'}</span>
      {loading ? 'En cours...' : active ? 'Alerte active' : 'Activer alerte'}
    </button>
  )
}