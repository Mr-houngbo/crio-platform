'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function soumettreAlumni(data: {
  bourse_id: string
  annee_obtention: number
  pays_destination: string
  universite_destination: string
  temoignage: string
  disponible_contact: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecte' }

  const { error } = await supabase
    .from('alumni')
    .upsert({
      user_id: user.id,
      ...data,
      valide: false,
    }, { onConflict: 'user_id,bourse_id' })

  if (error) return { error: error.message }
  revalidatePath('/alumni')
  return { success: true }
}