import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Figure, type Tint } from '@/components/Figure'
import { JsonLd } from '@/components/JsonLd'
import { DiagramFigure } from '@/components/services/SystemDiagram'
import {
  ApproachSteps,
  HeroActions,
  OfferingsSplit,
  PlanCards,
  RelatedCases,
  SoundFamiliar,
} from '@/components/services/sections'
import { ClosingCta, Crumb, Faqs, TwoTone, plainHeading } from '@/components/ui'
import { getService, getServices, getSite } from '@/lib/data'
import {
  absoluteUrl,
  areasServed,
  breadcrumbJsonLd,
  ids,
  locationFaq,
  pageMetadata,
  placeJsonLd,
} from '@/lib/seo'
import { docs } from '@/lib/utils'
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
    title: `${plainHeading(service.title)} in Melbourne`,
    heading: plainHeading(service.hero.heading),
    eyebrow: service.title,
    description: service.hero.intro,
  })
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params
  const [service, site, services] = await Promise.all([getService(slug), getSite(), getServices()])
  if (!service) notFound()

  const related = docs<Work>(service.relatedWork)
  const index = Math.max(0, services.findIndex((s) => s.id === service.id))
  const tint = tints[index % tints.length]
  const hasDiagram = Boolean(service.diagram?.inputs?.length)
  const hasFigure = Boolean(service.figure?.image)

  const path = `/services/${service.slug}`
  const areas = areasServed(site)
  const where = locationFaq(site)
  const faqs = [
    ...(service.faqs ?? []),
    // Every service page answers "do you work outside Melbourne?", unless an editor already has.
    ...(service.faqs?.some((f) => /only work with|outside melbourne/i.test(f.question)) ? [] : [where]),
  ]

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
            areaServed: areas.map(placeJsonLd),
            ...(service.offerings?.items?.length
              ? {
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: plainHeading(service.offerings.heading) || service.title,
                    itemListElement: service.offerings.items.map((o) => ({
                      '@type': 'Offer',
                      itemOffered: { '@type': 'Service', name: o.title, description: o.body },
                    })),
                  },
                }
              : {}),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((q) => ({
              '@type': 'Question',
              name: q.question,
              acceptedAnswer: { '@type': 'Answer', text: q.answer },
            })),
          },
        ]}
      />

      <section className="hero-in flex flex-col gap-10 lg:gap-12 pt-10 lg:pt-14">
        <Crumb parent="Services" parentHref="/services" current={service.title} />
        <h1 className="h-detail max-w-[1240px]">
          <TwoTone text={service.hero.heading} />
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
          <p className="lead flex-[1_1_420px] max-w-[700px]">{service.hero.intro}</p>
          <HeroActions primary={service.hero.primaryCta} secondary={service.hero.secondaryCta} />
        </div>
      </section>

      {hasDiagram ? (
        <DiagramFigure data={service.diagram} tint={tint} className="hero-fig pt-12 lg:pt-14" />
      ) : hasFigure ? (
        <Figure
          data={service.figure}
          tint={tint}
          frameClassName="aspect-[16/7.2] min-h-[220px]"
          className="hero-fig pt-12 lg:pt-14"
          priority
        />
      ) : null}

      <SoundFamiliar heading={service.painPoints?.heading} items={service.painPoints?.items} />

      <OfferingsSplit
        heading={service.offerings?.heading}
        intro={service.offerings?.intro}
        items={service.offerings?.items}
      />

      <ApproachSteps heading={service.approach?.heading} items={service.approach?.items} />

      <PlanCards
        heading={service.plans?.heading}
        intro={service.plans?.intro}
        items={service.plans?.items}
      />

      <RelatedCases heading={service.relatedHeading} items={related} />

      <Faqs heading={service.faqsHeading} items={faqs} />

      <ClosingCta
        heading={service.closing?.heading}
        body={service.closing?.body}
        ctaLabel={service.closing?.ctaLabel}
      />
    </>
  )
}
