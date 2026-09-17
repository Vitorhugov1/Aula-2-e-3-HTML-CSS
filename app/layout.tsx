import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets:['latin'], variable:'--font-inter', display:'swap' })
const space = Space_Grotesk({ subsets:['latin'], variable:'--font-space', display:'swap' })

export const metadata: Metadata = {
  title:'WR Soluções Elétricas | Instalações, Automação e Iluminação',
  description:'Soluções elétricas residenciais e comerciais com segurança, qualidade e confiança. Fale com Wagner Paulino e solicite seu orçamento.',
  keywords:['eletricista','instalações elétricas','automação','iluminação','Fortaleza'],
}

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-BR" className="scroll-smooth"><body className={`${inter.variable} ${space.variable}`}>{children}</body></html>
}
