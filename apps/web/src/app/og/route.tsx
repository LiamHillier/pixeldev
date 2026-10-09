import { getSite } from '@/lib/data'
import { shareCard } from '@/lib/og'
import { clip } from '@/lib/seo'

/** Branded 1200x630 share card: /og?title=...&eyebrow=... */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const site = await getSite()
  return shareCard({
    title: clip(searchParams.get('title') || site.tagline || site.name, 110) ?? site.name,
    eyebrow: clip(searchParams.get('eyebrow'), 40),
    siteName: site.name,
    footer: site.locationLine || 'Melbourne, working Australia-wide.',
  })
}
