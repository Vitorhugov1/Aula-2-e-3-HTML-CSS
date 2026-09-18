import type { CSSProperties } from 'react'
// Exact photo regions from the supplied reference, without its interface text.
export default function ReferencePhoto({x,y,w,h,alt,className=''}:{x:number;y:number;w:number;h:number;alt:string;className?:string}) {
 const style={aspectRatio:w+'/'+h,'--photo-width':(634/w*100)+'%','--photo-left':(-x/w*100)+'%','--photo-top':(-y/1600*100)+'%'} as CSSProperties
 return <span className={'reference-photo '+className} style={style} role="img" aria-label={alt}><img src="/images/reference.jpeg" alt="" width="634" height="1600" loading="lazy"/></span>
}
