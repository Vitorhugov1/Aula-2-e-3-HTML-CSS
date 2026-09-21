import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceRoleKey) throw new Error('Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.seed.')

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
const image = await readFile(new URL('../public/images/services-hd.webp', import.meta.url))
const { data: services, error } = await supabase.from('services').select('id, display_order').order('display_order').limit(4)
if (error || !services?.length) throw new Error(error?.message ?? 'Nenhum serviço encontrado. Execute a migration primeiro.')

for (const [index, service] of services.entries()) {
  const path = `initial/service-${index + 1}.webp`
  const upload = await supabase.storage.from('service-images').upload(path, image, { contentType: 'image/webp', upsert: true, cacheControl: '31536000' })
  if (upload.error) throw new Error(upload.error.message)
  const update = await supabase.from('services').update({ image_path: path, image_crop_index: index }).eq('id', service.id)
  if (update.error) throw new Error(update.error.message)
}

console.log('Imagens iniciais migradas com sucesso para o bucket privado service-images.')
