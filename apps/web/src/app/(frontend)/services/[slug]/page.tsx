import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Figure, type Tint } from '@/components/Figure'
import { JsonLd } from '@/components/JsonLd'
import {
  Button,
  ClosingCta,
  Crumb,
  Faqs,
  NumberedCard,
  RuledList,
  SmartLink,
  SplitSection,
  TwoTone,
  ULink,
} from '@/components/ui'
import { RelatedWork } from '@/components/WorkCard'
import { getService, getServices, getSite } from '@/lib/data'
import { absoluteUrl, breadcrumbJsonLd, ids, pageMetadata } from '@/lib/seo'
import { cx, docs } from '@/lib/utils'
import type { Work } from '@/payload-types'

type Params = { params: Promise<{ slug: string }> }

const tints: Tint[] = ['teal', 'blue', 'lilac']

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
  const [service, site, services] = await Promise.all([getService(slug), getSite(), getServices()])
  if (!service) notFound()

  const related = docs<Work>(service.relatedWork)
  const plans = service.plans?.items ?? []
  const approach = service.approach?.items ?? []
  const index = Math.max(0, services.findIndex((s) => s.id === service.id))

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
      <section className="flex flex-col gap-10 lg:gap-12 pt-14 lg:pt-14">
        <Crumb parent="Services" parentHref="/services" current={service.title} />
        <h1 className="h-detail max-w-[1240px]">
          <TwoTone text={service.hero.heading} />
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
          <p className="lead flex-[1_1_420px] max-w-[700px]">{service.hero.intro}</p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
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
        </div>
      </section>

      {service.figure?.image || service.figure?.placeholder ? (
        <Figure
          data={service.figure}
          tint={tints[index % tints.length]}
          frameClassName="aspect-[16/7.2] min-h-[220px]"
          className="pt-14"
          priority
        />
      ) : null}

      {service.painPoints?.items?.length ? (
        <section className="section-gap flex flex-col gap-12 lg:gap-14">
          <h2 className="h-section">
            <TwoTone text={service.painPoints.heading ?? 'Sound familiar?'} />
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(270px,100%),1fr))] gap-x-8 gap-y-10">
            {service.painPoints.items.map((p) => (
              <div
                key={p.id ?? p.title}
                className="flex flex-col gap-3 pt-[22px] border-t-2 border-ink"
              >
                <p className="text-[21px] lg:text-[22px] leading-[1.25] tracking-[-0.025em]">
                  {p.title}
                </p>
                <p className="text-[16px] text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {service.offerings?.items?.length ? (
        <SplitSection
          heading={<TwoTone text={service.offerings.heading ?? 'What we build'} />}
          intro={service.offerings.intro}
        >
          <RuledList items={service.offerings.items} />
        </SplitSection>
      ) : null}

      {approach.length ? (
        <section className="section-gap flex flex-col gap-12 lg:gap-16">
          <h2 className="h-section">
            <TwoTone text={service.approach?.heading ?? 'How we approach it'} />
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-10 gap-y-12">
            {approach.map((a, i) => (
              <NumberedCard
                key={a.id ?? i}
                n={i + 1}
                title={a.title}
                body={a.body}
                last={i === approach.length - 1}
              />
            ))}
          </div>
        </section>
      ) : null}

      {plans.length ? (
        <section className="section-gap flex flex-col gap-12 lg:gap-14">
          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-5">
            <h2 className="h-section flex-[1_1_420px]">
              <TwoTone text={service.plans?.heading} />
            </h2>
            {service.plans?.intro ? (
              <p className="flex-[1_1_340px] max-w-[480px] text-[18px] text-muted">
                {service.plans.intro}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-4">
            {plans.map((p) => {
              const inner = (
                <>
                  <h3 className="text-[26px] leading-[1.12]">{p.name}</h3>
                  {p.price ? <p className="text-[16px] font-medium">{p.price}</p> : null}
                  {p.body ? <p className="mt-auto text-[16px] text-muted">{p.body}</p> : null}
                </>
              )
              const cls = cx(
                'flex flex-col gap-2.5 min-h-[220px] p-7 rounded-xl bg-fill',
                p.href && 'row-hover',
              )
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
