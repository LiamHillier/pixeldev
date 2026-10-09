import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Figure } from '@/components/Figure'
import { JsonLd } from '@/components/JsonLd'
import {
  Button,
  ClosingCta,
  Crumb,
  Faqs,
  NumberedCard,
  RuledList,
  SmartLink,
  ULink,
} from '@/components/ui'
import { RelatedWork } from '@/components/WorkCard'
import { getService, getServices, getSite } from '@/lib/data'
import { absoluteUrl, breadcrumbJsonLd, ids, pageMetadata } from '@/lib/seo'
import { docs } from '@/lib/utils'
import type { Work } from '@/payload-types'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return {}
  return pageMetadata({
    path: `/services/${service.slug}`,
    seo: service.seo,
    title: `${service.title} in Melbourne`,
    heading: service.hero.heading,
    eyebrow: service.title,
    description: service.hero.intro,
  })
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params
  const [service, site] = await Promise.all([getService(slug), getSite()])
  if (!service) notFound()

  const related = docs<Work>(service.relatedWork)
  const plans = service.plans?.items ?? []

  const path = `/services/${service.slug}`
  const areas = site.business?.areaServed?.length
    ? site.business.areaServed.map((a) => a.name)
    : ['Melbourne', 'Victoria', 'Australia']
  const faqs = service.faqs ?? []

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Services', path: '/services' },
            { name: service.title, path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': absoluteUrl(`${path}#service`),
            name: service.title,
            serviceType: service.title,
            description: service.hero.intro,
            url: absoluteUrl(path),
            provider: { '@id': ids.business },
            areaServed: areas.map((name) => ({ '@type': 'Place', name })),
            ...(service.offerings?.items?.length
              ? {
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: service.offerings.heading ?? service.title,
                    itemListElement: service.offerings.items.map((o) => ({
                      '@type': 'Offer',
                      itemOffered: { '@type': 'Service', name: o.title, description: o.body },
                    })),
                  },
                }
              : {}),
          },
          ...(faqs.length
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqs.map((q) => ({
                    '@type': 'Question',
                    name: q.question,
                    acceptedAnswer: { '@type': 'Answer', text: q.answer },
                  })),
                },
              ]
            : []),
        ]}
      />
      <section className="flex flex-col gap-7 pt-14 pb-12 lg:pt-[72px] lg:pb-16 max-w-[920px]">
        <Crumb parent="Services" parentHref="/services" current={service.title} />
        <h1 className="h-detail">{service.hero.heading}</h1>
        <p className="text-[21px] leading-[1.5] text-body max-w-[720px]">{service.hero.intro}</p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          {service.hero.primaryCta?.label ? (
            <Button href={service.hero.primaryCta.href || '/contact'}>
              {service.hero.primaryCta.label}
            </Button>
          ) : null}
          {service.hero.secondaryCta?.label ? (
            <ULink href={service.hero.secondaryCta.href || '/work'}>
              {service.hero.secondaryCta.label}
            </ULink>
          ) : null}
        </div>
      </section>

      {service.figure?.image || service.figure?.placeholder ? (
        <Figure
          data={service.figure}
          frameClassName="min-h-[280px] lg:min-h-[440px]"
          className="pb-16 lg:pb-20"
          priority
        />
      ) : null}

      {service.painPoints?.items?.length ? (
        <section className="flex flex-col gap-8 py-16 lg:py-20 border-t border-ink">
          <h2 className="h-section">{service.painPoints.heading ?? 'Sound familiar?'}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-x-16 gap-y-8">
            {service.painPoints.items.map((p) => (
              <div key={p.id ?? p.title} className="flex flex-col gap-2 pt-4 border-t border-rule">
                <p className="text-[19px] font-semibold">{p.title}</p>
                <p className="text-[16px] text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {service.offerings?.items?.length ? (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-x-20 gap-y-8 py-16 lg:py-20 border-t border-ink items-start">
          <div className="flex flex-col gap-4">
            <h2 className="h-section">{service.offerings.heading ?? 'What I build'}</h2>
            {service.offerings.intro ? (
              <p className="text-[17px] text-body max-w-[440px]">{service.offerings.intro}</p>
            ) : null}
          </div>
          <RuledList items={service.offerings.items} />
        </section>
      ) : null}

      {service.approach?.items?.length ? (
        <section className="flex flex-col gap-10 py-16 lg:py-20 border-t border-ink">
          <h2 className="h-section">{service.approach.heading ?? 'How I approach it'}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-10">
            {service.approach.items.map((a, i) => (
              <NumberedCard key={a.id ?? i} n={i + 1} title={a.title} body={a.body} />
            ))}
          </div>
        </section>
      ) : null}

      {plans.length ? (
        <section className="flex flex-col gap-8 py-16 lg:py-20 border-t border-ink">
          <div className="flex flex-col gap-3 max-w-[720px]">
            <h2 className="h-section">{service.plans?.heading}</h2>
            {service.plans?.intro ? (
              <p className="text-[17px] text-body">{service.plans.intro}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-8">
            {plans.map((p) => {
              const inner = (
                <>
                  <h3 className="text-[30px] leading-[1.1]">{p.name}</h3>
                  {p.price ? <p className="text-[15px] text-faint">{p.price}</p> : null}
                  {p.body ? <p className="text-[16px] text-muted">{p.body}</p> : null}
                </>
              )
              const cls = 'row-hover flex flex-col gap-2.5 pt-5 border-t border-ink'
              return p.href ? (
                <SmartLink key={p.id ?? p.name} href={p.href} className={cls}>
                  {inner}
                </SmartLink>
              ) : (
                <div key={p.id ?? p.name} className={cls}>
                  {inner}
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      <RelatedWork items={related} />

      <Faqs items={service.faqs} />

      <ClosingCta
        heading={service.closing?.heading}
        body={service.closing?.body}
        ctaLabel={service.closing?.ctaLabel}
      />
    </>
  )
}
