import { Fragment, type CSSProperties } from 'react'
import type { Work } from '@/payload-types'
import { SmartLink } from '@/components/ui'
import { cx, media, workHref } from '@/lib/utils'
import { Shot } from './Shot'

const tints = ['bg-tint-teal', 'bg-tint-blue', 'bg-tint-lilac'] as const

export type CaseStackItem = {
  id?: string | null
  work: Work
  title?: string | null
  struggle?: string | null
  built?: string | null
  changed?: string | null
}

/** A view timeline name per card, so the card before can watch the next one arrive. */
const timelineName = (i: number) => `--case-${i}`

/**
 * The case study deck. From the `lg` breakpoint each card pins under the header and the next one
 * slides up over it; the covered card shrinks and fades (see `.stack` in globals.css). Below `lg`
 * the cards simply flow with a gap between them.
 *
 * Each card after the first is preceded by a gap element that carries a named view timeline. The
 * card before it animates on that timeline, so its "being covered" progress tracks the next card's
 * travel from the bottom of the viewport to its pinned spot, whatever the cards' heights.
 */
export function CaseStack({ cases }: { cases: CaseStackItem[] }) {
  const scope = cases.slice(1).map((_, i) => timelineName(i + 1))
  return (
    <div className="stack" style={{ timelineScope: scope.join(', ') || 'none' } as CSSProperties}>
      {cases.map((c, i) => {
        const last = i === cases.length - 1
        return (
          <Fragment key={c.id ?? i}>
            {i > 0 ? (
              <div
                aria-hidden="true"
                className="stack-gap"
                style={{ '--i': i, viewTimelineName: timelineName(i) } as CSSProperties}
              />
            ) : null}
            <CaseCard
              {...c}
              index={i}
              style={
                {
                  '--i': i,
                  ...(last ? {} : { animationTimeline: timelineName(i + 1) }),
                } as CSSProperties
              }
            />
          </Fragment>
        )
      })}
    </div>
  )
}

/** One card: numbered title and the three facts on the left, the screenshot rising out of the right. */
function CaseCard({
  work,
  index,
  title,
  struggle,
  built,
  changed,
  style,
}: CaseStackItem & { index: number; style?: CSSProperties }) {
  const facts = [
    { label: 'The struggle', text: struggle },
    { label: 'What we built', text: built },
    { label: 'What changed', text: changed, accent: true },
  ].filter((f) => f.text)
  // The case study hero is 16:9, the shape of the frame; the 4:3 card image is the fallback.
  const img = media(work.caseStudy?.hero?.image) ?? media(work.image?.image)

  return (
    <SmartLink
      href={workHref(work)}
      className={cx('case stack-card text-ink', tints[index % tints.length])}
      style={style}
    >
      <div className="flex flex-col lg:flex-row lg:h-full">
        <div className="flex flex-col gap-7 p-7 sm:p-10 lg:p-14 lg:w-[46%] lg:shrink-0">
          <p className="flex items-center gap-3.5 text-[15px] text-muted">
            <span className="font-display text-[17px] font-medium tracking-[-0.02em] text-ink">
              {String(index + 1).padStart(2, '0')}
            </span>
            {work.category ? <span>{work.category}</span> : null}
          </p>
          <h3 className="h-row max-w-[520px]">{title || work.title}</h3>
          <div className="flex flex-col gap-5 lg:mt-auto lg:pt-6">
            {facts.map((f) => (
              <dl key={f.label} className="m-0 flex flex-col gap-1.5 text-[16px] max-w-[480px]">
                <dt className={f.accent ? 'text-accent' : 'text-muted'}>{f.label}</dt>
                <dd className="m-0 font-medium leading-[1.4]">{f.text}</dd>
              </dl>
            ))}
          </div>
        </div>
        <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-0 lg:flex-1">
          <div className="case-frame absolute left-7 sm:left-10 lg:left-0 -right-10 top-0 lg:top-14 -bottom-6 overflow-hidden rounded-t-[12px] bg-white shadow-[0_24px_60px_-30px_rgba(17,19,24,0.35)]">
            <Shot img={img} className="h-full w-full" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </div>
      </div>
    </SmartLink>
  )
}
