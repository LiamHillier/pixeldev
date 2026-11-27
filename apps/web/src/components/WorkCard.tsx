import type { Work } from '@/payload-types'
import { workHref } from '@/lib/utils'
import { Figure } from './Figure'
import { GoLink, SmartLink, StatRow, TwoTone } from './ui'

/** Vertical card: image, category, title, summary, stats. */
export function WorkCard({
  item,
  showStats = false,
  showCategory = false,
}: {
  item: Work
  showStats?: boolean
  showCategory?: boolean
}) {
  return (
    <SmartLink href={workHref(item)} className="row-hover flex flex-col gap-4">
      <Figure
        data={item.image}
        frameClassName="aspect-[4/3]"
        showCaption={false}
        sizes="(min-width: 1024px) 660px, 100vw"
      />
      <div className="flex flex-col gap-2.5 pt-2">
        {showCategory && item.category ? (
          <p className="text-[15px] text-muted">{item.category}</p>
        ) : null}
        <h3 className="h-card">{item.title}</h3>
        <p className="text-[16px] text-muted">{item.summary}</p>
      </div>
      {showStats ? <StatRow stats={item.stats} /> : null}
    </SmartLink>
  )
}

/** Horizontal row: image left, text right. Used on the Work index for client projects. */
export function WorkRow({ item, first, last }: { item: Work; first?: boolean; last?: boolean }) {
  const hasCaseStudy = Boolean(item.caseStudy?.enabled)
  return (
    <SmartLink
      href={workHref(item)}
      className={`row-hover flex flex-wrap items-start gap-x-16 gap-y-6 py-10 border-t ${first ? 'border-ink' : 'border-rule'} ${last ? 'border-b border-b-rule' : ''}`}
    >
      <Figure
        data={item.image}
        frameClassName="aspect-[16/10]"
        showCaption={false}
        sizes="(min-width: 1024px) 660px, 100vw"
        className="flex-[1.2_1_380px] min-w-0"
      />
      <div className="flex-[1_1_340px] min-w-0 flex flex-col gap-3.5">
        {item.category ? <p className="text-[15px] text-muted">{item.category}</p> : null}
        <h3 className="h-row">{item.title}</h3>
        <p className="text-[17px] text-body">{item.summary}</p>
        <StatRow stats={item.stats} />
        {hasCaseStudy ? (
          <span className="link-u text-[17px] self-start pt-1">Read the case study</span>
        ) : (
          <span className="text-[15px] text-muted pt-1">Case study coming soon</span>
        )}
      </div>
    </SmartLink>
  )
}

/** Compact text-only card used in "Related work" and "More work". */
export function WorkMini({ item }: { item: Work }) {
  return (
    <SmartLink
      href={workHref(item)}
      className="row-hover flex flex-col gap-3 pt-[22px] border-t-2 border-ink"
    >
      {item.category ? <p className="text-[15px] text-muted">{item.category}</p> : null}
      <h3 className="text-[24px] lg:text-[26px] leading-[1.12]">{item.title}</h3>
      <p className="text-[16px] text-muted">{item.summary}</p>
    </SmartLink>
  )
}

export function RelatedWork({ heading = 'Related work', items }: { heading?: string; items: Work[] }) {
  if (!items.length) return null
  return (
    <section className="section-gap flex flex-col gap-12 lg:gap-14">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h2 className="h-section">
          <TwoTone text={heading} />
        </h2>
        <GoLink href="/work">All case studies</GoLink>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-x-8 gap-y-10">
        {items.map((w) => (
          <WorkMini key={w.id} item={w} />
        ))}
      </div>
    </section>
  )
}
