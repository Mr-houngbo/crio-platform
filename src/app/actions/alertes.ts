'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleAlerteBourse(bourseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecté' }

  const { data: existing } = await supabase
    .from('alertes_bourses')
    .select('id')
    .eq('user_id', user.id)
    .eq('bourse_id', bourseId)
    .single()

  if (existing) {
    await supabase
      .from('alertes_bourses')
      .delete()
      .eq('user_id', user.id)
      .eq('bourse_id', bourseId)
    revalidatePath('/bourses')
    revalidatePath(`/bourses/${bourseId}`)
    return { active: false }
  } else {
    await supabase
      .from('alertes_bourses')
      .insert({ user_id: user.id, bourse_id: bourseId, notif_30j: true, notif_7j: true })
    revalidatePath('/bourses')
    revalidatePath(`/bourses/${bourseId}`)
    return { active: true }
  }
}