import type { Metadata } from 'next'
import { ClientNames } from '@/components/about/ClientNames'
import { Figure } from '@/components/Figure'
import { ClosingCta, Eyebrow, Marquee, SmartLink, StatBand, TwoTone, plainHeading } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { getAboutPage, getClientNames, getContactPage, getSite } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata, absoluteUrl, ids } from '@/lib/seo'
import { cx, media } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage()
  return pageMetadata({
    path: '/about',
    seo: page.seo,
    title: 'About',
    heading: plainHeading(page.heading),
    eyebrow: page.eyebrow,
    description: page.intro,
  })
}

export default async function AboutPage() {
  const [page, site, contact, clients] = await Promise.all([
    getAboutPage(),
    getSite(),
    getContactPage(),
    getClientNames(),
  ])
  const background = page.background?.items ?? []
  const promises = page.promises?.items ?? []
  const hasPhoto = Boolean(media(page.photo?.image)?.url)
  const phone = site.business?.phone?.trim()
  const bookingUrl = contact.options?.booking?.bookingUrl?.trim()

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: 'About', path: '/about' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            url: absoluteUrl('/about'),
            name: plainHeading(page.heading),
            mainEntity: { '@id': ids.person },
          },
        ]}
      />

      <section className="hero-in flex flex-wrap items-end gap-x-[88px] gap-y-12 pt-14 lg:pt-[72px]">
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
          data={{ ...page.photo, placeholder: null }}
          frameClassName={cx('aspect-[4/5]', !hasPhoto && 'ph')}
          className="flex-[1_1_340px] max-w-[480px]"
          sizes="(min-width: 1024px) 480px, 100vw"
          priority
        />
      </section>

      <StatBand stats={page.stats} />

      <ClientNames label={page.clients?.label} names={clients} />

      {background.length ? (
        <section className="flex flex-wrap items-start gap-x-24 gap-y-10 pt-24 lg:pt-[110px]">
          <h2 className="rv h-section flex-[1_1_380px] min-w-0">
            <TwoTone text={page.background?.heading} />
          </h2>
          <div className="rv flex-[1.4_1_480px] min-w-0 flex flex-col">
            {background.map((b, i) => (
              <div
                key={b.id ?? i}
                className={cx(
                  'flex flex-col gap-2.5 py-[26px] border-t',
                  i === 0 ? 'wipe border-ink' : 'border-rule',
                  i === background.length - 1 && 'border-b border-b-rule',
                )}
              >
                <h3 className="text-[24px] lg:text-[26px] leading-[1.12] tracking-[-0.03em]">
                  {b.title}
                </h3>
                <p className="text-[16px] text-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {promises.length ? (
        <section className="pt-24 lg:pt-[110px]">
          <div
            className="rv flex flex-wrap items-start gap-x-24 gap-y-10 rounded-xl bg-fill"
            style={{ padding: 'clamp(28px, 4.4vw, 64px)' }}
          >
            <h2 className="h-section flex-[1_1_340px] min-w-0">
              <TwoTone text={page.promises?.heading} />
            </h2>
            <ul className="ruled rv-li flex-[1.4_1_460px] min-w-0 flex flex-col">
              {promises.map((p, i) => (
                <li
                  key={p.id ?? i}
                  className={cx(
                    'flex flex-col gap-1.5 pr-12 border-t',
                    i === 0 ? 'border-ink' : 'border-line',
                    i === promises.length - 1 ? 'pt-[22px]' : 'py-[22px]',
                  )}
                >
                  <span className="text-[19px] font-medium tracking-[-0.02em]">{p.title}</span>
                  <span className="text-[16px] text-muted">{p.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {page.solo?.heading ? (
        <section className="section-gap flex flex-wrap items-start gap-x-24 gap-y-8">
          <h2 className="rv h-section flex-[1_1_380px] min-w-0">
            <TwoTone text={page.solo.heading} />
          </h2>
          {page.solo.body ? (
            <p className="rv flex-[1.4_1_480px] min-w-0 max-w-[760px] text-[18px] lg:text-[19px] leading-[1.6] text-body">
              {page.solo.body}
            </p>
          ) : null}
        </section>
      ) : null}

      <ClosingCta
        heading={page.closing?.heading}
        body={page.closing?.body}
        ctaLabel={page.closing?.ctaLabel}
        secondary={
          <>
            {bookingUrl ? (
              <SmartLink href={bookingUrl} className="u inline-flex items-center min-h-[44px] text-[17px]">
                {contact.options?.booking?.title || 'Book a 30-minute call'}
              </SmartLink>
            ) : null}
            {phone ? (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="u inline-flex items-center min-h-[44px] text-[17px]"
              >
                Or call {phone}
              </a>
            ) : null}
          </>
        }
      />

      <Marquee items={clients} label="Businesses we’ve built for" />
    </>
  )
}
