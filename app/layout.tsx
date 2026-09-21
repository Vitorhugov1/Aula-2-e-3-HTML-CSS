import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase:new URL('https://wp-solucoes-eletricas.vercel.app'),
  title:'WP Soluções Elétricas | Instalações, Automação e Iluminação',
  description:'Soluções elétricas residenciais e comerciais com segurança, qualidade e confiança. Fale com Wagner Paulino e solicite seu orçamento.',
  keywords:['eletricista','instalações elétricas','automação','iluminação','Pedra Branca'],
  alternates:{canonical:'/'},
  openGraph:{title:'WP Soluções Elétricas',description:'Soluções elétricas residenciais e comerciais com segurança, qualidade e confiança.',url:'/',siteName:'WP Soluções Elétricas',locale:'pt_BR',type:'website',images:[{url:'/images/logo-wp-transparent.png',width:1342,height:1172,alt:'WP Soluções Elétricas'}]},
  robots:{index:true,follow:true},
  icons:{icon:'/images/logo-wp-transparent.png',apple:'/images/logo-wp-transparent.png'},
}

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-BR" className="scroll-smooth"><body>{children}</body></html>
}
