import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
 const base='https://wp-solucoes-eletricas.vercel.app'
 return ['','/privacidade','/termos'].map(path=>({url:base+path,lastModified:new Date('2026-09-21'),changeFrequency:path?'yearly':'monthly',priority:path?.7:1}))
}
