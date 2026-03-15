import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AlumniPage() {
  const supabase = await createClient()

  const { data: alumni } = await supabase
    .from('alumni')
    .select('*, profiles(full_name, filiere, niveau), bourses(nom, pays)')
    .eq('valide', true)
    .order('annee_obtention', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-orange-900 mb-2">Alumni FAST UAC</h1>
          <p className="text-orange-700">
            Anciens etudiants MIA qui ont obtenu des bourses et acceptent de partager leur experience.
          </p>
        </div>
        <Link
          href="/alumni/rejoindre"
          className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition shrink-0"
        >
          Rejoindre en tant qu alumni
        </Link>
      </div>

      {alumni && alumni.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {alumni.map((a: any) => (
            <div key={a.id} className="bg-white rounded-2xl p-6 border border-orange-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-orange-900">{a.profiles?.full_name}</h3>
                  <p className="text-sm text-orange-500">
                    {a.profiles?.filiere} • {a.profiles?.niveau} • FAST UAC
                  </p>
                </div>
                {a.disponible_contact && (
                  <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                    Disponible
                  </span>
                )}
              </div>
              <div className="bg-orange-50 rounded-xl p-3 mb-3">
                <p className="text-xs text-orange-500 mb-1">Bourse obtenue</p>
                <p className="text-sm font-medium text-orange-900">{a.bourses?.nom}</p>
                <p className="text-xs text-orange-600">
                  {a.annee_obtention} • {a.universite_destination}, {a.pays_destination}
                </p>
              </div>
              {a.temoignage && (
                <p className="text-sm text-orange-700 italic leading-relaxed">
                  {a.temoignage}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🎓</div>
          <h2 className="text-xl font-semibold text-orange-900 mb-2">
            Sois le premier alumni
          </h2>
          <p className="text-orange-600 mb-6 text-sm">
            Tu as obtenu une bourse ? Partage ton experience et aide les prochains etudiants MIA.
          </p>
          <Link
            href="/alumni/rejoindre"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-xl transition"
          >
            Partager mon experience
          </Link>
        </div>
      )}
    </div>
  )
}
