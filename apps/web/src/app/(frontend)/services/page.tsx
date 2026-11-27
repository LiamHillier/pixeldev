import type { Metadata } from 'next'
import { ClosingCta, GoLink, PageHeader, TwoTone } from '@/components/ui'
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

const tints = ['bg-tint-teal', 'bg-tint-blue', 'bg-tint-lilac']

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

      <section className="flex flex-col pt-20 lg:pt-28">
        {services.map((s, i) => (
          <div
            key={s.id}
            className={cx(
              'flex flex-wrap items-start gap-x-24 gap-y-8 py-12 lg:py-16 border-t',
              i === 0 ? 'border-t-2 border-ink' : 'border-rule',
              i === services.length - 1 && 'border-b border-b-rule',
            )}
          >
            <div className="flex-[1_1_380px] min-w-0 flex flex-col gap-5">
              <p className="font-display font-medium text-[18px] text-grey tracking-[-0.02em]">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="h-row">{s.title}</h2>
              <p className="text-[17px] text-body max-w-[520px]">{s.indexIntro ?? s.summary}</p>
              <GoLink href={`/services/${s.slug}`} className="self-start">
                {s.indexLinkLabel ?? `About ${s.title.toLowerCase()}`}
              </GoLink>
            </div>
            {s.indexItems?.length ? (
              <ul className="flex-[1.4_1_480px] min-w-0 flex flex-col text-[16px] text-body m-0 p-0 list-none lg:pt-12">
                {s.indexItems.map((it, j) => (
                  <li
                    key={it.id ?? it.text}
                    className={cx('py-3.5 border-t', j === 0 ? 'border-ink' : 'border-rule')}
                  >
                    {it.text}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      {options.length ? (
        <section className="section-gap flex flex-col gap-12 lg:gap-14">
          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-5">
            <h2 className="h-section flex-[1_1_420px]">
              <TwoTone text={page.engagement?.heading} />
            </h2>
            {page.engagement?.intro ? (
              <p className="flex-[1_1_340px] max-w-[480px] text-[18px] text-muted">
                {page.engagement.intro}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
            {options.map((o, i) => (
              <div
                key={o.id ?? o.title}
                className={cx(
                  'flex flex-col gap-3 min-h-[240px] p-7 rounded-xl',
                  tints[i % tints.length],
                )}
              >
                <h3 className="text-[26px] leading-[1.12]">{o.title}</h3>
                {o.price ? <p className="text-[16px] font-medium">{o.price}</p> : null}
                <p className="mt-auto text-[16px] text-body">{o.body}</p>
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
