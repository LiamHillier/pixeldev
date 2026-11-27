import type { ReactNode } from 'react'
import { ImageBox } from '@/components/Figure'
import { tintBg } from '@/components/work/ShotFrame'
import type { Tint } from '@/components/Figure'
import { cx, media } from '@/lib/utils'
import type { Post } from '@/payload-types'

const box =
  'flex items-center justify-center shrink-0 w-[38px] h-[38px] sm:w-[46px] sm:h-[46px] box-border rounded-[10px] font-medium'
const link = <span aria-hidden="true" className="w-3 sm:w-[22px] h-0.5 bg-[#b9bdc6]" />

/**
 * "Before: five Zaps in a chain / After: one small service". Step 4 blinks red; the queue bars pulse.
 * Drawn for the Zapier article, so it only appears on that post (see `postVisual`).
 */
export function ZapierFlow() {
  return (
    <div className="flow w-full flex flex-wrap items-center justify-center gap-x-16 gap-y-8 text-[14px] text-ink text-left">
      <div className="flex flex-col gap-3.5">
        <span className="text-muted">Before: five Zaps in a chain</span>
        <div className="flex items-center">
          <span className={cx(box, 'border border-line bg-white')}>1</span>
          {link}
          <span className={cx(box, 'border border-line bg-white')}>2</span>
          {link}
          <span className={cx(box, 'border border-line bg-white')}>3</span>
          {link}
          <span className={cx(box, 'zap-bad border-2 border-dashed border-[#b4232a] bg-white text-[#b4232a]')}>
            4
          </span>
          {link}
          <span className={cx(box, 'border border-line text-[#6b707a]')}>5</span>
        </div>
        <span className="text-[#b4232a]">Step 4 fails at 2am.</span>
      </div>
      <div className="flex flex-col gap-3.5">
        <span className="text-muted">After: one small service</span>
        <div className="w-[200px] box-border flex flex-col gap-3.5 px-5 py-[22px] bg-ink rounded-2xl text-white text-left">
          <span className="font-display text-[20px] leading-[1.15] font-medium tracking-[-0.03em]">
            One small service
          </span>
          <span className="q" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="text-[13px] text-[#c3c7cf]">A queue and a log</span>
        </div>
      </div>
    </div>
  )
}

/** Posts with a drawn diagram instead of a cover image, keyed by slug. */
const drawn: Record<string, () => ReactNode> = {
  'why-your-zapier-chain-breaks-at-2am': () => <ZapierFlow />,
}

export function hasDrawnVisual(post: Pick<Post, 'slug'>): boolean {
  return Boolean(post.slug && drawn[post.slug])
}

/**
 * The visual for a post, inside a tinted frame: the drawn diagram if the post has one, else its cover
 * image, else the placeholder grid. `className` sets the frame shape (aspect ratio, `case-lift`).
 */
export function PostVisual({
  post,
  tint = 'teal',
  className,
  sizes = '(min-width: 1024px) 800px, 100vw',
  priority,
}: {
  post: Post
  tint?: Tint
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const Drawn = post.slug ? drawn[post.slug] : undefined
  const img = media(post.cover?.image)
  if (Drawn) {
    return (
      <div
        className={cx(
          'flex items-center justify-center p-6 sm:p-8 box-border rounded-xl',
          tintBg[tint],
          className,
        )}
      >
        <Drawn />
      </div>
    )
  }
  if (img?.url) {
    return (
      <div className={cx('overflow-hidden rounded-xl', tintBg[tint], className)}>
        <ImageBox img={img} frameClassName="h-full w-full rounded-xl" sizes={sizes} priority={priority} />
      </div>
    )
  }
  return <div className={cx('ph rounded-xl', tintBg[tint], className)} aria-hidden="true" />
}
