import { Facebook, Instagram, MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/lib/contact-utils.mjs'
import type { SiteSettings } from '@/lib/types'

export default function Footer({settings}:{settings:SiteSettings}) {
 return <footer className="border-t border-white/10 bg-[#050606] py-5">
  <div className="shell flex flex-col items-center justify-center gap-2 text-center text-[7px] text-white/40">
   <p>© 2026 WP Soluções Elétricas. Todos os direitos reservados.</p>
   <nav aria-label="Informações legais" className="flex items-center justify-center gap-4 text-[8px] text-white/55">
    <a href="/privacidade" className="transition-colors hover:text-gold">Privacidade</a>
    <a href="/termos" className="transition-colors hover:text-gold">Termos de uso</a>
   </nav>
   <div className="flex items-center gap-4">
    {settings.instagram_url&&<a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram da WP Soluções Elétricas" title="Instagram" className="inline-flex p-2 transition-colors hover:text-gold"><Instagram size={18} /></a>}
    {settings.facebook_url&&<a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook da WP Soluções Elétricas" title="Facebook" className="inline-flex p-2 transition-colors hover:text-gold"><Facebook size={18} /></a>}
    <a href={whatsappUrl(settings.whatsapp_number,settings.whatsapp_message)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da WP Soluções Elétricas" title="WhatsApp" className="inline-flex p-2 transition-colors hover:text-gold"><MessageCircle size={18} /></a>
   </div>
  </div>
 </footer>
}
