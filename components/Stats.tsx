'use client'
import { CheckCircle2,Headphones,MapPin,Wrench } from 'lucide-react'
import Reveal from './Reveal'
const stats=[['+200','Projetos realizados',Wrench],['100%','Clientes satisfeitos',CheckCircle2],['Atendimento','Em Pedra Branca e regiões vizinhas',MapPin],['Suporte','Do orçamento à entrega',Headphones]] as const
export default function Stats(){return <section className="border-y border-gold/20 bg-[#080909]"><div className="shell grid grid-cols-2 lg:grid-cols-4">{stats.map(([value,label,Icon],index)=><Reveal key={label} delay={index*.07} className="stat-item flex min-h-20 items-center gap-3 border-b border-r border-white/10 px-3 py-4 last:border-r-0 lg:border-b-0"><Icon className="shrink-0 text-gold" size={24} strokeWidth={1.6}/><div><strong className="font-display text-sm uppercase text-gold">{value}</strong><p className="mt-1 text-[7px] font-semibold uppercase leading-3 text-white/65">{label}</p></div></Reveal>)}</div></section>}
