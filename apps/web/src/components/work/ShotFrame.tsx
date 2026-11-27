import type { CSSProperties } from 'react'
import { ImageBox, type Tint } from '@/components/Figure'
import { cx } from '@/lib/utils'
import type { Media } from '@/payload-types'

export const TINTS: Tint[] = ['teal', 'blue', 'lilac']
export const tintAt = (i: number): Tint => TINTS[i % TINTS.length]

export const tintBg: Record<Tint, string> = {
  teal: 'bg-tint-teal',
  blue: 'bg-tint-blue',
  lilac: 'bg-tint-lilac',
}

/**
 * The design's product-screen presentation: a soft tinted panel with a white screenshot frame rising
 * from its bottom edge. With no image the white frame shows the moving placeholder grid (`ph`).
 * `innerClassName` takes the aspect ratio and, inside a `.case` link, `case-frame` so it lifts.
 */
export function ShotFrame({
  img,
  tint = 'teal',
  pad = 'clamp(24px, 3.3vw, 48px)',
  innerClassName,
  className,
  radius = 'rounded-t-[10px]',
  shadow,
  sizes = '(min-width: 1024px) 800px, 100vw',
  priority,
}: {
  img: Media | null
  tint?: Tint
  /** CSS length for the top and side padding of the tinted panel. */
  pad?: string
  innerClassName?: string
  className?: string
  radius?: string
  shadow?: boolean
  sizes?: string
  priority?: boolean
}) {
  const style: CSSProperties = { paddingTop: pad, paddingLeft: pad, paddingRight: pad }
  const inner = cx(
    'w-full bg-white rounded-b-none',
    radius,
    shadow && 'shadow-[0_24px_60px_-30px_rgba(17,19,24,0.35)]',
    innerClassName,
  )
  return (
    <div
      className={cx('flex justify-center overflow-hidden rounded-xl', tintBg[tint], className)}
      style={style}
    >
      {img?.url ? (
        <ImageBox img={img} frameClassName={inner} sizes={sizes} priority={priority} />
      ) : (
        <div className={cx('ph', inner)} aria-hidden="true" />
      )}
    </div>
  )
}
