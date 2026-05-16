'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSite(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  const nombre = formData.get('nombre') as string
  const url = formData.get('url') as string
  const descripcion = formData.get('descripcion') as string
  const categoria = formData.get('categoria') as string

  const { error } = await supabase.from('sitios_web').insert({
    user_id: user.id,
    nombre,
    url,
    descripcion,
    categoria,
  })

  if (error) {
    console.error('Error al crear el sitio:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function editSite(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const nombre = formData.get('nombre') as string
  const url = formData.get('url') as string
  const descripcion = formData.get('descripcion') as string
  const categoria = formData.get('categoria') as string

  const { error } = await supabase
    .from('sitios_web')
    .update({ nombre, url, descripcion, categoria })
    .eq('id', id)

  if (error) {
    console.error('Error al editar el sitio:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleVisited(id: string, currentState: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('sitios_web')
    .update({ 
      visitado: !currentState,
      fecha_visita: !currentState ? new Date().toISOString() : null
    })
    .eq('id', id)

  if (error) {
    console.error('Error al actualizar el estado:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteSite(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('sitios_web')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar el sitio:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
