import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { Button, Crumb, Marquee, Stat, TwoTone, plainHeading } from '@/components/ui'
import { RelatedWork } from '@/components/WorkCard'
import { ShotFrame } from '@/components/work/ShotFrame'
import { getWork, getWorkItem, getWorkPage } from '@/lib/data'
import { absoluteUrl, breadcrumbJsonLd, ids, pageMetadata } from '@/lib/seo'
import { cx, docs, media } from '@/lib/utils'
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
    heading: plainHeading(item.caseStudy.heading || item.title),
    eyebrow: item.category ? `Case study · ${item.category}` : 'Case study',
    description: item.caseStudy.intro ?? item.summary,
    type: 'article',
    modifiedTime: item.updatedAt,
  })
}

const sectionFigureTints = ['blue', 'lilac', 'teal'] as const

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params
  const [item, page] = await Promise.all([getWorkItem(slug), getWorkPage()])
  if (!item || !item.caseStudy?.enabled) notFound()
  const cs = item.caseStudy
  const more = docs<Work>(cs.moreWork)
  const path = `/work/${item.slug}`
  const heroImg = media(cs.hero?.image)
  const marquee = (page.marquee?.items ?? []).map((m) => m.name).filter(Boolean)
  let figureCount = 0

  return (
    <div className="reads">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Work', path: '/work' },
            { name: item.title, path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: plainHeading(cs.heading || item.title),
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

      <section className="hero-in flex flex-col gap-10 lg:gap-12 pt-10 lg:pt-14">
        <Crumb parent="Work" parentHref="/work" current={item.title} />
        <h1 className="h-detail max-w-[1240px]">
          <TwoTone text={cs.heading || item.title} auto pill="sync" />
        </h1>
        {cs.intro ? <p className="lead max-w-[760px]">{cs.intro}</p> : null}
        {cs.meta?.length ? (
          <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(190px,100%),1fr))] gap-x-8 gap-y-5 py-6 border-t border-ink border-b border-b-rule text-[16px]">
            {cs.meta.map((m) => (
              <div key={m.id ?? m.label} className="flex flex-col gap-1">
                <dt className="text-[15px] text-muted">{m.label}</dt>
                <dd className="m-0 font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      {heroImg ? (
        <figure className="hero-fig m-0 flex flex-col gap-[18px] pt-12">
          <ShotFrame
            img={heroImg}
            tint="teal"
            pad="clamp(24px, 4.4vw, 64px)"
            radius="rounded-t-xl"
            shadow
            innerClassName="max-w-[1080px] aspect-[16/8.4]"
            sizes="(min-width: 1408px) 1080px, 100vw"
            priority
          />
          {cs.hero?.caption ? (
            <figcaption className="max-w-[720px] text-[15px] text-muted">{cs.hero.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}

      {cs.bigStats?.length ? (
        <section className="pt-20 lg:pt-24">
          <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-8 gap-y-10 py-14 border-y border-rule">
            {cs.bigStats.map((s, i) => (
              <Stat
                key={s.id ?? s.label}
                value={s.value}
                label={s.label}
                size="lg"
                accent={i === cs.bigStats!.length - 1 && cs.bigStats!.length > 1}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex flex-wrap items-start gap-x-24 gap-y-16 pt-20 lg:pt-28">
        <div className="rv flex-[999_1_560px] min-w-0 max-w-[780px] flex flex-col gap-16 lg:gap-[72px]">
          {cs.sections?.map((sec) => {
            const figImg = media(sec.figure?.image)
            const tint = figImg ? sectionFigureTints[figureCount++ % sectionFigureTints.length] : 'blue'
            return (
              <div key={sec.id ?? sec.heading} className="flex flex-col gap-5">
                <h2
                  className="font-display font-medium leading-[1.05] tracking-[-0.04em]"
                  style={{ fontSize: 'clamp(30px, 3.2vw, 44px)' }}
                >
                  {sec.heading}
                </h2>
                <RichText data={sec.body} variant="case" />
                {sec.steps?.length ? (
                  <ol className="ruled rv-li flex flex-col pt-2 text-[17px]">
                    {sec.steps.map((st, i) => (
                      <li
                        key={st.id ?? i}
                        className={cx(
                          'flex gap-5 py-[18px] pr-12 border-t border-rule',
                          i === sec.steps!.length - 1 && 'border-b',
                        )}
                      >
                        <span className="flex-[0_0_28px] font-display text-[24px] leading-[1.1] font-medium text-grey">
                          {i + 1}
                        </span>
                        <span>{st.text}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
                {figImg ? (
                  <figure className="m-0 flex flex-col gap-4 pt-2">
                    <ShotFrame
                      img={figImg}
                      tint={tint}
                      pad="clamp(20px, 2.8vw, 40px)"
                      innerClassName="aspect-video"
                      sizes="(min-width: 1024px) 700px, 100vw"
                    />
                    {sec.figure?.caption ? (
                      <figcaption className="text-[15px] text-muted">{sec.figure.caption}</figcaption>
                    ) : null}
                  </figure>
                ) : null}
              </div>
            )
          })}

          {cs.quote?.text ? (
            <figure className="m-0 flex flex-col gap-8 pt-10 border-t-2 border-accent">
              <blockquote
                className="m-0 font-display font-medium leading-[1.2] tracking-[-0.035em]"
                style={{ fontSize: 'clamp(24px, 2.5vw, 34px)' }}
              >
                <span className="inkin">“{cs.quote.text}”</span>
              </blockquote>
              {cs.quote.attribution ? (
                <figcaption className="text-[16px] text-muted">{cs.quote.attribution}</figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>

        <aside className="rv flex-[1_1_280px] min-w-0 flex flex-col gap-8">
          {cs.atAGlance?.length ? (
            <dl className="m-0 flex flex-col gap-[18px] p-7 rounded-xl bg-fill text-[16px]">
              <p className="text-[15px] text-muted">{page.caseStudy?.atAGlanceLabel || 'At a glance'}</p>
              {cs.atAGlance.map((g) => (
                <div key={g.id ?? g.label} className="flex flex-col gap-1">
                  <dt className="text-[15px] text-muted">{g.label}</dt>
                  <dd className="m-0 font-medium">{g.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {cs.asideCta?.heading ? (
            <div className="flex flex-col gap-3.5 p-7 rounded-xl border border-rule">
              <h3 className="text-[24px] lg:text-[26px] leading-[1.12] tracking-[-0.03em]">
                {cs.asideCta.heading}
              </h3>
              {cs.asideCta.body ? (
                <p className="text-[16px] text-muted">{cs.asideCta.body}</p>
              ) : null}
              <Button href="/contact" className="self-start mt-2">
                {cs.asideCta.ctaLabel ?? 'Start a project'}
              </Button>
            </div>
          ) : null}
        </aside>
      </section>

      <RelatedWork
        heading={page.caseStudy?.moreHeading || 'More *work*'}
        linkLabel={page.caseStudy?.moreLinkLabel}
        items={more}
        className="pb-[60px]"
      />
      {!more.length ? <div className="pb-24 lg:pb-[136px]" /> : null}

      <Marquee items={marquee} label={page.marquee?.label ?? 'Businesses we’ve built for'} />
    </div>
  )
}
