import type { Metadata } from 'next'
import { ContactAside } from '@/components/contact/ContactAside'
import { OptionCards, type OptionCard } from '@/components/contact/OptionCards'
import { Eyebrow, Marquee, TwoTone, plainHeading } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { getClientNames, getContactPage, getSite } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata, absoluteUrl, ids } from '@/lib/seo'
import { cx } from '@/lib/utils'
import { ContactForm } from './ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage()
  return pageMetadata({
    path: '/contact',
    seo: page.seo,
    title: 'Contact',
    heading: plainHeading(page.heading),
    eyebrow: page.eyebrow,
    description: page.intro,
  })
}

export default async function ContactPage() {
  const [page, site, clients] = await Promise.all([getContactPage(), getSite(), getClientNames()])
  const steps = (page.nextSteps?.items ?? []).map((s) => s.text).filter(Boolean)
  const phone = site.business?.phone?.trim() || null
  const opts = page.options
  const bookingUrl = opts?.booking?.bookingUrl?.trim()

  const cards: OptionCard[] = []
  if (bookingUrl) {
    cards.push({
      title: opts?.booking?.title || 'Book a 30-minute call',
      body: opts?.booking?.body,
      href: bookingUrl,
      tint: 'teal',
    })
  }
  if (phone) {
    cards.push({
      title: `${opts?.call?.title || 'Call'} ${phone}`,
      body: opts?.call?.body,
      href: `tel:${phone.replace(/[^\d+]/g, '')}`,
      tint: 'blue',
    })
  }
  // The message card only earns its place next to another way to get in touch. On its own it is a
  // big box pointing at the form directly under it, so the form simply follows the intro.
  if (cards.length) {
    cards.push({
      title: opts?.message?.title || 'Send a message below',
      body: opts?.message?.body,
      href: '#form',
      tint: 'lilac',
    })
  }

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            url: absoluteUrl('/contact'),
            name: plainHeading(page.heading),
            about: { '@id': ids.business },
          },
        ]}
      />

      <section className="hero-in flex flex-col gap-8 lg:gap-12 pt-14 lg:pt-[72px]">
        {page.eyebrow ? <Eyebrow>{page.eyebrow}</Eyebrow> : null}
        <h1 className="h-page max-w-[1200px]">
          <TwoTone text={page.heading} />
        </h1>
        {page.intro ? <p className="lead max-w-[700px]">{page.intro}</p> : null}
      </section>

      <OptionCards cards={cards} />

      <section
        id="form"
        className={cx(
          'flex flex-wrap items-start gap-x-24 gap-y-16 pb-[60px]',
          cards.length ? 'pt-24 lg:pt-28' : 'pt-16 lg:pt-24',
        )}
      >
        <div className="rv flex-[999_1_540px] min-w-0 max-w-[780px]">
          <ContactForm
            submitLabel={page.form?.submitLabel ?? 'Send it'}
            submitNote={page.form?.submitNote}
            successHeading={page.form?.successHeading ?? 'Got it.'}
            successBody={page.form?.successBody}
          />
        </div>

        <ContactAside
          stepsHeading={page.nextSteps?.heading}
          steps={steps}
          directHeading={page.aside?.directHeading}
          email={site.email}
          phone={phone}
          linkedin={site.linkedin}
          directNote={page.aside?.directNote}
          supportHeading={page.aside?.supportHeading}
          supportNote={page.aside?.supportNote}
          supportEmail={site.supportEmail || site.email}
        />
      </section>

      <Marquee items={clients} label="Businesses we’ve built for" />
    </>
  )
}
