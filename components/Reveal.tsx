'use client'
import { motion,useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
export default function Reveal({children,className='',delay=0,direction='up'}:{children:ReactNode,className?:string,delay?:number,direction?:'up'|'left'|'right'}){
 const reduceMotion=useReducedMotion()
 const offset=direction==='left'?{x:-34,y:0}:direction==='right'?{x:34,y:0}:{x:0,y:34}
 return <motion.div initial={reduceMotion?false:{opacity:0,...offset,scale:.985,filter:'blur(7px)'}} whileInView={{opacity:1,x:0,y:0,scale:1,filter:'blur(0px)'}} viewport={{once:true,amount:.5}} transition={{duration:.92,delay:reduceMotion?0:delay,ease:[.22,1,.36,1]}} className={className}>{children}</motion.div>
}
