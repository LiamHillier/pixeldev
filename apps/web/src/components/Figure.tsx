import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cx, media } from '@/lib/utils'

type FigureData = {
  image?: Media | number | null
  placeholder?: string | null
  caption?: string | null
}

export type Tint = 'teal' | 'blue' | 'lilac'

const tintClass: Record<Tint, string> = {
  teal: 'bg-tint-teal',
  blue: 'bg-tint-blue',
  lilac: 'bg-tint-lilac',
}

/**
 * Renders an uploaded image, or a muted placeholder box with the editor's note until one exists.
 * `frameClassName` controls the box (aspect ratio / min height), so pass e.g. "aspect-[4/3]".
 * `tint` wraps the image in a soft coloured panel with the screenshot rising from the bottom edge,
 * which is how the Inline design presents product screens.
 */
export function Figure({
  data,
  frameClassName,
  className,
  sizes = '(min-width: 1408px) 1344px, 100vw',
  priority,
  showCaption = true,
  tint,
}: {
  data: FigureData | null | undefined
  frameClassName?: string
  className?: string
  sizes?: string
  priority?: boolean
  showCaption?: boolean
  tint?: Tint
}) {
  const img = media(data?.image)
  const caption = data?.caption
  const box = (
    <ImageBox
      img={img}
      placeholder={data?.placeholder}
      frameClassName={cx(
        tint &&
          'w-full max-w-[1080px] rounded-b-none bg-white shadow-[0_24px_60px_-30px_rgba(17,19,24,0.35)]',
        frameClassName,
      )}
      sizes={sizes}
      priority={priority}
    />
  )
  return (
    <figure className={cx('m-0 flex flex-col gap-4', className)}>
      {tint ? (
        <div
          className={cx(
            'flex justify-center overflow-hidden rounded-xl px-6 pt-6 sm:px-10 sm:pt-10 lg:px-16 lg:pt-16',
            tintClass[tint],
          )}
        >
          {box}
        </div>
      ) : (
        box
      )}
      {showCaption && caption ? (
        <figcaption className="max-w-[720px] text-[15px] text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

/** Payload returns absolute URLs on our own origin; next/image only allows them as local paths. */
function localPath(url: string) {
  return url.startsWith('http') ? new URL(url).pathname : url
}

export function ImageBox({
  img,
  placeholder,
  frameClassName,
  sizes = '(min-width: 1408px) 1344px, 100vw',
  priority,
}: {
  img: Media | null
  placeholder?: string | null
  frameClassName?: string
  sizes?: string
  priority?: boolean
}) {
  if (img?.url && img.width && img.height) {
    return (
      <div className={cx('relative overflow-hidden rounded-xl bg-fill', frameClassName)}>
        <Image
          src={localPath(img.url)}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes={sizes}
          priority={priority}
          className="w-full h-full object-cover object-top"
        />
      </div>
    )
  }
  return (
    <div
      className={cx(
        'flex items-center justify-center rounded-xl bg-fill text-[15px] text-muted text-center p-6',
        frameClassName,
      )}
      aria-hidden={placeholder ? undefined : true}
    >
      {placeholder}
    </div>
  )
}
