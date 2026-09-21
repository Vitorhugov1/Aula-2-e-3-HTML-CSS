export type Service = {
  id: string
  title: string
  description: string
  category: string
  image_path: string | null
  image_alt: string
  display_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
  image_url?: string | null
  legacy_image_index?: number
  image_crop_index?: number | null
}

export type SiteSettings = {
  whatsapp_number: string
  whatsapp_message: string
  phone: string
  email: string
  address: string
  business_hours: string
  instagram_url: string
  facebook_url: string
  created_at?: string
  updated_at?: string
}

export type ActionResult = { ok: true; message: string } | { ok: false; message: string }
