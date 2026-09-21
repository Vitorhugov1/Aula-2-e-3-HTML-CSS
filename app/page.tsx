import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Testimonials from '@/components/Testimonials'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import WhatsAppFloating from '@/components/WhatsAppFloating'
import { getPublicContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function Home(){
 const {services,settings}=await getPublicContent()
 return <main className="overflow-hidden"><Header settings={settings}/><Hero settings={settings}/><Stats/><Services services={services} settings={settings}/><About/><Projects/><Testimonials/><FinalCTA settings={settings}/><Footer settings={settings}/><WhatsAppFloating settings={settings}/></main>
}
