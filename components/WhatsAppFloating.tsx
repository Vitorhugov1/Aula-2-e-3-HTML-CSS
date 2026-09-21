import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/lib/contact-utils.mjs'
import type { SiteSettings } from '@/lib/types'
export default function WhatsAppFloating({settings}:{settings:SiteSettings}){return <a href={whatsappUrl(settings.whatsapp_number,settings.whatsapp_message)} target="_blank" rel="noopener noreferrer" aria-label="Falar com Wagner pelo WhatsApp" className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#20b85a] text-white shadow-[0_8px_30px_rgba(32,184,90,.35)] lg:hidden"><MessageCircle fill="currentColor"/></a>}
