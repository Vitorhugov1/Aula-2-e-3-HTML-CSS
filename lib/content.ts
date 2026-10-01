import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { defaultServices, defaultSettings } from './defaults'
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './supabase/config'
import type { Service, SiteSettings } from './types'

export async function getPublicContent(): Promise<{ services: Service[]; settings: SiteSettings }> {
  if (!isSupabaseConfigured) return { services: defaultServices, settings: defaultSettings }

  try {
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const [servicesResult, settingsResult] = await Promise.all([
      supabase.from('services').select('id,title,description,category,image_path,image_crop_index,image_alt,display_order,is_active').eq('is_active', true).order('display_order'),
      supabase.from('site_settings').select('whatsapp_number,whatsapp_message,phone,email,address,business_hours,instagram_url,facebook_url').eq('id', true).single(),
    ])

    if (servicesResult.error || settingsResult.error || !settingsResult.data) throw new Error('Conteúdo indisponível')
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
      services: services.map((service, index) => ({
        ...service,
        image_url: service.image_path ? signedUrls.get(service.image_path) ?? null : null,
        legacy_image_index: index < 4 ? index : undefined,
      })),
      settings: settingsResult.data as SiteSettings,
    }
  } catch {
    return { services: defaultServices, settings: defaultSettings }
  }
}
