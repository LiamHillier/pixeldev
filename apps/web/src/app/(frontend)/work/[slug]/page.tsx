import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Figure } from '@/components/Figure'
import { RichText } from '@/components/RichText'
import { Button, Crumb, Stat } from '@/components/ui'
import { RelatedWork } from '@/components/WorkCard'
import { getWork, getWorkItem } from '@/lib/data'
import { docs } from '@/lib/utils'
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
  return { title: item.title, description: item.caseStudy.intro ?? item.summary }
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params
  const item = await getWorkItem(slug)
  if (!item || !item.caseStudy?.enabled) notFound()
  const cs = item.caseStudy
  const more = docs<Work>(cs.moreWork)

  return (
    <>
      <section className="flex flex-col gap-8 pt-12 pb-10 lg:pt-16 lg:pb-12">
        <Crumb parent="Work" parentHref="/work" current={item.title} />
        <div className="flex flex-col gap-6 max-w-[920px]">
          <h1 className="h-detail" style={{ fontSize: 'clamp(36px, 4.7vw, 64px)' }}>
            {cs.heading ?? item.title}
          </h1>
          {cs.intro ? <p className="text-[21px] leading-[1.5] text-body max-w-[760px]">{cs.intro}</p> : null}
        </div>
        {cs.meta?.length ? (
          <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] gap-x-8 gap-y-4 py-6 border-t border-b border-ink text-[15px]">
            {cs.meta.map((m) => (
              <div key={m.id ?? m.label} className="flex flex-col gap-1">
                <dt className="text-faint">{m.label}</dt>
                <dd className="m-0">{m.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      {cs.hero?.image || cs.hero?.placeholder ? (
        <Figure data={cs.hero} frameClassName="min-h-[300px] lg:min-h-[560px]" className="pt-4 pb-14" priority />
      ) : null}

      {cs.bigStats?.length ? (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-x-10 gap-y-8 pb-20">
          {cs.bigStats.map((s) => (
            <div key={s.id ?? s.label} className="flex flex-col gap-2 pt-5 border-t border-ink">
              <Stat value={s.value} label={s.label} size="lg" />
            </div>
          ))}
        </section>
      ) : null}

      <section className="flex flex-wrap gap-x-20 gap-y-12 pb-24">
        <div className="flex-[999_1_540px] min-w-0 flex flex-col gap-14 max-w-[720px]">
          {cs.sections?.map((sec) => (
            <div key={sec.id ?? sec.heading} className="flex flex-col gap-4">
              <h2 className="font-serif leading-[1.1] tracking-[-0.01em]" style={{ fontSize: 'clamp(28px, 3vw, 38px)' }}>
                {sec.heading}
              </h2>
              <RichText data={sec.body} className="text-[18px] leading-[1.65] text-body" />
              {sec.steps?.length ? (
                <ol className="flex flex-col text-[17px] text-body pt-2 m-0 p-0 list-none">
                  {sec.steps.map((st, i) => (
                    <li
                      key={st.id ?? i}
                      className={`grid grid-cols-[48px_1fr] gap-4 py-4 border-t border-rule ${i === sec.steps!.length - 1 ? 'border-b' : ''}`}
                    >
                      <span className="font-serif text-[26px] leading-none text-faint">{i + 1}</span>
                      <span>{st.text}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
              {sec.figure?.image || sec.figure?.placeholder ? (
                <Figure data={sec.figure} frameClassName="min-h-[260px] lg:min-h-[400px]" className="pt-4" />
              ) : null}
            </div>
          ))}

          {cs.quote?.text ? (
            <div className="flex flex-col gap-5 py-8 border-t border-b border-ink">
              <p className="font-serif italic leading-[1.3]" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)' }}>
                “{cs.quote.text}”
              </p>
              {cs.quote.attribution ? <p className="text-[15px] text-faint">{cs.quote.attribution}</p> : null}
            </div>
          ) : null}
        </div>

        <aside className="flex-[1_1_260px] flex flex-col gap-10">
          {cs.atAGlance?.length ? (
            <dl className="m-0 flex flex-col gap-4 text-[15px] pt-5 border-t border-ink">
              <p className="text-[13px] text-faint">At a glance</p>
              {cs.atAGlance.map((g) => (
                <div key={g.id ?? g.label} className="flex flex-col gap-1">
                  <dt className="text-faint">{g.label}</dt>
                  <dd className="m-0">{g.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {cs.asideCta?.heading ? (
            <div className="flex flex-col gap-3 pt-5 border-t border-ink">
              <h3 className="text-[26px] leading-[1.15]">{cs.asideCta.heading}</h3>
              {cs.asideCta.body ? <p className="text-[15px] text-muted">{cs.asideCta.body}</p> : null}
              <Button href="/contact" className="self-start min-h-[48px] px-6 text-[15px]">
                {cs.asideCta.ctaLabel ?? 'Start a project'}
              </Button>
            </div>
          ) : null}
        </aside>
      </section>

      <RelatedWork heading="More work" items={more} />
    </>
  )
}
