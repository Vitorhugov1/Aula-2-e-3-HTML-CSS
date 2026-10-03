'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal'

const projects = [
 { title: 'Iluminação residencial', category: 'Residencial', description: 'Iluminação embutida com distribuição uniforme para corredores e áreas de circulação.', image: '/images/projects/iluminacao-residencial.webp', position: 'center' },
 { title: 'Iluminação comercial decorativa', category: 'Ponto comercial', description: 'Projeto luminotécnico com perfis de LED geométricos para valorizar a identidade do ambiente.', image: '/images/projects/iluminacao-comercial.webp', position: 'center 32%' },
 { title: 'Quadro elétrico organizado', category: 'Instalação elétrica', description: 'Montagem técnica com circuitos identificados, proteção DR e DPS e cabeamento organizado.', image: '/images/projects/quadro-eletrico.webp', position: 'center 34%' },
 { title: 'Iluminação residencial', category: 'Residencial', description: 'Soluções de iluminação planejadas para conforto, eficiência e segurança.', legacyIndex: 0 },
 { title: 'Iluminação comercial', category: 'Comercial', description: 'Instalações profissionais dimensionadas para a rotina de pontos comerciais.', legacyIndex: 1 },
 { title: 'Quadros elétricos', category: 'Proteção', description: 'Distribuição elétrica organizada e protegida para instalações mais confiáveis.', legacyIndex: 2 },
 { title: 'Iluminação externa', category: 'Área externa', description: 'Iluminação funcional para fachadas, acessos e ambientes externos.', legacyIndex: 3 },
] as const
const lastProject = projects.length - 1

function ProjectPhoto({ index }: { index: number }) {
 const project = projects[index]
 const isRealPhoto = 'image' in project
 return <span className={`project-photo${isRealPhoto ? ' project-photo-real' : ''}`}>
  <img
   src={isRealPhoto ? project.image : '/images/projects-hd.webp'}
   alt={project.title}
   loading="lazy"
   width={isRealPhoto ? 900 : 2048}
   height={isRealPhoto ? 1600 : 1536}
   style={isRealPhoto
    ? { objectPosition: project.position }
    : { left: project.legacyIndex % 2 ? '-100%' : 0, top: project.legacyIndex > 1 ? '-100%' : 0 }}
  />
 </span>
}

export default function Projects() {
 const reduceMotion = useReducedMotion()
 const scroller = useRef<HTMLDivElement>(null)
 const dialog = useRef<HTMLDialogElement>(null)
 const trigger = useRef<HTMLButtonElement | null>(null)
 const [selected, setSelected] = useState(0)
 const [bounds, setBounds] = useState({ previous: false, next: false })

 useEffect(() => {
  const el = scroller.current
  if (!el) return
  const update = () => setBounds({
   previous: el.scrollLeft > 2,
   next: el.scrollLeft < el.scrollWidth - el.clientWidth - 2,
  })
  const resize = new ResizeObserver(update)
  resize.observe(el)
  el.addEventListener('scroll', update, { passive: true })
  update()
  return () => { resize.disconnect(); el.removeEventListener('scroll', update) }
 }, [])

 useEffect(() => {
  const handler = (event: KeyboardEvent) => {
   if (!dialog.current?.open) return
   if (event.key === 'ArrowRight') {
    event.preventDefault()
    setSelected(i => Math.min(lastProject, i + 1))
   }
   if (event.key === 'ArrowLeft') {
    event.preventDefault()
    setSelected(i => Math.max(0, i - 1))
   }
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
 }, [])

 function show(index: number, button: HTMLButtonElement) {
  setSelected(index)
  trigger.current = button
  dialog.current?.showModal()
 }
 function close() { dialog.current?.close() }
 function slide(direction: number) {
  const el = scroller.current
  if (!el) return
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0
  const step = (el.firstElementChild?.clientWidth || el.clientWidth) + gap
  const end = Math.max(0, el.scrollWidth - el.clientWidth)
  el.scrollTo({ left: Math.max(0, Math.min(end, el.scrollLeft + direction * step)), behavior: 'smooth' })
 }

 return <section id="projetos" className="wp-projects">
  <div className="shell">
   <Reveal><p className="eyebrow">PROJETOS REALIZADOS</p>
   <h2>QUALIDADE QUE<br />TRANSFORMA AMBIENTES</h2>
   <span className="gold-rule" /></Reveal>
   <div className="projects-wrap">
    <button className="carousel-arrow previous" aria-label="Projeto anterior" disabled={!bounds.previous} onClick={() => slide(-1)}><ArrowLeft /></button>
    <div className="projects-track" ref={scroller}>
     {projects.map((project, index) => <motion.button key={`${project.title}-${index}`} aria-label={'Ampliar ' + project.title} onClick={e => show(index, e.currentTarget)} initial={reduceMotion?false:{opacity:0,y:28,scale:.96}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true,amount:.5}} transition={{duration:.85,delay:reduceMotion?0:Math.min(index, 4)*.1,ease:[.22,1,.36,1]}} whileHover={reduceMotion?undefined:{y:-6}}>
      <ProjectPhoto index={index} />
      <span className="project-card-copy"><small>{project.category}</small><strong>{project.title}</strong></span>
     </motion.button>)}
    </div>
    <button className="carousel-arrow next" aria-label="Próximo projeto" disabled={!bounds.next} onClick={() => slide(1)}><ArrowRight /></button>
   </div>
   <div className="projects-more"><button className="outline-btn" onClick={e => show(0, e.currentTarget)}>VER MAIS PROJETOS<ArrowRight size={15} /></button></div>
  </div>
  <dialog ref={dialog} className="project-dialog" aria-label="Galeria de projetos" onClick={e => { if (e.target === e.currentTarget) close() }} onClose={() => trigger.current?.focus()}>
   <button aria-label="Fechar imagem" className="dialog-close" onClick={close}><X /></button>
   <ProjectPhoto index={selected} />
   <div className="dialog-controls">
    <button aria-label="Imagem anterior" disabled={selected === 0} onClick={() => setSelected(i => Math.max(0, i - 1))}><ArrowLeft /></button>
    <p aria-live="polite"><strong>{projects[selected].title}</strong><small>{projects[selected].description}</small><span className="project-counter">{selected + 1} / {projects.length}</span></p>
    <button aria-label="Próxima imagem" disabled={selected === lastProject} onClick={() => setSelected(i => Math.min(lastProject, i + 1))}><ArrowRight /></button>
   </div>
  </dialog>
 </section>
}
