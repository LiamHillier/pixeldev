import type { Metadata } from 'next'
import { PageHeader, ULink } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { getContactPage, getSite } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata, absoluteUrl, ids } from '@/lib/seo'
import { ContactForm } from './ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage()
  return pageMetadata({
    path: '/contact',
    seo: page.seo,
    title: 'Contact',
    heading: page.heading,
    eyebrow: page.eyebrow,
    description: page.intro,
  })
}

export default async function ContactPage() {
  const [page, site] = await Promise.all([getContactPage(), getSite()])
  const steps = page.nextSteps?.items ?? []

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            url: absoluteUrl('/contact'),
            name: page.heading,
            about: { '@id': ids.business },
          },
        ]}
      />
      <PageHeader
        eyebrow={page.eyebrow}
        heading={page.heading}
        intro={page.intro}
        className="max-w-[820px] lg:pt-[88px] lg:pb-14"
      />

      <section className="flex flex-wrap gap-x-20 gap-y-14 pb-24 border-t border-ink">
        <div className="flex-[999_1_520px] min-w-0">
          <ContactForm
            needOptions={(page.form?.needOptions ?? []).map((o) => o.label)}
            budgetOptions={(page.form?.budgetOptions ?? []).map((o) => o.label)}
            submitLabel={page.form?.submitLabel ?? 'Send it'}
            submitNote={page.form?.submitNote}
            successHeading={page.form?.successHeading ?? 'Got it.'}
            successBody={page.form?.successBody}
          />
        </div>

        <aside className="flex-[1_1_260px] flex flex-col gap-10 pt-12">
          {steps.length ? (
            <div className="flex flex-col gap-5">
              <p className="text-[13px] text-faint">{page.nextSteps?.heading}</p>
              {steps.map((s, i) => (
                <div
                  key={s.id ?? i}
                  className="grid grid-cols-[40px_1fr] gap-3 pt-3.5 border-t border-rule"
                >
                  <span className="font-serif text-[26px] leading-none text-faint">{i + 1}</span>
                  <p className="text-[15px] text-body">{s.text}</p>
                </div>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col gap-2.5 text-[15px] pt-5 border-t border-ink">
            <p className="text-[13px] text-faint">{page.aside?.directHeading ?? 'Or directly'}</p>
            {site.email ? (
              <ULink href={`mailto:${site.email}`} className="text-[15px] self-start">
                {site.email}
              </ULink>
            ) : null}
            {site.linkedin ? (
              <ULink href={site.linkedin} className="text-[15px] self-start">
                LinkedIn
              </ULink>
            ) : null}
            {page.aside?.directNote ? <p className="text-muted">{page.aside.directNote}</p> : null}
          </div>
          {page.aside?.supportHeading ? (
            <div className="flex flex-col gap-1.5 text-[15px] pt-5 border-t border-ink">
              <p className="font-semibold">{page.aside.supportHeading}</p>
              <p className="text-muted">
                {page.aside.supportNote}{' '}
                {site.supportEmail ? (
                  <a href={`mailto:${site.supportEmail}`} className="link-u">
                    {site.supportEmail}
                  </a>
                ) : null}
              </p>
            </div>
          ) : null}
        </aside>
      </section>
    </>
  )
}
