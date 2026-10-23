import type { ReactNode } from 'react'
import { JsonLd } from '@/components/JsonLd'
import { PageHeader } from '@/components/ui'
import { absoluteUrl, breadcrumbJsonLd } from '@/lib/seo'
import { slugify } from '@/fields/slug'

export type LegalSection = { heading: string; body: ReactNode }

/** Shared layout for /privacy and /terms: header, contents list, then the sections. */
export function LegalPage({
  path,
  title,
  heading,
  intro,
  updated,
  sections,
}: {
  path: string
  title: string
  heading: string
  intro: string
  updated: string
  sections: LegalSection[]
}) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: title, path }]),
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            url: absoluteUrl(path),
            name: heading,
            inLanguage: 'en-AU',
          },
        ]}
      />
      <PageHeader eyebrow={`Last updated ${updated}`} heading={heading} intro={intro} />

      <section className="flex flex-wrap gap-x-20 gap-y-12 pb-24">
        <aside className="flex-[1_1_240px] lg:order-2">
          <nav
            aria-label="On this page"
            className="flex flex-col gap-3 pt-5 border-t border-ink text-[15px] lg:sticky lg:top-8"
          >
            <p className="text-[13px] text-faint">On this page</p>
            {sections.map((s) => (
              <a key={s.heading} href={`#${slugify(s.heading)}`} className="hover:text-accent">
                {s.heading}
              </a>
            ))}
          </nav>
        </aside>
        <article className="prose-pd flex-[999_1_540px] min-w-0 max-w-[720px]">
          {sections.map((s) => (
            <div key={s.heading} className="flex flex-col gap-6">
              <h2 id={slugify(s.heading)} className="scroll-mt-8">
                {s.heading}
              </h2>
              {s.body}
            </div>
          ))}
        </article>
      </section>
    </>
  )
}
