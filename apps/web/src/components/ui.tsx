import Link from 'next/link'
import type { ReactNode } from 'react'
import { cx, isExternal } from '@/lib/utils'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('max-w-site mx-auto px-5 sm:px-8', className)}>{children}</div>
}

export function SmartLink({
  href,
  children,
  className,
  ...rest
}: {
  href: string
  children: ReactNode
  className?: string
  'aria-current'?: 'page'
}) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className} rel="noopener" {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  )
}

/**
 * Splits a heading into an ink lead and a grey tail, the Inline design's two-tone headline.
 * Splits after the first sentence ("Properly."), or else after the first comma. Short or
 * single-clause headings stay one colour.
 */
export function splitHeading(text: string): [string, string] | null {
  const sentence = text.match(/^(.+?[.?!])\s+(\S.*)$/)
  if (sentence && sentence[1].length >= 4) return [sentence[1], sentence[2]]
  const comma = text.match(/^(.+?,)\s+(\S.*)$/)
  if (comma && comma[1].length >= 8 && comma[2].length >= 6) return [comma[1], comma[2]]
  return null
}

export function TwoTone({ text }: { text?: string | null }) {
  if (!text) return null
  const parts = splitHeading(text)
  if (!parts) return <>{text}</>
  return (
    <>
      {parts[0]} <span className="text-grey">{parts[1]}</span>
    </>
  )
}

export function Button({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <SmartLink href={href} className={cx('btn-ink', className)}>
      {children}
    </SmartLink>
  )
}

export function ULink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <SmartLink
      href={href}
      className={cx('link-u inline-flex items-center min-h-[44px] text-[17px]', className)}
    >
      {children}
    </SmartLink>
  )
}

/** Teal circle with an arrow. Turns ink when its parent `.group` is hovered. */
export function ArrowDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'inline-flex shrink-0 items-center justify-center w-[34px] h-[34px] rounded-full bg-accent text-white transition-colors group-hover:bg-ink',
        className,
      )}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  )
}

/** Underlined label followed by the teal arrow dot. */
export function GoLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <SmartLink
      href={href}
      className={cx('group inline-flex items-center gap-3.5 min-h-[44px] text-[17px]', className)}
    >
      <span className="underline underline-offset-[5px] decoration-1">{children}</span>
      <ArrowDot />
    </SmartLink>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('text-[16px] text-muted', className)}>{children}</p>
}

export function Crumb({
  parent,
  parentHref,
  current,
}: {
  parent: string
  parentHref: string
  current: string
}) {
  return (
    <p className="flex flex-wrap gap-2.5 text-[16px] text-muted">
      <Link href={parentHref} className="link-u">
        {parent}
      </Link>
      <span aria-hidden="true">/</span>
      <span>{current}</span>
    </p>
  )
}

/** Big display number with a small label. */
export function Stat({
  value,
  label,
  size = 'md',
}: {
  value: string
  label: string
  size?: 'md' | 'lg'
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className={cx(
          'font-display font-medium tracking-[-0.045em]',
          size === 'lg' ? 'leading-none' : 'text-[30px] leading-[1.1]',
        )}
        style={size === 'lg' ? { fontSize: 'clamp(44px, 4.6vw, 66px)' } : undefined}
      >
        {value}
      </span>
      <span className={cx('text-muted', size === 'lg' ? 'text-[16px] max-w-[260px]' : 'text-[14px]')}>
        {label}
      </span>
    </div>
  )
}

export function StatRow({
  stats,
  className,
}: {
  stats?: { value: string; label: string }[] | null
  className?: string
}) {
  if (!stats?.length) return null
  return (
    <div className={cx('flex flex-wrap gap-8 pt-4 border-t border-rule', className)}>
      {stats.map((s, i) => (
        <Stat key={i} value={s.value} label={s.label} />
      ))}
    </div>
  )
}

/** Numbered step: a large grey numeral, title and body. The last step's numeral is ink. */
export function NumberedCard({
  n,
  title,
  body,
  last,
}: {
  n: number
  title: string
  body: string
  last?: boolean
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <p
        className={cx(
          'font-display font-medium text-[64px] lg:text-[80px] leading-[0.9] tracking-[-0.05em] pb-4 lg:pb-6',
          last ? 'text-ink' : 'text-grey',
        )}
      >
        {n}
      </p>
      <h3 className="text-[24px] lg:text-[26px] leading-[1.12]">{title}</h3>
      <p className="text-[16px] text-muted">{body}</p>
    </div>
  )
}

/** Title + body stacked, an ink rule on top then light rules between items. */
export function RuledList({
  items,
  titleClassName = 'text-[19px] font-medium tracking-[-0.02em]',
}: {
  items?: { title: string; body: string }[] | null
  titleClassName?: string
}) {
  if (!items?.length) return null
  return (
    <ul className="flex flex-col m-0 p-0 list-none">
      {items.map((it, i) => (
        <li
          key={i}
          className={cx(
            'flex flex-col gap-1.5 py-[22px] border-t',
            i === 0 ? 'border-ink' : 'border-rule',
            i === items.length - 1 && 'border-b border-b-rule',
          )}
        >
          <span className={titleClassName}>{it.title}</span>
          <span className="text-[16px] text-muted">{it.body}</span>
        </li>
      ))}
    </ul>
  )
}

/** Heading on the left, content on the right; stacks on narrow screens. */
export function SplitSection({
  heading,
  intro,
  children,
  className,
  id,
}: {
  heading: ReactNode
  intro?: string | null
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section
      id={id}
      className={cx('section-gap flex flex-wrap items-start gap-x-24 gap-y-10', className)}
    >
      <div className="flex-[1_1_380px] min-w-0 flex flex-col gap-5">
        <h2 className="h-section">{heading}</h2>
        {intro ? <p className="max-w-[440px] text-[18px] text-muted">{intro}</p> : null}
      </div>
      <div className="flex-[1.4_1_480px] min-w-0">{children}</div>
    </section>
  )
}

export function Faqs({
  heading,
  items,
}: {
  heading?: string | null
  items?: { question: string; answer: string }[] | null
}) {
  if (!items?.length) return null
  return (
    <SplitSection heading={<TwoTone text={heading ?? 'Questions we get asked'} />}>
      <div className="flex flex-col">
        {items.map((f, i) => (
          <div
            key={i}
            className={cx(
              'flex flex-col gap-2.5 py-[26px] border-t',
              i === 0 ? 'border-ink' : 'border-rule',
              i === items.length - 1 && 'border-b border-b-rule',
            )}
          >
            <h3 className="text-[24px] lg:text-[26px] leading-[1.12]">{f.question}</h3>
            <p className="text-[16px] text-muted">{f.answer}</p>
          </div>
        ))}
      </div>
    </SplitSection>
  )
}

export function ClosingCta({
  heading,
  body,
  ctaLabel,
  href = '/contact',
  secondary,
}: {
  heading?: string | null
  body?: string | null
  ctaLabel?: string | null
  href?: string
  secondary?: ReactNode
}) {
  if (!heading) return null
  return (
    <section className="flex flex-col gap-10 lg:gap-14 pt-28 lg:pt-[168px] pb-24 lg:pb-[136px]">
      <h2
        className="font-display font-medium leading-[1.02] tracking-[-0.045em] max-w-[1200px]"
        style={{ fontSize: 'clamp(40px, 5.4vw, 78px)' }}
      >
        <TwoTone text={heading} />
      </h2>
      <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
        {body ? <p className="lead flex-[1_1_420px] max-w-[560px]">{body}</p> : null}
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <Button href={href}>{ctaLabel ?? 'Start a project'}</Button>
          {secondary}
        </div>
      </div>
    </section>
  )
}

export function PageHeader({
  eyebrow,
  heading,
  intro,
  children,
  className,
}: {
  eyebrow?: string | null
  heading: string
  intro?: string | null
  children?: ReactNode
  className?: string
}) {
  return (
    <section className={cx('flex flex-col gap-8 lg:gap-12 pt-14 lg:pt-[72px]', className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="h-page max-w-[1240px]">
        <TwoTone text={heading} />
      </h1>
      {intro || children ? (
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          {intro ? <p className="lead flex-[1_1_420px] max-w-[700px]">{intro}</p> : null}
          {children}
        </div>
      ) : null}
    </section>
  )
}
