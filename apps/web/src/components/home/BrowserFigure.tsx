import type { Media } from '@/payload-types'
import { Shot } from './Shot'

/** The home page's lead figure: a browser window rising out of a grey panel, captions beneath. */
export function BrowserFigure({
  img,
  caption,
  note,
}: {
  img: Media | null
  caption?: string | null
  note?: string | null
}) {
  return (
    <figure className="hero-fig m-0 flex flex-col gap-[18px] pt-14">
      <div
        className="flex justify-center overflow-hidden rounded-xl bg-fill"
        style={{ padding: 'clamp(24px, 4.4vw, 64px) clamp(24px, 4.4vw, 64px) 0' }}
      >
        <div className="w-full max-w-[1080px] flex flex-col bg-white rounded-t-xl shadow-[0_24px_60px_-30px_rgba(17,19,24,0.35)]">
          <div aria-hidden="true" className="flex items-center gap-[7px] h-10 px-4 border-b border-rule">
            <span className="block w-2.5 h-2.5 rounded-full bg-line" />
            <span className="block w-2.5 h-2.5 rounded-full bg-line" />
            <span className="block w-2.5 h-2.5 rounded-full bg-line" />
          </div>
          <Shot
            img={img}
            className="aspect-[16/8.2]"
            sizes="(min-width: 1408px) 1080px, 90vw"
            priority
          />
        </div>
      </div>
      {caption || note ? (
        <div className="flex flex-wrap justify-between gap-x-16 gap-y-3 text-[15px] text-muted">
          {caption ? (
            <figcaption className="flex-[1_1_420px] max-w-[620px]">{caption}</figcaption>
          ) : null}
          {note ? <p className="flex-[1_1_420px] max-w-[620px]">{note}</p> : null}
        </div>
      ) : null}
    </figure>
  )
}
