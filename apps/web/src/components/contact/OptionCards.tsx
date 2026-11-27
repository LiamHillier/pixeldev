import type { Tint } from '@/components/Figure'
import { cx, isExternal } from '@/lib/utils'

export type OptionCard = { title: string; body?: string | null; href: string; tint: Tint }

const tintClass: Record<Tint, string> = {
  teal: 'bg-tint-teal',
  blue: 'bg-tint-blue',
  lilac: 'bg-tint-lilac',
}

/**
 * The tinted ways-to-get-in-touch cards. The grid is auto-fit, so one, two or three cards always
 * fill the row.
 */
export function OptionCards({ cards }: { cards: OptionCard[] }) {
  if (!cards.length) return null
  return (
    <section className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4 pt-14 lg:pt-[72px]">
      {cards.map((c) => (
        <a
          key={c.href}
          href={c.href}
          {...(isExternal(c.href) ? { rel: 'noopener' } : {})}
          className={cx(
            'opt flex flex-col justify-between gap-10 min-h-[200px] p-7 rounded-xl',
            tintClass[c.tint],
          )}
        >
          <span className="opt-t font-display text-[24px] lg:text-[26px] leading-[1.12] font-medium tracking-[-0.03em]">
            {c.title}
          </span>
          {c.body ? <span className="text-[16px] text-body">{c.body}</span> : null}
        </a>
      ))}
    </section>
  )
}
