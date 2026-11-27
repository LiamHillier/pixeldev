import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Figure } from '@/components/Figure'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { Button, Crumb, Stat, TwoTone } from '@/components/ui'
import { RelatedWork } from '@/components/WorkCard'
import { getWork, getWorkItem } from '@/lib/data'
import { absoluteUrl, breadcrumbJsonLd, ids, pageMetadata } from '@/lib/seo'
import { cx, docs } from '@/lib/utils'
import type { Work } from '@/payload-types'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const all = await getWork()
  return all.filter((w) => w.caseStudy?.enabled).map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const item = await getWorkItem(slug)
  if (!item?.caseStudy?.enabled) return {}
  return pageMetadata({
    path: `/work/${item.slug}`,
    seo: item.seo,
    title: `${item.title}: case study`,
    heading: item.caseStudy.heading || item.title,
    eyebrow: item.category ? `Case study · ${item.category}` : 'Case study',
    description: item.caseStudy.intro ?? item.summary,
    type: 'article',
    modifiedTime: item.updatedAt,
  })
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params
  const item = await getWorkItem(slug)
  if (!item || !item.caseStudy?.enabled) notFound()
  const cs = item.caseStudy
  const more = docs<Work>(cs.moreWork)
  const path = `/work/${item.slug}`

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Work', path: '/work' },
            { name: item.title, path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: cs.heading || item.title,
            description: cs.intro ?? item.summary,
            url: absoluteUrl(path),
            mainEntityOfPage: absoluteUrl(path),
            dateModified: item.updatedAt,
            datePublished: item.createdAt,
            inLanguage: 'en-AU',
            author: { '@id': ids.person },
            publisher: { '@id': ids.business },
            about: item.category ?? undefined,
          },
        ]}
      />
      <section className="flex flex-col gap-10 lg:gap-12 pt-14">
        <Crumb parent="Work" parentHref="/work" current={item.title} />
        <h1 className="h-detail max-w-[1240px]">
          <TwoTone text={cs.heading ?? item.title} />
        </h1>
        {cs.intro ? <p className="lead max-w-[760px]">{cs.intro}</p> : null}
        {cs.meta?.length ? (
          <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-8 gap-y-6 pt-6 border-t border-rule text-[16px]">
            {cs.meta.map((m) => (
              <div key={m.id ?? m.label} className="flex flex-col gap-1">
                <dt className="text-muted">{m.label}</dt>
                <dd className="m-0 font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      {cs.hero?.image || cs.hero?.placeholder ? (
        <Figure
          data={cs.hero}
          tint="blue"
          frameClassName="aspect-[16/8] min-h-[220px]"
          className="pt-12 lg:pt-14"
          priority
        />
      ) : null}

      {cs.bigStats?.length ? (
        <section className="pt-20 lg:pt-28">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-x-8 gap-y-10 py-12 lg:py-14 border-t border-b border-rule">
            {cs.bigStats.map((s, i) => (
              <div
                key={s.id ?? s.label}
                className={cx(i === cs.bigStats!.length - 1 && '[&>div>span:first-child]:text-accent')}
              >
                <Stat value={s.value} label={s.label} size="lg" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex flex-wrap items-start gap-x-24 gap-y-14 pt-20 lg:pt-28">
        <div className="flex-[999_1_560px] min-w-0 max-w-[760px] flex flex-col gap-16 lg:gap-20">
          {cs.sections?.map((sec) => (
            <div key={sec.id ?? sec.heading} className="flex flex-col gap-6">
              <h2
                className="font-display font-medium leading-[1.06] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}
              >
                {sec.heading}
              </h2>
              <RichText data={sec.body} />
              {sec.steps?.length ? (
                <ol className="flex flex-col text-[18px] text-body m-0 p-0 list-none">
                  {sec.steps.map((st, i) => (
                    <li
                      key={st.id ?? i}
                      className={cx(
                        'grid grid-cols-[44px_1fr] gap-4 py-4 border-t',
                        i === 0 ? 'border-ink' : 'border-rule',
                        i === sec.steps!.length - 1 && 'border-b border-b-rule',
                      )}
                    >
                      <span className="font-display font-medium text-[24px] leading-[1.25] text-grey">
                        {i + 1}
                      </span>
                      <span>{st.text}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
              {sec.figure?.image || sec.figure?.placeholder ? (
                <Figure
                  data={sec.figure}
                  frameClassName="min-h-[240px] lg:min-h-[380px]"
                  className="pt-2"
                  sizes="(min-width: 1024px) 760px, 100vw"
                />
              ) : null}
            </div>
          ))}

          {cs.quote?.text ? (
            <figure className="m-0 flex flex-col gap-6 pl-6 border-l-2 border-accent">
              <blockquote
                className="m-0 font-display font-medium leading-[1.2] tracking-[-0.035em]"
                style={{ fontSize: 'clamp(24px, 2.6vw, 34px)' }}
              >
                “{cs.quote.text}”
              </blockquote>
              {cs.quote.attribution ? (
                <figcaption className="text-[16px] text-muted">{cs.quote.attribution}</figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>

        <aside className="flex-[1_1_300px] min-w-0 flex flex-col gap-4 lg:sticky lg:top-8">
          {cs.atAGlance?.length ? (
            <dl className="m-0 flex flex-col gap-4 text-[16px] p-7 rounded-xl bg-fill">
              <p className="text-[15px] text-muted">At a glance</p>
              {cs.atAGlance.map((g) => (
                <div key={g.id ?? g.label} className="flex flex-col gap-1 pt-4 border-t border-line">
                  <dt className="text-[15px] text-muted">{g.label}</dt>
                  <dd className="m-0">{g.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {cs.asideCta?.heading ? (
            <div className="flex flex-col gap-3.5 p-7 rounded-xl bg-tint-teal">
              <h3 className="text-[26px] leading-[1.12]">{cs.asideCta.heading}</h3>
              {cs.asideCta.body ? (
                <p className="text-[16px] text-body">{cs.asideCta.body}</p>
              ) : null}
              <Button href="/contact" className="self-start mt-2">
                {cs.asideCta.ctaLabel ?? 'Start a project'}
              </Button>
            </div>
          ) : null}
        </aside>
      </section>

      <RelatedWork heading="More work" items={more} />
      <div className="pb-24 lg:pb-[136px]" />
    </>
  )
}
