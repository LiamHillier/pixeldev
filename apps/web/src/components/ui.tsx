import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'
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

// Headings ---------------------------------------------------------------------------------------

export type PillKind = 'toggle' | 'sync' | 'live' | 'img'

/** The small animated glyphs that sit inside headings: a switch, two joining dots, a live ping, a photo. */
export function Pill({ kind }: { kind: PillKind }) {
  if (kind === 'img') {
    return (
      <span className="pill-img" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-pill.jpg" alt="" width={480} height={188} />
      </span>
    )
  }
  return <span className={`pill pill-${kind}`} aria-hidden="true" />
}

/**
 * Heading markup, so editors control the two tones from the admin:
 *   *text*    grey (the second tone)
 *   ~text~    inks in from grey to ink as it scrolls into view
 *   {toggle} {sync} {live} {img}   an inline pill glyph
 * Example: "Work that changed *how a business runs*" or "~Let's talk~ {toggle} *about your business.*"
 */
const MARKUP = /(\*[^*]+\*|~[^~]+~|\{(?:toggle|sync|live|img)\})/g

export function hasHeadingMarkup(text: string): boolean {
  return /\*[^*]+\*|~[^~]+~|\{(?:toggle|sync|live|img)\}/.test(text)
}

/** The heading as plain text, for titles, metadata and share cards. */
export function plainHeading(text?: string | null): string {
  return (text ?? '')
    .replace(/\{(?:toggle|sync|live|img)\}/g, '')
    .replace(/[*~]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function renderMarkup(text: string): ReactNode {
  return text.split(MARKUP).map((part, i) => {
    if (!part) return null
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <span key={i} className="text-grey">
          {part.slice(1, -1)}
        </span>
      )
    }
    if (part.startsWith('~') && part.endsWith('~') && part.length > 2) {
      return (
        <span key={i} className="inkin">
          {part.slice(1, -1)}
        </span>
      )
    }
    const pill = part.match(/^\{(toggle|sync|live|img)\}$/)
    if (pill) return <Pill key={i} kind={pill[1] as PillKind} />
    return <Fragment key={i}>{part}</Fragment>
  })
}

/**
 * Splits a plain heading into an ink lead and a grey tail: after the first sentence, else after the
 * first comma. Only used for content titles (case studies, articles) that have no markup of their own.
 */
export function splitHeading(text: string): [string, string] | null {
  const sentence = text.match(/^(.+?[.?!])\s+(\S.*)$/)
  if (sentence && sentence[1].length >= 4) return [sentence[1], sentence[2]]
  const comma = text.match(/^(.+?,)\s+(\S.*)$/)
  if (comma && comma[1].length >= 8 && comma[2].length >= 6) return [comma[1], comma[2]]
  return null
}

/**
 * Renders a heading. Markup (see above) always wins. Without markup the text is shown as written,
 * unless `auto` is set: then it splits into two tones, with `pill` placed between the halves.
 */
export function TwoTone({
  text,
  auto,
  pill,
}: {
  text?: string | null
  auto?: boolean
  pill?: PillKind
}) {
  if (!text) return null
  if (hasHeadingMarkup(text)) return <>{renderMarkup(text)}</>
  if (!auto) return <>{text}</>
  const parts = splitHeading(text)
  if (!parts) return <>{text}</>
  return (
    <>
      {parts[0]} {pill ? <Pill kind={pill} /> : null}
      {pill ? ' ' : null}
      <span className="text-grey">{parts[1]}</span>
    </>
  )
}

// Links and buttons -----------------------------------------------------------------------------

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
      className={cx('u inline-flex items-center min-h-[44px] text-[17px]', className)}
    >
      {children}
    </SmartLink>
  )
}

/** Teal circle with an arrow. Inside a `.go` link it turns ink, grows and loops its arrow on hover. */
export function ArrowDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'dot inline-flex shrink-0 items-center justify-center w-[34px] h-[34px] rounded-full bg-accent text-white',
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
      className={cx('go inline-flex items-center gap-3.5 min-h-[44px] text-[17px]', className)}
    >
      <span className="u">{children}</span>
      <ArrowDot />
    </SmartLink>
  )
}

// Small pieces ----------------------------------------------------------------------------------

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
      <Link href={parentHref} className="u">
        {parent}
      </Link>
      <span aria-hidden="true">/</span>
      <span>{current}</span>
    </p>
  )
}

/** Big display number with a small label. `accent` sets the number in teal. */
export function Stat({
  value,
  label,
  size = 'md',
  accent,
}: {
  value: string
  label: string
  size?: 'md' | 'lg'
  accent?: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      <span
        className={cx(
          'font-display font-medium tracking-[-0.05em]',
          size === 'lg' ? 'leading-none' : 'text-[30px] leading-[1.1]',
          accent && 'text-accent',
        )}
        style={size === 'lg' ? { fontSize: 'clamp(44px, 4.6vw, 66px)' } : undefined}
      >
        {value}
      </span>
      <span
        className={cx('text-muted', size === 'lg' ? 'text-[16px] max-w-[260px]' : 'text-[14px]')}
      >
        {label}
      </span>
    </div>
  )
}

/** A full-width band of big numbers between light rules. The last value is teal. */
export function StatBand({
  stats,
  className,
}: {
  stats?: { value: string; label: string }[] | null
  className?: string
}) {
  if (!stats?.length) return null
  return (
    <section className={cx('pt-20 lg:pt-28', className)}>
      <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-8 gap-y-10 py-14 border-y border-rule">
        {stats.map((s, i) => (
          <Stat
            key={i}
            value={s.value}
            label={s.label}
            size="lg"
            accent={i === stats.length - 1 && stats.length > 1}
          />
        ))}
      </div>
    </section>
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

/**
 * Numbered step: a large outlined teal numeral that fills as it scrolls in, then title and body.
 * `size` 'lg' is the home page's 96px numeral; the default is 80px.
 */
export function NumberedCard({
  n,
  title,
  body,
  size = 'md',
}: {
  n: number
  title: string
  body: string
  /** Kept for older callers; the numeral colour no longer changes on the last step. */
  last?: boolean
  size?: 'md' | 'lg'
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <p
        className={cx(
          'num font-display font-medium leading-[0.9] tracking-[-0.05em]',
          size === 'lg'
            ? 'text-[72px] lg:text-[96px] pb-5 lg:pb-7'
            : 'text-[64px] lg:text-[80px] pb-4 lg:pb-6',
        )}
      >
        {n}
      </p>
      <h3 className="text-[24px] lg:text-[26px] leading-[1.12] tracking-[-0.03em]">{title}</h3>
      <p className="text-[16px] text-muted">{body}</p>
    </div>
  )
}

/** Small-numbered step under a thin ink rule (the home page's "Working with us" row). */
export function RuleStep({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="wipe flex flex-col gap-3 pt-5 border-t border-ink">
      <span className="text-[16px] text-muted pb-9">{n}</span>
      <h3 className="text-[24px] lg:text-[26px] leading-[1.12] tracking-[-0.03em]">{title}</h3>
      <p className="text-[16px] text-muted">{body}</p>
    </div>
  )
}

/** Title and body stacked; an ink rule on top, light rules between, "01" counters on the right. */
export function RuledList({
  items,
  titleClassName = 'text-[19px] font-medium tracking-[-0.02em]',
}: {
  items?: { title: string; body: string }[] | null
  titleClassName?: string
}) {
  if (!items?.length) return null
  return (
    <ul className="ruled rv-li flex flex-col">
      {items.map((it, i) => (
        <li
          key={i}
          className={cx(
            'flex flex-col gap-1.5 py-[22px] pr-12 border-t',
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

/** A row of short statements, each under a 2px ink rule that draws in and turns teal on hover. */
export function RuleGrid({
  items,
  min = 270,
}: {
  items?: { title: string; body?: string | null }[] | null
  min?: number
}) {
  if (!items?.length) return null
  return (
    <div
      className="grid gap-x-8 gap-y-10"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))` }}
    >
      {items.map((p, i) => (
        <div key={i} className="rule2 wipe flex flex-col gap-3 pt-[22px]">
          <p className="text-[21px] lg:text-[22px] leading-[1.25] tracking-[-0.025em]">{p.title}</p>
          {p.body ? <p className="text-[16px] text-muted">{p.body}</p> : null}
        </div>
      ))}
    </div>
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
      <div className="rv flex-[1_1_380px] min-w-0 flex flex-col gap-5">
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
    <SplitSection heading={<TwoTone text={heading ?? 'Questions *we get asked*'} />}>
      <div className="flex flex-col">
        {items.map((f, i) => (
          <div
            key={i}
            className={cx(
              'rv flex flex-col gap-2.5 py-[26px] border-t',
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

/** Scrolling strip of names with teal dots between them. Pauses on hover. */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  if (items.length < 2) return null
  const list = (hidden?: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex items-center gap-11 m-0 px-[22px] list-none whitespace-nowrap font-display text-[24px] lg:text-[30px] leading-[1.2] font-medium tracking-[-0.035em] text-[#6b707a]"
    >
      {/* Repeat short lists so one copy is always wider than the screen. */}
      {Array.from({ length: Math.max(1, Math.ceil(8 / items.length)) }).flatMap((_, r) =>
        items.map((name, i) => (
          <Fragment key={`${r}-${i}`}>
            <li>{name}</li>
            <li aria-hidden="true" className="w-2 h-2 rounded-full bg-accent" />
          </Fragment>
        )),
      )}
    </ul>
  )
  return (
    <section aria-label={label} className="mq pt-10 -mx-5 sm:-mx-8">
      <div className="mq-track">
        {list()}
        {list(true)}
      </div>
    </section>
  )
}

/**
 * The dark closing panel. The heading takes markup; the usual form is
 * "~Lead~ {toggle} *grey tail*", which inks in as it scrolls up.
 */
export function ClosingCta({
  heading,
  body,
  ctaLabel,
  href = '/contact',
  secondary,
  size = 'md',
}: {
  heading?: string | null
  body?: string | null
  ctaLabel?: string | null
  href?: string
  secondary?: ReactNode
  /** 'lg' is the home page's larger closing headline. */
  size?: 'md' | 'lg'
}) {
  if (!heading) return null
  return (
    <section
      className="cta-panel flex flex-col gap-14 lg:gap-16 pt-[176px] pb-32 mb-14"
      style={{ paddingLeft: 'clamp(24px, 6.5vw - 32px, 64px)', paddingRight: 'clamp(24px, 6.5vw - 32px, 64px)' }}
    >
      <h2
        className="font-display font-medium leading-[1.02] tracking-[-0.045em] max-w-[1200px]"
        style={{ fontSize: size === 'lg' ? 'clamp(40px, 6.5vw, 94px)' : 'clamp(36px, 5.4vw, 78px)' }}
      >
        <TwoTone text={heading} />
      </h2>
      <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
        {body ? <p className="lead flex-[1_1_420px] max-w-[560px]">{body}</p> : null}
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <Button href={href}>{ctaLabel ?? 'Talk about your business'}</Button>
          {secondary}
        </div>
      </div>
    </section>
  )
}

/** Page hero: optional eyebrow, the h1 and an intro row. Children land beside the intro. */
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
    <section className={cx('hero-in flex flex-col gap-8 lg:gap-12 pt-10 lg:pt-14', className)}>
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
