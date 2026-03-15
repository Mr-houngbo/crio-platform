import { createClient } from '@/lib/supabase/server'
import FormulaireProfi from '@/components/ui/FormulaireProfi'
import { redirect } from 'next/navigation'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-orange-900 mb-2">Mon profil</h1>
      <p className="text-orange-700 mb-8">Mets à jour tes informations.</p>
      <FormulaireProfi profile={profile} />
    </div>
  )
}