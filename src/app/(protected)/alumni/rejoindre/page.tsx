'use client'

import { soumettreAlumni } from '@/app/actions/alumni'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function RejoindreAlumniPage() {
  const [bourses, setBourses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    bourse_id: '',
    annee_obtention: new Date().getFullYear(),
    pays_destination: '',
    universite_destination: '',
    temoignage: '',
    disponible_contact: true,
  })

  useEffect(() => {
    const fetchBourses = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('bourses').select('id, nom').eq('actif', true)
      setBourses(data ?? [])
      if (data && data.length > 0) setForm(f => ({ ...f, bourse_id: data[0].id }))
    }
    fetchBourses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await soumettreAlumni({
      ...form,
      annee_obtention: Number(form.annee_obtention),
    })
    if (result.success) setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-orange-900 mb-3">Merci !</h1>
        <p className="text-orange-700 mb-6">
          Ton profil alumni a ete soumis. Il sera visible apres validation.
        </p>
        <Link href="/alumni" className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition">
          Voir les alumni
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/alumni" className="text-sm text-orange-600 hover:underline mb-6 inline-block">
        Retour aux alumni
      </Link>
      <h1 className="text-3xl font-bold text-orange-900 mb-2">Rejoindre les alumni</h1>
      <p className="text-orange-700 mb-8">
        Partage ton experience et aide les prochains etudiants MIA a obtenir leur bourse.
      </p>

      <div className="bg-white rounded-2xl p-8 border border-orange-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-orange-900 mb-1">Bourse obtenue</label>
            <select
              value={form.bourse_id}
              onChange={e => setForm({ ...form, bourse_id: e.target.value })}
              required
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {bourses.map(b => (
                <option key={b.id} value={b.id}>{b.nom}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-orange-900 mb-1">Annee d obtention</label>
              <input
                type="number"
                value={form.annee_obtention}
                onChange={e => setForm({ ...form, annee_obtention: Number(e.target.value) })}
                min="2000"
                max="2030"
                required
                className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-900 mb-1">Pays de destination</label>
              <input
                type="text"
                value={form.pays_destination}
                onChange={e => setForm({ ...form, pays_destination: e.target.value })}
                required
                placeholder="ex: France"
                className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-900 mb-1">Universite de destination</label>
            <input
              type="text"
              value={form.universite_destination}
              onChange={e => setForm({ ...form, universite_destination: e.target.value })}
              required
              placeholder="ex: Universite Paris-Saclay"
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-900 mb-1">Ton temoignage</label>
            <textarea
              value={form.temoignage}
              onChange={e => setForm({ ...form, temoignage: e.target.value })}
              rows={4}
              required
              placeholder="Comment as-tu prepare ta candidature ? Quels conseils donnes-tu ?"
              className="w-full border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.disponible_contact}
              onChange={e => setForm({ ...form, disponible_contact: e.target.checked })}
              className="w-4 h-4 accent-orange-600"
            />
            <span className="text-sm text-orange-800">
              Je suis disponible pour repondre aux questions des etudiants
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Envoi en cours...' : 'Soumettre mon profil'}
          </button>
        </form>
      </div>
    </div>
  )
}