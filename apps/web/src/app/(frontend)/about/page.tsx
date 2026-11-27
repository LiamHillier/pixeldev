import type { Metadata } from 'next'
import { Figure } from '@/components/Figure'
import { ClosingCta, Eyebrow, RuledList, SplitSection, TwoTone } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { getAboutPage } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata, absoluteUrl, ids } from '@/lib/seo'
import { cx } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage()
  return pageMetadata({
    path: '/about',
    seo: page.seo,
    title: 'About',
    heading: page.heading,
    eyebrow: page.eyebrow,
    description: page.intro,
  })
}

export default async function AboutPage() {
  const page = await getAboutPage()
  const background = page.background?.items ?? []
  const promises = page.promises?.items ?? []

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: 'About', path: '/about' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            url: absoluteUrl('/about'),
            name: page.heading,
            mainEntity: { '@id': ids.person },
          },
        ]}
      />
      <section className="flex flex-wrap items-end gap-x-24 gap-y-12 pt-14 lg:pt-[72px]">
        <div className="flex-[2_1_520px] min-w-0 flex flex-col gap-8 lg:gap-10">
          {page.eyebrow ? <Eyebrow>{page.eyebrow}</Eyebrow> : null}
          <h1 className="h-page">
            <TwoTone text={page.heading} />
          </h1>
          {page.intro ? <p className="lead max-w-[660px]">{page.intro}</p> : null}
          {page.body ? (
            <p className="max-w-[660px] text-[18px] leading-[1.55] text-body">{page.body}</p>
          ) : null}
        </div>
        <Figure
          data={page.photo}
          frameClassName="aspect-[4/5]"
          className="flex-[1_1_340px] max-w-[480px]"
          sizes="(min-width: 1024px) 480px, 100vw"
          priority
        />
      </section>

      {page.facts?.length ? (
        <section className="pt-20 lg:pt-28">
          <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-x-8 gap-y-8 py-12 lg:py-14 border-t border-b border-rule">
            {page.facts.map((f) => (
              <div key={f.id ?? f.label} className="flex flex-col gap-2">
                <dt className="text-[15px] text-muted">{f.label}</dt>
                <dd className="m-0 font-display font-medium text-[24px] lg:text-[28px] leading-[1.15] tracking-[-0.03em]">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {background.length ? (
        <SplitSection heading={<TwoTone text={page.background?.heading} />}>
          <div className="flex flex-col">
            {background.map((b, i) => (
              <div
                key={b.id ?? i}
                className={cx(
                  'flex flex-col gap-2.5 py-[26px] border-t',
                  i === 0 ? 'border-ink' : 'border-rule',
                  i === background.length - 1 && 'border-b border-b-rule',
                )}
              >
                <h3 className="text-[24px] lg:text-[26px] leading-[1.12]">{b.title}</h3>
                <p className="text-[16px] text-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </SplitSection>
      ) : null}

      {promises.length ? (
        <section className="section-gap">
          <div className="flex flex-wrap items-start gap-x-24 gap-y-10 p-6 sm:p-10 lg:p-16 rounded-xl bg-fill">
            <h2 className="h-section flex-[1_1_340px] min-w-0">
              <TwoTone text={page.promises?.heading} />
            </h2>
            <div className="flex-[1.4_1_460px] min-w-0 [&_li:last-child]:border-b-0 [&_li:last-child]:pb-0">
              <RuledList items={promises} />
            </div>
          </div>
        </section>
      ) : null}

      {page.solo?.heading ? (
        <section className="section-gap flex flex-wrap items-start gap-x-24 gap-y-8">
          <h2 className="h-section flex-[1_1_380px] min-w-0">
            <TwoTone text={page.solo.heading} />
          </h2>
          {page.solo.body ? (
            <p className="flex-[1.4_1_480px] min-w-0 max-w-[760px] text-[19px] leading-[1.6] text-body">
              {page.solo.body}
            </p>
          ) : null}
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
