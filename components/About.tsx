import { Handshake,Settings,ShieldCheck } from 'lucide-react'
const values=[[ShieldCheck,'SEGURANÇA','Em primeiro lugar'],[Settings,'QUALIDADE','Em cada detalhe'],[Handshake,'CONFIANÇA','Em todos os projetos']] as const
export default function About(){return <section id="sobre" className="wp-about">
 <span className="about-photo"><img src="/images/about-hd.webp" alt="Trabalho em painel elétrico" width={1122} height={1402} loading="lazy"/></span>
 <div className="shell about-inner"><div className="about-copy"><p className="eyebrow">SOBRE A WP</p><h2>COMPROMISSO<br/>EM CADA <span className="text-gold">CONEXÃO</span></h2><span className="gold-rule"/>
 <p>A WP Soluções Elétricas, liderada por Wagner Paulino, nasceu com o propósito de entregar muito mais que serviços elétricos: oferecemos segurança, qualidade e confiança em cada projeto.</p><p>Com experiência e dedicação, atuamos com soluções modernas e eficientes, sempre focados na satisfação dos nossos clientes.</p>
 <span className="mt-[15px] inline-flex items-center justify-center rounded-none bg-[var(--gold)] px-[25px] py-[14px] text-[12px] font-bold leading-[1.2] text-black max-md:text-[11px]">CONHEÇA NOSSA HISTÓRIA</span></div>
 <div className="about-values">{values.map(([Icon,title,desc])=><div key={title}><Icon/><p><strong>{title}</strong><span>{desc}</span></p></div>)}</div></div></section>}
