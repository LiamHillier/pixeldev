import type { MetadataRoute } from 'next'
import { getPosts, getServices, getWork } from '@/lib/data'
import { absoluteUrl } from '@/lib/seo'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, work, posts] = await Promise.all([getServices(), getWork(), getPosts()])
  const page = (
    path: string,
    priority: number,
    lastModified?: string | null,
  ): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    lastModified: lastModified ? new Date(lastModified) : undefined,
    priority,
  })
  const latestPost = posts[0]?.updatedAt

  return [
    page('/', 1),
    page('/services', 0.9),
    ...services
      .filter((s) => !s.seo?.noIndex)
      .map((s) => page(`/services/${s.slug}`, 0.9, s.updatedAt)),
    page('/work', 0.7),
    ...work
      .filter((w) => w.caseStudy?.enabled && !w.seo?.noIndex)
      .map((w) => page(`/work/${w.slug}`, 0.7, w.updatedAt)),
    page('/about', 0.6),
    page('/contact', 0.8),
    page('/journal', 0.6, latestPost),
    ...posts
      .filter((p) => !p.seo?.noIndex)
      .map((p) => page(`/journal/${p.slug}`, 0.5, p.updatedAt)),
  ]
}
