import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cx, media } from '@/lib/utils'

type FigureData = {
  image?: Media | number | null
  placeholder?: string | null
  caption?: string | null
}

/**
 * Renders an uploaded image, or a muted placeholder box with the editor's note until one exists.
 * `frameClassName` controls the box (aspect ratio / min height), so pass e.g. "aspect-[4/3]".
 */
export function Figure({
  data,
  frameClassName,
  className,
  sizes = '(min-width: 1980px) 1980px, 100vw',
  priority,
  showCaption = true,
}: {
  data: FigureData | null | undefined
  frameClassName?: string
  className?: string
  sizes?: string
  priority?: boolean
  showCaption?: boolean
}) {
  const img = media(data?.image)
  const caption = data?.caption
  return (
    <figure className={cx('m-0 flex flex-col gap-3.5', className)}>
      <ImageBox
        img={img}
        placeholder={data?.placeholder}
        frameClassName={frameClassName}
        sizes={sizes}
        priority={priority}
      />
      {showCaption && caption ? (
        <figcaption className="text-[14px] text-faint">{caption}</figcaption>
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
  sizes = '(min-width: 1980px) 1980px, 100vw',
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
      <div className={cx('relative overflow-hidden bg-fill', frameClassName)}>
        <Image
          src={localPath(img.url)}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes={sizes}
          priority={priority}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }
  return (
    <div
      className={cx(
        'flex items-center justify-center bg-fill text-[15px] text-faint text-center p-6',
        frameClassName,
      )}
      aria-hidden={placeholder ? undefined : true}
    >
      {placeholder}
    </div>
  )
}
