import type { Work } from '@/payload-types'
import { workHref } from '@/lib/utils'
import { Figure } from './Figure'
import { SmartLink, StatRow } from './ui'

/** Vertical card: image, category, title, summary, stats. */
export function WorkCard({ item, showStats = false, showCategory = false }: { item: Work; showStats?: boolean; showCategory?: boolean }) {
  return (
    <SmartLink href={workHref(item)} className="row-hover flex flex-col gap-4">
      <Figure data={item.image} frameClassName="aspect-[4/3]" showCaption={false} sizes="(min-width: 1024px) 560px, 100vw" />
      {showCategory && item.category ? <p className="text-[14px] text-faint">{item.category}</p> : null}
      <h3 className="h-card">{item.title}</h3>
      <p className="text-[16px] text-muted">{item.summary}</p>
      {showStats ? <StatRow stats={item.stats} /> : null}
    </SmartLink>
  )
}

/** Horizontal row: image left, text right. Used on the Work index for client projects. */
export function WorkRow({ item, last }: { item: Work; last?: boolean }) {
  const hasCaseStudy = Boolean(item.caseStudy?.enabled)
  return (
    <SmartLink
      href={workHref(item)}
      className={`row-hover grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] gap-x-16 gap-y-6 py-10 border-t border-rule items-start ${last ? 'border-b' : ''}`}
    >
      <Figure data={item.image} frameClassName="aspect-[16/10]" showCaption={false} sizes="(min-width: 1024px) 560px, 100vw" />
      <div className="flex flex-col gap-3.5">
        {item.category ? <p className="text-[14px] text-faint">{item.category}</p> : null}
        <h3 className="font-serif leading-[1.1] tracking-[-0.01em]" style={{ fontSize: 'clamp(26px, 2.8vw, 34px)' }}>
          {item.title}
        </h3>
        <p className="text-[16px] text-body">{item.summary}</p>
        <StatRow stats={item.stats} />
        {hasCaseStudy ? (
          <span className="link-u text-[16px] self-start">Read the case study</span>
        ) : (
          <span className="text-[15px] text-faint">Case study coming soon</span>
        )}
      </div>
    </SmartLink>
  )
}

/** Compact text-only card used in "Related work" and "More work". */
export function WorkMini({ item }: { item: Work }) {
  return (
    <SmartLink href={workHref(item)} className="row-hover flex flex-col gap-3 pt-5 border-t border-rule">
      {item.category ? <p className="text-[14px] text-faint">{item.category}</p> : null}
      <h3 className="text-[28px] leading-[1.15] tracking-[-0.01em]">{item.title}</h3>
      <p className="text-[16px] text-muted">{item.summary}</p>
    </SmartLink>
  )
}

export function RelatedWork({ heading = 'Related work', items }: { heading?: string; items: Work[] }) {
  if (!items.length) return null
  return (
    <section className="flex flex-col gap-8 py-16 lg:py-20 border-t border-ink">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <h2 className="font-serif text-[40px] leading-[1.1] tracking-[-0.015em]">{heading}</h2>
        <SmartLink href="/work" className="link-u text-[16px]">
          All case studies
        </SmartLink>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-10">
        {items.map((w) => (
          <WorkMini key={w.id} item={w} />
        ))}
      </div>
    </section>
  )
}
