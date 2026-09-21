import { Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
 return <footer className="border-t border-white/10 bg-[#050606] py-5">
  <div className="shell flex flex-col items-center justify-center gap-2 text-center text-[7px] text-white/40">
   <p>© 2026 WP Soluções Elétricas. Todos os direitos reservados.</p>
   <div className="flex items-center gap-4">
    <a href="https://www.instagram.com/wagner_wpsolucoeseletricas/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da WP Soluções Elétricas" title="Instagram" className="inline-flex p-2 transition-colors hover:text-gold"><Instagram size={18} /></a>
    <a href="https://wa.me/5588998007589" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da WP Soluções Elétricas" title="WhatsApp" className="inline-flex p-2 transition-colors hover:text-gold"><MessageCircle size={18} /></a>
   </div>
  </div>
 </footer>
}
