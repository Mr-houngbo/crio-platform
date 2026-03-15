'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function marquerLeconComplete(leconId: string, slug: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecté' }

  const { error } = await supabase
    .from('progression')
    .upsert({
      user_id: user.id,
      lecon_id: leconId,
      completee: true,
      pourcentage: 100,
      completed_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,lecon_id'
    })

  if (error) return { error: error.message }

  revalidatePath(`/parcours/${slug}`)
  revalidatePath('/dashboard')
  return { success: true }
}