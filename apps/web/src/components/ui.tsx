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

export function Button({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <SmartLink href={href} className={cx('btn-ink', className)}>
      {children}
    </SmartLink>
  )
}

export function ULink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <SmartLink href={href} className={cx('link-u text-[16px]', className)}>
      {children}
    </SmartLink>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('text-[15px] text-faint', className)}>{children}</p>
}

export function Crumb({ parent, parentHref, current }: { parent: string; parentHref: string; current: string }) {
  return (
    <p className="flex gap-2.5 text-[15px] text-faint">
      <Link href={parentHref} className="hover:text-accent">
        {parent}
      </Link>
      <span>/</span>
      <span>{current}</span>
    </p>
  )
}

/** Big serif number with a small label. */
export function Stat({ value, label, size = 'md' }: { value: string; label: string; size?: 'md' | 'lg' }) {
  return (
    <div className="flex flex-col">
      <span className={cx('font-serif leading-[1.1]', size === 'lg' ? 'text-[56px] leading-none' : 'text-[30px]')}>{value}</span>
      <span className={cx('text-faint', size === 'lg' ? 'text-[15px] text-muted' : 'text-[14px]')}>{label}</span>
    </div>
  )
}

export function StatRow({ stats, className }: { stats?: { value: string; label: string }[] | null; className?: string }) {
  if (!stats?.length) return null
  return (
    <div className={cx('flex flex-wrap gap-8 pt-3 border-t border-rule', className)}>
      {stats.map((s, i) => (
        <Stat key={i} value={s.value} label={s.label} />
      ))}
    </div>
  )
}

/** Numbered step card used in "How a project runs" and "How I approach it". */
export function NumberedCard({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-3 pt-5 border-t border-rule">
      <p className="font-serif text-[40px] leading-none text-faint">{n}</p>
      <h3 className="text-[26px] leading-[1.2]">{title}</h3>
      <p className="text-[16px] text-muted">{body}</p>
    </div>
  )
}

/** Title + body stacked, with rules between items. */
export function RuledList({
  items,
  titleClassName = 'font-semibold text-[17px]',
}: {
  items?: { title: string; body: string }[] | null
  titleClassName?: string
}) {
  if (!items?.length) return null
  return (
    <ul className="flex flex-col m-0 p-0 list-none">
      {items.map((it, i) => (
        <li key={i} className={cx('flex flex-col gap-1 py-[18px] border-t border-rule', i === items.length - 1 && 'border-b')}>
          <span className={titleClassName}>{it.title}</span>
          <span className="text-[16px] text-muted">{it.body}</span>
        </li>
      ))}
    </ul>
  )
}

export function Faqs({ heading, items }: { heading?: string | null; items?: { question: string; answer: string }[] | null }) {
  if (!items?.length) return null
  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-8 lg:gap-x-20 py-16 lg:py-20 border-t border-ink items-start">
      <h2 className="h-section">{heading ?? 'Questions I get asked'}</h2>
      <div className="flex flex-col">
        {items.map((f, i) => (
          <div key={i} className={cx('flex flex-col gap-2 py-5 border-t border-rule', i === items.length - 1 && 'border-b')}>
            <h3 className="text-[24px] leading-[1.2]">{f.question}</h3>
            <p className="text-[16px] text-muted">{f.answer}</p>
          </div>
        ))}
      </div>
    </section>
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
    <section className="flex flex-wrap items-center justify-between gap-6 lg:gap-x-12 pt-16 pb-20 lg:pt-20 lg:pb-24 border-t border-ink">
      <h2 className="font-serif leading-[1.02] tracking-[-0.015em] max-w-[620px]" style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}>
        {heading}
      </h2>
      <div className="flex flex-col gap-3.5 max-w-[400px]">
        {body ? <p className="text-[17px] text-body">{body}</p> : null}
        <div className="flex flex-wrap items-center gap-4 lg:gap-x-6">
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
    <section className={cx('flex flex-col gap-7 pt-16 pb-14 lg:pt-24 lg:pb-[72px] max-w-[900px]', className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="h-page">{heading}</h1>
      {intro ? <p className="text-[21px] leading-[1.5] text-body max-w-[680px]">{intro}</p> : null}
      {children}
    </section>
  )
}
