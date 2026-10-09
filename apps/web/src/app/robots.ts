import type { MetadataRoute } from 'next'
import { absoluteUrl, siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  // Keep staging and preview deploys out of the index; only the live domain is crawlable.
  const isLive = process.env.NODE_ENV === 'production' && !siteUrl.includes('localhost')
  return {
    rules: isLive
      ? [{ userAgent: '*', allow: ['/', '/api/media/file/'], disallow: ['/admin', '/api/'] }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteUrl,
  }
}
