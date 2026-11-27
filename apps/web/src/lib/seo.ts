import type { Metadata } from 'next'
import { getSite } from './data'
import { media } from './utils'
import { plainHeading } from '@/components/ui'
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

export async function pageMetadata(input: PageMeta): Promise<Metadata> {
  // Headings can carry two-tone markup (*grey*, ~ink~, {pill}); metadata wants plain text.
  const p = { ...input, title: plainHeading(input.title), heading: plainHeading(input.heading) || null }
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

/**
 * Known Australian places, typed and tied to Wikidata so search engines and AI assistants resolve
 * "Melbourne" to Melbourne, Victoria, not Melbourne, Florida.
 */
const knownPlaces: Record<string, { type: string; wikidata: string }> = {
  melbourne: { type: 'City', wikidata: 'Q3141' },
  victoria: { type: 'State', wikidata: 'Q36687' },
  australia: { type: 'Country', wikidata: 'Q408' },
}

export function placeJsonLd(name: string) {
  const known = knownPlaces[name.trim().toLowerCase()]
  return known
    ? { '@type': known.type, name, sameAs: `https://www.wikidata.org/wiki/${known.wikidata}` }
    : { '@type': 'Place', name }
}

export function areasServed(site: Site): string[] {
  const areas = site.business?.areaServed
  return areas?.length ? areas.map((a) => a.name) : ['Melbourne', 'Victoria', 'Australia']
}

/** A standing FAQ for the question every visitor outside Melbourne has. */
export function locationFaq(site: Site): { question: string; answer: string } {
  const city = site.business?.locality || 'Melbourne'
  return {
    question: `Do you only work with ${city} businesses?`,
    answer: `No. We're based in ${city} and work with businesses across Victoria and the rest of Australia. Calls and screen shares cover most of a project, and every enquiry gets a reply within one business day.`,
  }
}

type ServiceRef = { title: string; slug?: string | null; summary?: string | null }

export function businessJsonLd(site: Site, services: ServiceRef[] = []) {
  const b = site.business
  const areas = areasServed(site)
  const abn = site.abn?.replace(/\s+/g, '')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': ids.business,
        name: site.name,
        legalName: site.ownerName ? `${site.ownerName} trading as ${site.name}` : undefined,
        url: siteUrl,
        description: site.seo?.defaultDescription || site.tagline,
        slogan: site.tagline ?? undefined,
        email: site.email ?? undefined,
        telephone: b?.phone || undefined,
        priceRange: b?.priceRange || undefined,
        currenciesAccepted: 'AUD',
        image: absoluteUrl('/og'),
        logo: absoluteUrl('/logo.png'),
        ...(abn
          ? {
              taxID: abn,
              identifier: {
                '@type': 'PropertyValue',
                propertyID: 'ABN',
                value: abn,
                url: `https://abr.business.gov.au/ABN/View?abn=${abn}`,
              },
            }
          : {}),
        address: {
          '@type': 'PostalAddress',
          streetAddress: b?.streetAddress || undefined,
          addressLocality: b?.locality || 'Melbourne',
          addressRegion: b?.region || 'VIC',
          postalCode: b?.postcode || undefined,
          addressCountry: 'AU',
        },
        areaServed: areas.map(placeJsonLd),
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: site.email ?? undefined,
          telephone: b?.phone || undefined,
          url: absoluteUrl('/contact'),
          areaServed: 'AU',
          availableLanguage: 'English',
        },
        founder: { '@id': ids.person },
        sameAs: profileUrls(site),
        ...(services.length
          ? {
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Services',
                itemListElement: services.filter((s) => s.slug).map((s) => ({
                  '@type': 'Offer',
                  itemOffered: {
                    '@id': absoluteUrl(`/services/${s.slug}#service`),
                    '@type': 'Service',
                    name: s.title,
                    description: s.summary ?? undefined,
                    url: absoluteUrl(`/services/${s.slug}`),
                  },
                })),
              },
            }
          : {}),
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
        jobTitle: 'Founder and software developer',
        worksFor: { '@id': ids.business },
        url: absoluteUrl('/about'),
        homeLocation: placeJsonLd(b?.locality || 'Melbourne'),
        sameAs: profileUrls(site),
      },
      {
        '@type': 'WebSite',
        '@id': ids.website,
        url: siteUrl,
        name: site.name,
        inLanguage: 'en-AU',
        publisher: { '@id': ids.business },
        about: { '@id': ids.business },
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
