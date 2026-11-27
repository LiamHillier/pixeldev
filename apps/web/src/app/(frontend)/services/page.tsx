import type { Metadata } from 'next'
import { BandSection, ServiceIndexRow, StatementGrid } from '@/components/services/sections'
import { ClosingCta, Eyebrow, TwoTone, plainHeading } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { getServices, getServicesPage } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata, absoluteUrl } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicesPage()
  return pageMetadata({
    path: '/services',
    seo: page.seo,
    title: 'Services',
    heading: plainHeading(page.heading),
    eyebrow: page.eyebrow,
    description: page.intro,
  })
}

export default async function ServicesIndex() {
  const [page, services] = await Promise.all([getServicesPage(), getServices()])
  const options = page.engagement?.options ?? []

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: 'Services', path: '/services' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Services',
            itemListElement: services.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: s.title,
              url: absoluteUrl(`/services/${s.slug}`),
            })),
          },
        ]}
      />

      <section className="hero-in flex flex-col gap-10 lg:gap-14 pt-12 lg:pt-[72px]">
        {page.eyebrow ? <Eyebrow>{page.eyebrow}</Eyebrow> : null}
        <h1 className="h-page max-w-[1200px]">
          <TwoTone text={page.heading} />
        </h1>
        {page.intro ? <p className="lead max-w-[700px]">{page.intro}</p> : null}
      </section>

      {services.length ? (
        <section className="flex flex-col pt-16 lg:pt-[78px]">
          {services.map((s, i) => (
            <ServiceIndexRow
              key={s.id}
              title={s.title}
              intro={s.indexIntro ?? s.summary}
              href={`/services/${s.slug}`}
              linkLabel={s.indexLinkLabel || `About ${s.title.toLowerCase()}`}
              items={s.indexItems}
              last={i === services.length - 1}
            />
          ))}
        </section>
      ) : null}

      {options.length ? (
        <BandSection>
          <div className="rv flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 className="h-section">
              <TwoTone text={page.engagement?.heading || 'Ways to *work together*'} />
            </h2>
            {page.engagement?.intro ? (
              <p className="text-[18px] text-muted">{page.engagement.intro}</p>
            ) : null}
          </div>
          <StatementGrid
            variant="card"
            min={300}
            items={options.map((o) => ({ title: o.title, meta: o.price, body: o.body }))}
          />
        </BandSection>
      ) : null}

      <ClosingCta
        heading={page.closing?.heading}
        body={page.closing?.body}
        ctaLabel={page.closing?.ctaLabel}
      />
    </>
  )
}
