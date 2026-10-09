import type { Metadata } from 'next'
import { getSite } from './data'
import { media } from './utils'
import type { Media, Site } from '@/payload-types'

export const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

/** Trim to a search-snippet length on a word boundary. */
export function clip(text: string | null | undefined, max = 160): string | undefined {
  if (!text) return undefined
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`
}

type Seo =
  | {
      title?: string | null
      description?: string | null
      image?: Media | number | null
      noIndex?: boolean | null
    }
  | null
  | undefined

type PageMeta = {
  path: string
  seo?: Seo
  /** Fallback title, used when the editor hasn't set an SEO title. */
  title: string
  /** Fallback description, usually the page intro. */
  description?: string | null
  /** Large text on the generated share card. Defaults to the title. */
  heading?: string | null
  /** Small label on the generated share card. */
  eyebrow?: string | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  /** The home page sets its full title without the " | Site" suffix. */
  absoluteTitle?: boolean
}

export async function pageMetadata(p: PageMeta): Promise<Metadata> {
  const site = await getSite()
  const title = p.seo?.title || p.title
  const description = clip(
    p.seo?.description || p.description || site.seo?.defaultDescription || site.tagline,
  )
  const uploaded = media(p.seo?.image)
  const fullTitle = p.absoluteTitle ? title : `${title} | ${site.name}`
  const image = uploaded?.url
    ? {
        url: absoluteUrl(uploaded.url),
        width: uploaded.width ?? undefined,
        height: uploaded.height ?? undefined,
        alt: uploaded.alt,
      }
    : {
        url: absoluteUrl(
          `/og?${new URLSearchParams({
            title: p.heading || p.title,
            ...(p.eyebrow ? { eyebrow: p.eyebrow } : {}),
          })}`,
        ),
        width: 1200,
        height: 630,
        alt: p.heading || p.title,
      }

  return {
    title: p.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: p.path },
    robots: p.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: p.type ?? 'website',
      url: p.path,
      siteName: site.name,
      locale: 'en_AU',
      title: fullTitle,
      description,
      images: [image],
      ...(p.type === 'article'
        ? {
            publishedTime: p.publishedTime ?? undefined,
            modifiedTime: p.modifiedTime ?? undefined,
            authors: site.ownerName ? [site.ownerName] : undefined,
          }
        : {}),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [image.url] },
  }
}

// Structured data ------------------------------------------------------------

export const ids = {
  business: `${siteUrl}/#business`,
  website: `${siteUrl}/#website`,
  person: `${siteUrl}/#person`,
}

/** LinkedIn's bare homepage is a placeholder, not a profile. */
function profileUrls(site: Site): string[] {
  return [site.linkedin].filter((u): u is string => {
    if (!u) return false
    try {
      return new URL(u).pathname.length > 1
    } catch {
      return false
    }
  })
}

export function businessJsonLd(site: Site) {
  const b = site.business
  const areas = b?.areaServed?.length
    ? b.areaServed.map((a) => a.name)
    : ['Melbourne', 'Victoria', 'Australia']
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': ids.business,
        name: site.name,
        url: siteUrl,
        description: site.seo?.defaultDescription || site.tagline,
        email: site.email ?? undefined,
        telephone: b?.phone || undefined,
        priceRange: b?.priceRange || undefined,
        image: absoluteUrl('/og'),
        logo: absoluteUrl('/logo.png'),
        address: {
          '@type': 'PostalAddress',
          streetAddress: b?.streetAddress || undefined,
          addressLocality: b?.locality || 'Melbourne',
          addressRegion: b?.region || 'VIC',
          postalCode: b?.postcode || undefined,
          addressCountry: 'AU',
        },
        areaServed: areas.map((name) => ({ '@type': 'Place', name })),
        founder: { '@id': ids.person },
        sameAs: profileUrls(site),
        knowsAbout: [
          'Custom software development',
          'CRM development',
          'AI automation',
          'API integrations',
          'Xero and MYOB integrations',
          'WordPress development',
          'WooCommerce development',
          'Managed WordPress hosting',
          'Next.js',
        ],
      },
      {
        '@type': 'Person',
        '@id': ids.person,
        name: site.ownerName,
        jobTitle: 'Software developer',
        worksFor: { '@id': ids.business },
        url: absoluteUrl('/about'),
        homeLocation: { '@type': 'Place', name: 'Melbourne, Victoria, Australia' },
        sameAs: profileUrls(site),
      },
      {
        '@type': 'WebSite',
        '@id': ids.website,
        url: siteUrl,
        name: site.name,
        inLanguage: 'en-AU',
        publisher: { '@id': ids.business },
      },
    ],
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const all = [{ name: 'Home', path: '/' }, ...items]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
