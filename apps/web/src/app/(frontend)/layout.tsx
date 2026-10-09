import type { Metadata } from 'next'
import { Hanken_Grotesk, Newsreader } from 'next/font/google'
import type { ReactNode } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { Container } from '@/components/ui'
import { getServices, getSite } from '@/lib/data'
import { businessJsonLd, clip, siteUrl } from '@/lib/seo'
import './globals.css'

// Pages are statically rendered and refreshed in the background. Edits in the admin show within a minute.
export const revalidate = 60

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  axes: ['opsz'],
  style: ['normal', 'italic'],
  weight: 'variable',
  display: 'swap',
})

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  return {
    metadataBase: new URL(siteUrl),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: clip(site.seo?.defaultDescription || site.tagline),
    applicationName: site.name,
    authors: site.ownerName ? [{ name: site.ownerName, url: '/about' }] : undefined,
    creator: site.ownerName ?? undefined,
    formatDetection: { telephone: false, email: false, address: false },
    other: { 'geo.region': 'AU-VIC', 'geo.placename': 'Melbourne' },
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const [site, services] = await Promise.all([getSite(), getServices()])
  const nav = (site.nav ?? []).map((n) => ({ label: n.label, href: n.href }))
  return (
    <html lang="en-AU" className={`${newsreader.variable} ${hanken.variable}`}>
      <body>
        <JsonLd data={businessJsonLd(site)} />
        <Container>
          <Header name={site.name} nav={nav} ctaLabel={site.headerCtaLabel ?? 'Start a project'} />
          <main>{children}</main>
          <Footer site={site} services={services} />
        </Container>
      </body>
    </html>
  )
}
