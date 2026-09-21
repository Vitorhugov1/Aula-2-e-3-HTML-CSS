import { redirect } from 'next/navigation'
import { createClient } from './supabase/server'
import type { Service, SiteSettings } from './types'

export async function getAuthorizedAdmin() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return null

  const { data: admin } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  return admin ? { supabase, user } : null
}

export async function requireAdmin() {
  const admin = await getAuthorizedAdmin()
  if (!admin) redirect('/admin/login?error=unauthorized')
  return admin
}

export async function getAdminContent() {
  const { supabase, user } = await requireAdmin()
  const [servicesResult, settingsResult] = await Promise.all([
    supabase.from('services').select('*').order('display_order'),
    supabase.from('site_settings').select('*').eq('id', true).single(),
  ])

  if (servicesResult.error) throw new Error(servicesResult.error.message)
  if (settingsResult.error) throw new Error(settingsResult.error.message)

  const services = servicesResult.data as Service[]
  const paths = services.map((service) => service.image_path).filter((path): path is string => Boolean(path))
  const signedUrls = new Map<string, string>()

  if (paths.length) {
    const { data } = await supabase.storage.from('service-images').createSignedUrls(paths, 3600)
    data?.forEach((item, index) => {
      if (item.signedUrl) signedUrls.set(paths[index], item.signedUrl)
    })
  }

  return {
    userEmail: user.email ?? '',
    services: services.map((service, index) => ({
      ...service,
      image_url: service.image_path ? signedUrls.get(service.image_path) ?? null : null,
      legacy_image_index: index < 4 && !service.image_path ? index : undefined,
    })),
    settings: settingsResult.data as SiteSettings,
  }
}
