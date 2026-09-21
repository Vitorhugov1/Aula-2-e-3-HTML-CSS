import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
 return { rules:{userAgent:'*',allow:'/'},sitemap:'https://wp-solucoes-eletricas.vercel.app/sitemap.xml' }
}
