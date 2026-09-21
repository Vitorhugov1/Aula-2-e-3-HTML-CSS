import type { Service, SiteSettings } from './types'

export const defaultServices: Service[] = [
  { id: 'fallback-installations', title: 'Instalações Elétricas', description: 'Projetos e instalações residenciais, comerciais e industriais.', category: 'Instalações', image_path: null, image_alt: 'Instalações Elétricas', display_order: 1, is_active: true, legacy_image_index: 0 },
  { id: 'fallback-automation', title: 'Automação Elétrica', description: 'Mais conforto, tecnologia e praticidade para o seu dia.', category: 'Automação', image_path: null, image_alt: 'Automação Elétrica', display_order: 2, is_active: true, legacy_image_index: 1 },
  { id: 'fallback-lighting', title: 'Iluminação Residencial e Comercial', description: 'Projetos que valorizam e economizam energia.', category: 'Iluminação', image_path: null, image_alt: 'Iluminação Residencial e Comercial', display_order: 3, is_active: true, legacy_image_index: 2 },
  { id: 'fallback-complete', title: 'Soluções Completas', description: 'Do planejamento à execução. Tudo em um só lugar.', category: 'Soluções completas', image_path: null, image_alt: 'Soluções Completas', display_order: 4, is_active: true, legacy_image_index: 3 },
]

export const defaultSettings: SiteSettings = {
  whatsapp_number: '5588998007589',
  whatsapp_message: 'Olá, Wagner! Vi o site da WP Soluções Elétricas e gostaria de solicitar um orçamento.',
  phone: '5588998007589',
  email: '',
  address: '',
  business_hours: '',
  instagram_url: 'https://www.instagram.com/wagner_wpsolucoeseletricas/',
  facebook_url: '',
}
