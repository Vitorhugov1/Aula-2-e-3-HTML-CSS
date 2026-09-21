import Image from 'next/image'
import { ArrowRight,BadgeCheck,Cpu,Lightbulb,HousePlug,MapPin,MessageCircle } from 'lucide-react'
const specialties=[[HousePlug,'Instalações elétricas'],[Cpu,'Automação elétrica'],[Lightbulb,'Iluminação residencial e comercial'],[BadgeCheck,'Soluções completas']] as const
export default function Hero(){return <section id="inicio" className="wp-hero">
 <Image src="/images/hero-hd.webp" alt="Profissional de costas com uniforme da WP Soluções Elétricas" fill priority quality={95} sizes="100vw" className="hero-photo"/>
 <div className="shell hero-inner"><div className="hero-copy">
 <p className="hero-owner">WAGNER <b>PAULINO</b><small>RESPONSÁVEL TÉCNICO</small></p>
 <h1>ENERGIA<br/>QUE CONECTA<br/><span>SEU MUNDO</span></h1>
 <p className="hero-subtitle">Soluções elétricas completas com<br/>segurança, qualidade e confiança.</p>
 <div className="hero-specialties">{specialties.map(([Icon,label])=><div key={label}><Icon aria-hidden="true"/><span>{label}</span></div>)}</div>
 <a href="https://wa.me/5588998007589?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20da%20WP." target="_blank" rel="noopener noreferrer" className="gold-btn hero-button"><MessageCircle/>FALAR CONOSCO<ArrowRight/></a>
 <p className="hero-assurance"><MapPin/>ATENDIMENTO RÁPIDO E CONFIÁVEL</p>
 <p className="hero-list">PROJETOS<br/>INSTALAÇÕES<br/>MANUTENÇÃO<br/>AUTOMAÇÃO</p>
 </div><p className="hero-note handwritten">Mais que<br/>eletricidade,<br/>tranquilidade<br/>para o seu dia.</p></div>
 </section>}
