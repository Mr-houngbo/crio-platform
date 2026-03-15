'use client'

import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function FormulaireProfi({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    filiere: profile?.filiere ?? 'MIA',
    niveau: profile?.niveau ?? 'L1',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    const supabase = createClient()
    await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        filiere: form.filiere,
        niveau: form.niveau,
      })
      .eq('id', profile?.id ?? '')
    setLoading(false)
    setSuccess(true)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-orange-100">
      {success && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl mb-6">
          Profil mis à jour avec succes.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-orange-900 mb-1">Nom complet</label>
          <input
            type="text"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
            className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-orange-900 mb-1">Filiere</label>
            <select
              value={form.filiere}
              onChange={e => setForm({ ...form, filiere: e.target.value as 'MIA' | 'PC' })}
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="MIA">MIA</option>
              <option value="PC">PC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-orange-900 mb-1">Niveau</label>
            <select
              value={form.niveau}
              onChange={e => setForm({ ...form, niveau: e.target.value as 'L1' | 'L2' | 'L3' | 'Master' | 'Doctorat' })}
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
              <option value="Master">Master</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Sauvegarder'}
        </button>
      </form>
    </div>
  )
}