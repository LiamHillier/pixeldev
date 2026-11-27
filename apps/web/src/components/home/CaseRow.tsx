import type { Work } from '@/payload-types'
import { SmartLink } from '@/components/ui'
import { cx, media, workHref } from '@/lib/utils'
import { Shot } from './Shot'

const tints = ['bg-tint-teal', 'bg-tint-blue', 'bg-tint-lilac'] as const

/** One case row: the screenshot in a tinted frame, then title, struggle, build and outcome. */
export function CaseRow({
  work,
  index,
  title,
  struggle,
  built,
  changed,
}: {
  work: Work
  index: number
  title?: string | null
  struggle?: string | null
  built?: string | null
  changed?: string | null
}) {
  const facts = [
    { label: 'The struggle:', text: struggle },
    { label: 'What we built:', text: built },
    { label: 'What changed:', text: changed, accent: true },
  ].filter((f) => f.text)

  return (
    <SmartLink href={workHref(work)} className="case rv flex flex-col gap-7">
      <div
        className={cx('flex justify-center overflow-hidden rounded-xl', tints[index % tints.length])}
        style={{ padding: 'clamp(24px, 4.4vw, 64px) clamp(24px, 4.4vw, 64px) 0' }}
      >
        <Shot
          img={media(work.image?.image)}
          className="case-frame w-full max-w-[900px] aspect-[16/7.4] bg-white rounded-t-[10px]"
          sizes="(min-width: 1408px) 900px, 90vw"
        />
      </div>
      <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-10 gap-y-5 text-ink">
        <h3 className="text-[24px] lg:text-[26px] leading-[1.12] tracking-[-0.03em]">
          {title || work.title}
        </h3>
        {facts.map((f) => (
          <dl key={f.label} className="m-0 flex flex-col gap-2 text-[16px]">
            <dt className={f.accent ? 'text-accent' : 'text-muted'}>{f.label}</dt>
            <dd className="m-0 font-medium">{f.text}</dd>
          </dl>
        ))}
      </div>
    </SmartLink>
  )
}
