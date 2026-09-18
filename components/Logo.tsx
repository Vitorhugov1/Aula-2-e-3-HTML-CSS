import { Zap } from 'lucide-react'
export default function Logo({compact=false}:{compact?:boolean}) {
 return <a href="#inicio" aria-label="WP Soluções Elétricas" className="wp-logo">
 <span className="wp-monogram"><span>W</span><Zap aria-hidden="true"/><span>P</span></span>
 {!compact&&<><strong>SOLUÇÕES ELÉTRICAS</strong><small>SEGURANÇA · QUALIDADE · CONFIANÇA</small></>}
 </a>
}
