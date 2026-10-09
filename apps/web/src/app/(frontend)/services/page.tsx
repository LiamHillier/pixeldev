import type { Metadata } from 'next'
import { ClosingCta, PageHeader, ULink } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { getServices, getServicesPage } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata, absoluteUrl } from '@/lib/seo'
import { cx } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicesPage()
  return pageMetadata({
    path: '/services',
    seo: page.seo,
    title: 'Services',
    heading: page.heading,
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
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />

      <section className="flex flex-col border-t border-ink">
        {services.map((s, i) => (
          <div
            key={s.id}
            className={cx(
              'grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-x-20 gap-y-8 py-14 border-b items-start',
              i === services.length - 1 ? 'border-ink' : 'border-rule',
            )}
          >
            <div className="flex flex-col gap-[18px]">
              <h2
                className="font-serif leading-[1.05] tracking-[-0.015em]"
                style={{ fontSize: 'clamp(30px, 3.4vw, 44px)' }}
              >
                {s.title}
              </h2>
              <p className="text-[17px] text-body">{s.indexIntro ?? s.summary}</p>
              <ULink href={`/services/${s.slug}`} className="self-start">
                {s.indexLinkLabel ?? `About ${s.title.toLowerCase()}`}
              </ULink>
            </div>
            {s.indexItems?.length ? (
              <ul className="flex flex-col text-[16px] text-body m-0 p-0 list-none">
                {s.indexItems.map((it) => (
                  <li key={it.id ?? it.text} className="py-3 border-t border-rule">
                    {it.text}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      {options.length ? (
        <section className="flex flex-col gap-10 py-16 lg:py-24">
          <div className="flex flex-col gap-3 max-w-[720px]">
            <h2 className="h-section">{page.engagement?.heading}</h2>
            {page.engagement?.intro ? (
              <p className="text-[18px] text-body">{page.engagement.intro}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-10">
            {options.map((o) => (
              <div key={o.id ?? o.title} className="flex flex-col gap-3 pt-5 border-t border-ink">
                <h3 className="text-[28px] leading-[1.15]">{o.title}</h3>
                {o.price ? <p className="text-[15px] text-faint">{o.price}</p> : null}
                <p className="text-[16px] text-body">{o.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <ClosingCta
        heading={page.closing?.heading}
        body={page.closing?.body}
        ctaLabel={page.closing?.ctaLabel}
      />
    </>
  )
}
