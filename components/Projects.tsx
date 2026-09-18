'use client'
import { useEffect,useRef,useState } from 'react'
import { ArrowLeft,ArrowRight,X } from 'lucide-react'
import ReferencePhoto from './ReferencePhoto'
const projects=[['Iluminação residencial',35],['Iluminação comercial',180],['Quadros elétricos',325],['Iluminação externa',468]] as const
export default function Projects(){
 const scroller=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement|null>(null)
 const [selected,setSelected]=useState(0)
 const [offset,setOffset]=useState(0)
 function show(i:number,button?:HTMLButtonElement){setSelected(i);trigger.current=button||null;dialog.current?.showModal()}
 function close(){dialog.current?.close();trigger.current?.focus()}
 useEffect(()=>{const el=dialog.current;if(!el)return;const handler=(e:KeyboardEvent)=>{if(!el.open)return;if(e.key==='ArrowRight')setSelected(i=>(i+1)%projects.length);if(e.key==='ArrowLeft')setSelected(i=>(i+projects.length-1)%projects.length)};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[])
 function slide(d:number){const el=scroller.current;if(!el)return;const end=el.scrollWidth-el.clientWidth;if(end<2){setOffset(i=>(i+d+projects.length)%projects.length);return}let next=el.scrollLeft+d*((el.firstElementChild?.clientWidth||250)+14);if(next>end+5)next=0;if(next<0)next=end;el.scrollTo({left:next,behavior:'smooth'})}
 return <section id="projetos" className="wp-projects"><div className="shell"><p className="eyebrow">PROJETOS REALIZADOS</p><h2>QUALIDADE QUE<br/>TRANSFORMA AMBIENTES</h2><span className="gold-rule"/>
 <div className="projects-wrap"><button className="carousel-arrow previous" aria-label="Projeto anterior" onClick={()=>slide(-1)}><ArrowLeft/></button><div className="projects-track" ref={scroller}>{projects.map((_,index)=>{const i=(index+offset)%projects.length;const [title,x]=projects[i];return <button key={title} aria-label={'Ampliar '+title} onClick={e=>show(i,e.currentTarget)}><ReferencePhoto x={x} y={1148} w={130} h={94} alt={title}/></button>})}</div><button className="carousel-arrow next" aria-label="Próximo projeto" onClick={()=>slide(1)}><ArrowRight/></button></div>
 <div className="projects-more"><button className="outline-btn" onClick={e=>show(0,e.currentTarget)}>VER MAIS PROJETOS<ArrowRight size={15}/></button></div>
 </div><dialog ref={dialog} className="project-dialog" onClick={e=>{if(e.target===e.currentTarget)close()}} onClose={()=>trigger.current?.focus()}><button aria-label="Fechar imagem" className="dialog-close" onClick={close}><X/></button><ReferencePhoto x={projects[selected][1]} y={1148} w={130} h={94} alt={projects[selected][0]}/><div className="dialog-controls"><button aria-label="Imagem anterior" onClick={()=>setSelected(i=>(i+3)%4)}><ArrowLeft/></button><p>{projects[selected][0]}</p><button aria-label="Próxima imagem" onClick={()=>setSelected(i=>(i+1)%4)}><ArrowRight/></button></div></dialog></section>
}
