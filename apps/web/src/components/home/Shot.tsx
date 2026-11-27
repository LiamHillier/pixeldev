import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cx } from '@/lib/utils'

/** Payload returns absolute URLs on our own origin; next/image only allows them as local paths. */
function localPath(url: string) {
  return url.startsWith('http') ? new URL(url).pathname : url
}

/**
 * A screenshot that fills its aspect-ratio box from the top edge. With no image it falls back to the
 * moving-grid placeholder, so the frame never looks broken.
 */
export function Shot({
  img,
  className,
  sizes,
  priority,
}: {
  img: Media | null
  className?: string
  sizes: string
  priority?: boolean
}) {
  if (!img?.url || !img.width || !img.height) {
    return <div aria-hidden="true" className={cx('ph', className)} />
  }
  return (
    <div className={cx('relative overflow-hidden', className)}>
      <Image
        src={localPath(img.url)}
        alt={img.alt}
        width={img.width}
        height={img.height}
        sizes={sizes}
        priority={priority}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
    </div>
  )
}
