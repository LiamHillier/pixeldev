import type { CSSProperties, ReactNode } from 'react'
import { ArrowDot, GoLink, NumberedCard, RuledList, SmartLink, TwoTone, ULink } from '@/components/ui'
import { cx, workHref } from '@/lib/utils'
import type { Work } from '@/payload-types'

type Item = { title: string; body?: string | null; meta?: string | null }

/** The 110px section rhythm the design uses straight after the hero (band, "What we build"). */
const gapSm = 'pt-20 lg:pt-[110px]'

/**
 * Short statements under 2px ink rules that draw in and turn teal on hover. Used for "Sound
 * familiar?" (22px statements) and "Ways to work together" (26px card titles).
 */
export function StatementGrid({
  items,
  min = 270,
  variant = 'statement',
}: {
  items?: Item[] | null
  min?: number
  variant?: 'statement' | 'card'
}) {
  if (!items?.length) return null
  return (
    <div
      className="stagger grid gap-x-8 gap-y-10"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))` }}
    >
      {items.map((p, i) => (
        <div key={i} className="rule2 wipe flex flex-col gap-3 pt-[22px]">
          {variant === 'card' ? (
            <h3 className="text-[24px] lg:text-[26px] leading-[1.12] tracking-[-0.03em]">
              {p.title}
            </h3>
          ) : (
            <p className="text-[21px] lg:text-[22px] leading-[1.25] tracking-[-0.025em]">
              {p.title}
            </p>
          )}
          {p.meta ? <p className="text-[16px] font-medium">{p.meta}</p> : null}
          {p.body ? <p className="text-[16px] text-muted">{p.body}</p> : null}
        </div>
      ))}
    </div>
  )
}

/** A section on the full-bleed grey band, starting 46px down (behind the heading's lower half). */
export function BandSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cx('band flex flex-col gap-12 lg:gap-14', gapSm, className)}
      style={{ '--bt': '46px' } as CSSProperties}
    >
      {children}
    </section>
  )
}

/** "Sound familiar?": the grey band of pain points. */
export function SoundFamiliar({ heading, items }: { heading?: string | null; items?: Item[] | null }) {
  if (!items?.length) return null
  return (
    <BandSection>
      <h2 className="rv h-section">
        <TwoTone text={heading || 'Sound familiar?'} />
      </h2>
      <StatementGrid items={items} />
    </BandSection>
  )
}

/** "What we build": heading and intro on the left, a numbered ruled list on the right. */
export function OfferingsSplit({
  heading,
  intro,
  items,
}: {
  heading?: string | null
  intro?: string | null
  items?: { title: string; body: string }[] | null
}) {
  if (!items?.length) return null
  return (
    <section className={cx('flex flex-wrap items-start gap-x-24 gap-y-10', gapSm)}>
      <div className="rv flex-[1_1_380px] min-w-0 flex flex-col gap-5">
        <h2 className="h-section">
          <TwoTone text={heading || 'What we *build*'} />
        </h2>
        {intro ? <p className="max-w-[440px] text-[18px] text-muted">{intro}</p> : null}
      </div>
      <div className="flex-[1.4_1_480px] min-w-0">
        <RuledList items={items} />
      </div>
    </section>
  )
}

/** "How we approach it": steps under large outlined teal numerals that fill as they scroll in. */
export function ApproachSteps({
  heading,
  items,
}: {
  heading?: string | null
  items?: { title: string; body: string }[] | null
}) {
  if (!items?.length) return null
  return (
    <section className="section-gap flex flex-col gap-12 lg:gap-16">
      <h2 className="rv h-section">
        <TwoTone text={heading || 'How we *approach it*'} />
      </h2>
      <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-10 gap-y-12">
        {items.map((a, i) => (
          <NumberedCard key={i} n={i + 1} title={a.title} body={a.body} />
        ))}
      </div>
    </section>
  )
}

/** Heading on the left, an optional note or link on the right, bottom-aligned. */
function SectionHead({
  heading,
  aside,
  wide,
}: {
  heading: ReactNode
  aside?: ReactNode
  /** The design's plans head lets both halves grow (flex 1 1 420px / 1 1 340px). */
  wide?: boolean
}) {
  return (
    <div
      className={cx(
        'rv flex flex-wrap items-end justify-between',
        wide ? 'gap-x-16 gap-y-5' : 'gap-x-8 gap-y-3',
      )}
    >
      <h2 className={cx('h-section', wide && 'flex-[1_1_420px]')}>{heading}</h2>
      {aside}
    </div>
  )
}

/** "Related work": text cards under a 2px ink rule; the title turns teal and a chevron slides in. */
export function RelatedCases({ heading, items }: { heading?: string | null; items: Work[] }) {
  if (!items.length) return null
  return (
    <section className="section-gap flex flex-col gap-12 lg:gap-14">
      <SectionHead
        heading={<TwoTone text={heading || 'Related *work*'} />}
        aside={<GoLink href="/work">All case studies</GoLink>}
      />
      <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-x-8 gap-y-10">
        {items.map((w) => (
          <SmartLink
            key={w.id}
            href={workHref(w)}
            className="case case-arrow rule2 wipe flex flex-col gap-3 pt-[22px] pr-8"
          >
            {w.category ? <p className="text-[15px] text-muted">{w.category}</p> : null}
            <h3 className="text-[24px] lg:text-[26px] leading-[1.12] tracking-[-0.03em]">
              {w.title}
            </h3>
            {w.summary ? <p className="text-[16px] text-muted">{w.summary}</p> : null}
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

type Plan = {
  name: string
  price?: string | null
  body?: string | null
  href?: string | null
  id?: string | null
}

/** Grey plan cards (the CloudPerch plans). Prices and descriptions only show when they are set. */
export function PlanCards({
  heading,
  intro,
  items,
}: {
  heading?: string | null
  intro?: string | null
  items?: Plan[] | null
}) {
  if (!items?.length) return null
  return (
    <section className="section-gap flex flex-col gap-12 lg:gap-14">
      <SectionHead
        wide
        heading={<TwoTone text={heading} />}
        aside={
          intro ? (
            <p className="flex-[1_1_340px] max-w-[480px] text-[18px] text-muted">{intro}</p>
          ) : null
        }
      />
      <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-4">
        {items.map((p, i) => {
          const detailed = Boolean(p.price || p.body)
          const inner = (
            <>
              <h3 className="text-[24px] lg:text-[26px] leading-[1.12] tracking-[-0.03em]">
                {p.name}
              </h3>
              {p.price ? <p className="text-[16px] font-medium">{p.price}</p> : null}
              {p.body ? <p className="mt-auto text-[16px] text-muted">{p.body}</p> : null}
              {p.href && !detailed ? <ArrowDot className="mt-auto" /> : null}
            </>
          )
          const cls = cx(
            'flex flex-col gap-2.5 p-7 rounded-xl bg-fill',
            detailed ? 'min-h-[220px]' : 'min-h-[180px]',
          )
          return p.href ? (
            <SmartLink key={p.id ?? i} href={p.href} className={cx('case go', cls)}>
              {inner}
            </SmartLink>
          ) : (
            <div key={p.id ?? i} className={cls}>
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/** Primary button and secondary underlined link, as used in the hero. */
export function HeroActions({
  primary,
  secondary,
  children,
}: {
  primary?: { label?: string | null; href?: string | null } | null
  secondary?: { label?: string | null; href?: string | null } | null
  children?: ReactNode
}) {
  if (!primary?.label && !secondary?.label) return null
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
      {primary?.label ? (
        <SmartLink href={primary.href || '/contact'} className="btn-ink">
          {primary.label}
        </SmartLink>
      ) : null}
      {secondary?.label ? (
        <ULink href={secondary.href || '/work'}>{secondary.label}</ULink>
      ) : null}
      {children}
    </div>
  )
}

/** One row of the services index: title, intro and link on the left, a short ruled list on the right. */
export function ServiceIndexRow({
  title,
  intro,
  href,
  linkLabel,
  items,
  last,
}: {
  title: string
  intro?: string | null
  href: string
  linkLabel: string
  items?: { text: string; id?: string | null }[] | null
  last?: boolean
}) {
  return (
    <div
      className={cx(
        'wipe flex flex-wrap items-start gap-x-20 gap-y-8 py-12 lg:py-14 border-t border-ink',
        last && 'border-b border-b-ink',
      )}
    >
      <div className="flex-[1_1_400px] min-w-0 flex flex-col gap-[18px]">
        <h2
          className="leading-[1.05] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(30px, 3.2vw, 44px)' }}
        >
          {title}
        </h2>
        {intro ? <p className="max-w-[520px] text-[17px] text-muted">{intro}</p> : null}
        <ULink href={href} className="self-start">
          {linkLabel}
        </ULink>
      </div>
      {items?.length ? (
        <ul className="ruled rv-li flex-[1_1_400px] min-w-0 flex flex-col text-[16px]">
          {items.map((it, j) => (
            <li key={it.id ?? j} className="py-[13px] pr-12 border-t border-rule">
              {it.text}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
