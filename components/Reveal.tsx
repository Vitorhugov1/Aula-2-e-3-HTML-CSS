'use client'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
export default function Reveal({children,className='',delay=0}:{children:ReactNode,className?:string,delay?:number}){return <motion.div initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.7,delay,ease:'easeOut'}} className={className}>{children}</motion.div>}
