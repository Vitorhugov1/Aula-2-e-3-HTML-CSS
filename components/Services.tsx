import { ArrowRight,Cpu,Lightbulb,HousePlug,Settings } from 'lucide-react'
import Reveal from './Reveal'
import { whatsappUrl } from '@/lib/contact-utils.mjs'
import type { Service,SiteSettings } from '@/lib/types'
const icons=[HousePlug,Cpu,Lightbulb,Settings]
function ServicePhoto({service,index}:{service:Service,index:number}){const crop=service.image_crop_index??service.legacy_image_index;if(service.image_url&&crop==null)return <span className="service-photo"><img src={service.image_url} alt={service.image_alt||service.title} loading="lazy" width={800} height={600} className="service-uploaded-image"/></span>;const legacy=crop??index%4;return <span className="service-photo" role="img" aria-label={service.image_alt||service.title}><img src={service.image_url||'/images/services-hd.webp'} alt="" loading="lazy" width={1448} height={1086} style={{left:legacy%2?'-100%':0,top:legacy>1?'-100%':0}}/></span>}
export default function Services({services,settings}:{services:Service[],settings:SiteSettings}){return <section id="servicos" className="wp-services"><div className="shell">
 <Reveal><div className="section-heading"><div><p className="eyebrow">NOSSOS SERVIÇOS</p><h2>SOLUÇÕES ELÉTRICAS<br/>COMPLETAS PARA VOCÊ</h2><span className="gold-rule"/></div><p>Da instalação à automação,<br/>entregamos segurança, eficiência<br/>e qualidade em cada detalhe.</p></div></Reveal>
 <div className="services-grid">{services.map((service,index)=>{const Icon=icons[index%icons.length];return <Reveal className="service-reveal" delay={index*.09} key={service.id}><article className="service-card">
 <ServicePhoto service={service} index={index}/><div className="service-content"><span className="service-icon"><Icon/></span><h3>{service.title}</h3><p>{service.description}</p><a className="outline-btn" target="_blank" rel="noopener noreferrer" href={whatsappUrl(settings.whatsapp_number,`Olá, Wagner! Gostaria de saber mais sobre ${service.title} da WP.`)}>SAIBA MAIS<ArrowRight size={15}/></a></div>
 </article></Reveal>})}</div></div></section>}
