import { ArrowRight,Handshake,Settings,ShieldCheck } from 'lucide-react'
import ReferencePhoto from './ReferencePhoto'
const values=[[ShieldCheck,'SEGURANÇA','Em primeiro lugar'],[Settings,'QUALIDADE','Em cada detalhe'],[Handshake,'CONFIANÇA','Em todos os projetos']] as const
export default function About(){return <section id="sobre" className="wp-about">
 <ReferencePhoto x={449} y={855} w={185} h={220} alt="Trabalho em painel elétrico" className="about-photo"/>
 <div className="shell about-inner"><div className="about-copy"><p className="eyebrow">SOBRE A WP</p><h2>COMPROMISSO<br/>EM CADA <span className="text-gold">CONEXÃO</span></h2><span className="gold-rule"/>
 <p>A WP Soluções Elétricas, liderada por Wagner Paulino, nasceu com o propósito de entregar muito mais que serviços elétricos: oferecemos segurança, qualidade e confiança em cada projeto.</p><p>Com experiência e dedicação, atuamos com soluções modernas e eficientes, sempre focados na satisfação dos nossos clientes.</p>
 <a href="https://wa.me/5588998007589?text=Ol%C3%A1!%20Quero%20conhecer%20melhor%20o%20trabalho%20da%20WP." target="_blank" rel="noopener noreferrer" className="gold-btn">CONHEÇA NOSSA HISTÓRIA<ArrowRight size={16}/></a></div>
 <div className="about-values">{values.map(([Icon,title,desc])=><div key={title}><Icon/><p><strong>{title}</strong><span>{desc}</span></p></div>)}</div></div></section>}
