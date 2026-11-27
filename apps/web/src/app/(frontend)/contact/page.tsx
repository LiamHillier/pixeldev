import type { Metadata } from 'next'
import { PageHeader, ULink } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { getContactPage, getSite } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata, absoluteUrl, ids } from '@/lib/seo'
import { cx } from '@/lib/utils'
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
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />

      <section className="flex flex-wrap items-start gap-x-24 gap-y-16 pt-16 lg:pt-24 pb-24 lg:pb-[136px]">
        <div className="flex-[999_1_540px] min-w-0 max-w-[780px]">
          <ContactForm
            needOptions={(page.form?.needOptions ?? []).map((o) => o.label)}
            budgetOptions={(page.form?.budgetOptions ?? []).map((o) => o.label)}
            submitLabel={page.form?.submitLabel ?? 'Send it'}
            submitNote={page.form?.submitNote}
            successHeading={page.form?.successHeading ?? 'Got it.'}
            successBody={page.form?.successBody}
          />
        </div>

        <aside className="flex-[1_1_300px] min-w-0 flex flex-col gap-12">
          {steps.length ? (
            <div className="flex flex-col">
              <p className="pb-4 text-[15px] text-muted">{page.nextSteps?.heading}</p>
              {steps.map((s, i) => (
                <div
                  key={s.id ?? i}
                  className={cx(
                    'flex gap-5 py-[18px] border-t',
                    i === 0 ? 'border-ink' : 'border-rule',
                    i === steps.length - 1 && 'border-b border-b-rule',
                  )}
                >
                  <span
                    className={cx(
                      'shrink-0 w-6 font-display font-medium text-[24px] leading-[1.1]',
                      i === steps.length - 1 ? 'text-ink' : 'text-grey',
                    )}
                  >
                    {i + 1}
                  </span>
                  <p className="text-[16px] text-body">{s.text}</p>
                </div>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col gap-1 text-[16px]">
            <p className="pb-2 text-[15px] text-muted">{page.aside?.directHeading ?? 'Or directly'}</p>
            {site.email ? (
              <ULink href={`mailto:${site.email}`} className="self-start text-[16px]">
                {site.email}
              </ULink>
            ) : null}
            {site.linkedin ? (
              <ULink href={site.linkedin} className="self-start text-[16px]">
                LinkedIn
              </ULink>
            ) : null}
            {page.aside?.directNote ? (
              <p className="pt-2 text-muted">{page.aside.directNote}</p>
            ) : null}
          </div>
          {page.aside?.supportHeading ? (
            <div className="flex flex-col gap-2 p-6 rounded-xl bg-fill text-[16px]">
              <p className="font-medium">{page.aside.supportHeading}</p>
              <p className="text-muted">
                {page.aside.supportNote}{' '}
                {site.supportEmail ? (
                  <a href={`mailto:${site.supportEmail}`} className="link-u text-ink">
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
