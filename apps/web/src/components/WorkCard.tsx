import type { Tint } from './Figure'
import type { Work } from '@/payload-types'
import { cx, media, workHref } from '@/lib/utils'
import { ImageBox } from './Figure'
import { GoLink, SmartLink, TwoTone } from './ui'
import { ShotFrame, tintBg } from './work/ShotFrame'

type Stats = Work['stats']

/** The small stat pair under a card: 30px numbers over 14px labels, above a light rule. */
export function CardStats({ stats, className }: { stats?: Stats; className?: string }) {
  if (!stats?.length) return null
  return (
    <div className={cx('flex flex-wrap gap-x-10 gap-y-4 pt-4 border-t border-rule', className)}>
      {stats.map((s, i) => (
        <div key={s.id ?? i} className="flex flex-col gap-0.5">
          <span className="font-display text-[30px] leading-[1.1] font-medium tracking-[-0.04em]">
            {s.value}
          </span>
          <span className="text-[14px] text-muted">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

const cardTitle = 'text-[24px] lg:text-[26px] leading-[1.12] tracking-[-0.03em]'

/** Vertical card: tinted 4:3 image that lifts on hover, category, title, summary, stats. */
export function WorkCard({
  item,
  showStats = false,
  showCategory = false,
  tint = 'teal',
}: {
  item: Work
  showStats?: boolean
  showCategory?: boolean
  tint?: Tint
}) {
  const img = media(item.image?.image)
  return (
    <SmartLink href={workHref(item)} className="case flex flex-col gap-3.5">
      <div
        className={cx(
          'case-lift relative mb-2.5 aspect-[4/3] overflow-hidden rounded-xl',
          tintBg[tint],
          !img && 'ph',
        )}
      >
        {img ? (
          <ImageBox
            img={img}
            frameClassName="h-full w-full rounded-xl"
            sizes="(min-width: 1024px) 460px, 100vw"
          />
        ) : null}
      </div>
      {showCategory && item.category ? (
        <p className="text-[15px] text-muted">{item.category}</p>
      ) : null}
      <h3 className={cardTitle}>{item.title}</h3>
      <p className="text-[16px] text-muted">{item.summary}</p>
      {showStats ? <CardStats stats={item.stats} className="mt-auto" /> : null}
    </SmartLink>
  )
}

/** Horizontal row: tinted screenshot left (the white frame lifts), text right. Client projects. */
export function WorkRow({
  item,
  tint = 'teal',
  readLabel = 'Read the case study',
  soonLabel = 'Case study coming soon',
}: {
  item: Work
  tint?: Tint
  readLabel?: string | null
  soonLabel?: string | null
}) {
  const hasCaseStudy = Boolean(item.caseStudy?.enabled)
  // The case study hero is 16:9, the shape of this frame; the 4:3 card image is the fallback.
  const img = media(item.caseStudy?.hero?.image) ?? media(item.image?.image)
  return (
    <SmartLink
      href={workHref(item)}
      className="case rv flex flex-wrap items-center gap-x-16 gap-y-7"
    >
      <ShotFrame
        img={img}
        tint={tint}
        className="flex-[3_1_480px] min-w-0"
        innerClassName="case-frame aspect-video"
        sizes="(min-width: 1024px) 760px, 100vw"
      />
      <div className="flex-[2_1_380px] min-w-0 flex flex-col gap-3.5">
        {item.category ? <p className="text-[15px] text-muted">{item.category}</p> : null}
        <h3 className={cardTitle}>{item.title}</h3>
        <p className="text-[16px] text-muted">{item.summary}</p>
        <CardStats stats={item.stats} className="mt-1.5" />
        {hasCaseStudy ? (
          <span className="u self-start pt-1.5 text-[16px] text-accent">{readLabel}</span>
        ) : soonLabel ? (
          <span className="pt-1.5 text-[15px] text-muted">{soonLabel}</span>
        ) : null}
      </div>
    </SmartLink>
  )
}

/** Anonymised project: no link, a 2px ink rule that draws in and turns teal on hover. */
export function WorkAnon({ item }: { item: Work }) {
  return (
    <div className="rule2 wipe flex flex-col gap-3.5 pt-[22px]">
      {item.category ? <p className="text-[15px] text-muted">{item.category}</p> : null}
      <h3 className={cardTitle}>{item.title}</h3>
      <p className="text-[16px] text-muted">{item.summary}</p>
      <CardStats stats={item.stats} className="mt-auto" />
    </div>
  )
}

/** Compact text-only card used in "Related work" and "More work". The chevron slides in on hover. */
export function WorkMini({ item }: { item: Work }) {
  return (
    <SmartLink
      href={workHref(item)}
      className="case case-arrow rule2 wipe flex flex-col gap-3 pt-[22px] pr-8"
    >
      {item.category ? <p className="text-[15px] text-muted">{item.category}</p> : null}
      <h3 className={cardTitle}>{item.title}</h3>
      <p className="text-[16px] text-muted">{item.summary}</p>
    </SmartLink>
  )
}

export function RelatedWork({
  heading = 'Related work',
  linkLabel = 'All case studies',
  items,
  className,
}: {
  heading?: string | null
  linkLabel?: string | null
  items: Work[]
  className?: string
}) {
  if (!items.length) return null
  return (
    <section className={cx('section-gap flex flex-col gap-12 lg:gap-14', className)}>
      <div className="rv flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h2 className="h-section">
          <TwoTone text={heading || 'Related work'} />
        </h2>
        <GoLink href="/work">{linkLabel || 'All case studies'}</GoLink>
      </div>
      <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-x-8 gap-y-10">
        {items.map((w) => (
          <WorkMini key={w.id} item={w} />
        ))}
      </div>
    </section>
  )
}
