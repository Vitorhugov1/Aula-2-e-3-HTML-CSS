'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { normalizeBrazilianWhatsApp, onlyDigits } from '@/lib/contact-utils.mjs'
import { getAuthorizedAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import { detectImageType, isSafeSocialUrl } from '@/lib/security.mjs'
import type { ActionResult } from '@/lib/types'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function fail(message: string): ActionResult {
  return { ok: false, message }
}

async function adminOrFailure() {
  const admin = await getAuthorizedAdmin()
  return admin ?? null
}

export async function saveServiceAction(formData: FormData): Promise<ActionResult> {
  const admin = await adminOrFailure()
  if (!admin) return fail('Sessão expirada ou acesso não autorizado.')

  const id = value(formData, 'id')
  const title = value(formData, 'title')
  const description = value(formData, 'description')
  const category = value(formData, 'category')
  const imageAlt = value(formData, 'image_alt')
  const isActive = formData.get('is_active') === 'on'
  const file = formData.get('image')

  if (id && !UUID_PATTERN.test(id)) return fail('Serviço inválido.')
  if (title.length < 2 || title.length > 100) return fail('O título deve ter entre 2 e 100 caracteres.')
  if (description.length < 2 || description.length > 300) return fail('A descrição deve ter entre 2 e 300 caracteres.')
  if (category.length > 80) return fail('A categoria deve ter no máximo 80 caracteres.')
  if (imageAlt.length > 180) return fail('O texto alternativo deve ter no máximo 180 caracteres.')

  const { supabase, user } = admin
  let oldImagePath: string | null = null
  let uploadedPath: string | null = null

  if (id) {
    const { data, error } = await supabase.from('services').select('image_path').eq('id', id).single()
    if (error) return fail('Não foi possível localizar o serviço.')
    oldImagePath = data.image_path
  }

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) return fail('A imagem deve ter no máximo 5 MB.')
    const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer())
    const detected = detectImageType(signature)
    if (!detected || (file.type && file.type !== detected.mime)) {
      return fail('O conteúdo do arquivo não corresponde a uma imagem JPG, PNG ou WebP válida.')
    }
    uploadedPath = `${user.id}/${crypto.randomUUID()}.${detected.extension}`
    const { error } = await supabase.storage.from('service-images').upload(uploadedPath, file, {
      contentType: detected.mime,
      upsert: false,
      cacheControl: '31536000',
    })
    if (error) {
      console.error('Falha no upload de imagem de serviço.', error)
      return fail('Não foi possível enviar a imagem. Tente novamente.')
    }
  }

  const payload = {
    title,
    description,
    category,
    image_alt: imageAlt || title,
    is_active: isActive,
    ...(uploadedPath ? { image_path: uploadedPath, image_crop_index: null } : {}),
  }

  let databaseError: string | null = null
  if (id) {
    const { error } = await supabase.from('services').update(payload).eq('id', id)
    databaseError = error?.message ?? null
  } else {
    const { data: last } = await supabase.from('services').select('display_order').order('display_order', { ascending: false }).limit(1).maybeSingle()
    const { error } = await supabase.from('services').insert({ ...payload, display_order: (last?.display_order ?? 0) + 1 })
    databaseError = error?.message ?? null
  }

  if (databaseError) {
    if (uploadedPath) await supabase.storage.from('service-images').remove([uploadedPath])
    console.error('Falha ao salvar serviço.', databaseError)
    return fail('Não foi possível salvar o serviço. Tente novamente.')
  }

  if (uploadedPath && oldImagePath) await supabase.storage.from('service-images').remove([oldImagePath])
  revalidatePath('/')
  revalidatePath('/admin')
  return { ok: true, message: id ? 'Serviço atualizado com sucesso.' : 'Serviço adicionado com sucesso.' }
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  const admin = await adminOrFailure()
  if (!admin) return fail('Sessão expirada ou acesso não autorizado.')
  if (!UUID_PATTERN.test(id)) return fail('Serviço inválido.')

  const { supabase } = admin
  const { data, error: readError } = await supabase.from('services').select('image_path').eq('id', id).single()
  if (readError) return fail('Não foi possível localizar o serviço.')

  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) {
    console.error('Falha ao excluir serviço.', error)
    return fail('Não foi possível excluir o serviço. Tente novamente.')
  }
  if (data.image_path) await supabase.storage.from('service-images').remove([data.image_path])

  revalidatePath('/')
  revalidatePath('/admin')
  return { ok: true, message: 'Serviço excluído com sucesso.' }
}

export async function moveServiceAction(id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  const admin = await adminOrFailure()
  if (!admin) return fail('Sessão expirada ou acesso não autorizado.')
  if (!UUID_PATTERN.test(id)) return fail('Serviço inválido.')

  const { supabase } = admin
  const { data, error } = await supabase.from('services').select('id, display_order').order('display_order')
  if (error || !data) return fail('Não foi possível reordenar os serviços.')
  const index = data.findIndex((service) => service.id === id)
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (index < 0 || targetIndex < 0 || targetIndex >= data.length) return fail('Este serviço já está no limite da lista.')

  const current = data[index]
  const target = data[targetIndex]
  const first = await supabase.from('services').update({ display_order: target.display_order }).eq('id', current.id)
  if (first.error) return fail('Não foi possível reordenar os serviços.')
  const second = await supabase.from('services').update({ display_order: current.display_order }).eq('id', target.id)
  if (second.error) {
    await supabase.from('services').update({ display_order: current.display_order }).eq('id', current.id)
    return fail('Não foi possível concluir a reordenação.')
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { ok: true, message: 'Ordem atualizada.' }
}

export async function saveSettingsAction(formData: FormData): Promise<ActionResult> {
  const admin = await adminOrFailure()
  if (!admin) return fail('Sessão expirada ou acesso não autorizado.')

  const whatsapp = normalizeBrazilianWhatsApp(value(formData, 'whatsapp_number'))
  const instagram = value(formData, 'instagram_url')
  const facebook = value(formData, 'facebook_url')
  const email = value(formData, 'email')
  const phoneInput = value(formData, 'phone')
  const phone = phoneInput ? normalizeBrazilianWhatsApp(phoneInput) : ''
  if (!whatsapp) return fail('Informe um WhatsApp brasileiro válido, com DDD.')
  if (phoneInput && !phone) return fail('Informe um telefone comercial brasileiro válido, com DDD.')
  if (email.length > 254 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return fail('Informe um e-mail válido.')
  if (instagram.length > 300 || !isSafeSocialUrl(instagram, 'instagram')) return fail('Informe um endereço HTTPS válido do Instagram.')
  if (facebook.length > 300 || !isSafeSocialUrl(facebook, 'facebook')) return fail('Informe um endereço HTTPS válido do Facebook.')

  const payload = {
    whatsapp_number: whatsapp,
    whatsapp_message: value(formData, 'whatsapp_message').slice(0, 500),
    phone: phone ? onlyDigits(phone) : '',
    email,
    address: value(formData, 'address').slice(0, 240),
    business_hours: value(formData, 'business_hours').slice(0, 180),
    instagram_url: instagram,
    facebook_url: facebook,
  }

  const { error } = await admin.supabase.from('site_settings').update(payload).eq('id', true)
  if (error) {
    console.error('Falha ao salvar configurações públicas.', error)
    return fail('Não foi possível salvar as informações. Tente novamente.')
  }

  revalidatePath('/')
  revalidatePath('/privacidade')
  revalidatePath('/admin')
  return { ok: true, message: 'Informações de contato atualizadas.' }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
