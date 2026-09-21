import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:'WP Soluções Elétricas | Instalações, Automação e Iluminação',
  description:'Soluções elétricas residenciais e comerciais com segurança, qualidade e confiança. Fale com Wagner Paulino e solicite seu orçamento.',
  keywords:['eletricista','instalações elétricas','automação','iluminação','Fortaleza'],
}

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-BR" className="scroll-smooth"><body>{children}</body></html>
}
