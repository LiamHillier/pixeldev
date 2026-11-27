import { cx } from '@/lib/utils'
import type { Tint } from '@/components/Figure'

export type DiagramData = {
  inputs?: { label: string; id?: string | null }[] | null
  hubTitle?: string | null
  hubNote?: string | null
  outputs?: { label: string; waiting?: boolean | null; id?: string | null }[] | null
  caption?: string | null
}

const tintClass: Record<Tint, string> = {
  teal: 'bg-tint-teal',
  blue: 'bg-tint-blue',
  lilac: 'bg-tint-lilac',
}

/** One labelled box with a status light. `waiting` gives it a dashed ink border and an amber pulse. */
export function DiagramChip({ label, waiting }: { label: string; waiting?: boolean | null }) {
  return (
    <span
      className={cx(
        'flex items-center gap-2.5 min-h-[46px] px-4 rounded-[10px] bg-white text-ink',
        waiting ? 'border border-dashed border-ink' : 'border border-line',
      )}
    >
      <span className={cx('led', waiting && 'led-wait')} aria-hidden="true" />
      {label}
    </span>
  )
}

/** The line between columns, with a teal dot running along it. `second` offsets the dot's timing. */
export function DiagramWire({ second }: { second?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx('wire flex-[1_1_48px] max-w-[140px]', second && 'wire-2')}
    />
  )
}

/** The dark box in the middle: a title, a little bouncing queue, and a note. */
export function DiagramHub({ title, note }: { title?: string | null; note?: string | null }) {
  return (
    <div className="flex-[0_0_auto] w-[200px] flex flex-col gap-3.5 py-[22px] px-5 bg-ink rounded-2xl text-white text-left">
      {title ? (
        <span className="font-display text-[20px] leading-[1.15] font-medium tracking-[-0.03em]">
          {title}
        </span>
      ) : null}
      <span className="q" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      {note ? <span className="text-[13px] text-[#c3c7cf]">{note}</span> : null}
    </div>
  )
}

/**
 * Inputs flow through one box into results: the small animated system diagrams on the AI and
 * Integrations pages. The input lights pulse in turn (`flow-in`), dots run along the wires and the
 * queue in the middle bounces.
 */
export function SystemDiagram({ data }: { data: DiagramData }) {
  const inputs = data.inputs ?? []
  const outputs = data.outputs ?? []
  const summary = [
    inputs.map((i) => i.label).join(', '),
    data.hubTitle,
    outputs.map((o) => o.label).join(', '),
  ]
    .filter(Boolean)
    .join(' → ')
  return (
    <div
      role="img"
      aria-label={summary}
      className="w-full flex flex-wrap items-center justify-center gap-y-5 text-[15px] text-ink text-left"
    >
      <div className="flow-in flex-[0_1_230px] min-w-0 flex flex-col gap-3">
        {inputs.map((i, n) => (
          <DiagramChip key={i.id ?? n} label={i.label} />
        ))}
      </div>
      <DiagramWire />
      <DiagramHub title={data.hubTitle} note={data.hubNote} />
      <DiagramWire second />
      <div className="flex-[0_1_230px] min-w-0 flex flex-col gap-3">
        {outputs.map((o, n) => (
          <DiagramChip key={o.id ?? n} label={o.label} waiting={o.waiting} />
        ))}
      </div>
    </div>
  )
}

/** The diagram in the design's figure: a tinted panel with a white frame rising from its bottom edge. */
export function DiagramFigure({
  data,
  tint = 'teal',
  className,
}: {
  data?: DiagramData | null
  tint?: Tint
  className?: string
}) {
  if (!data?.inputs?.length) return null
  return (
    <figure className={cx('m-0 flex flex-col gap-[18px]', className)}>
      <div
        className={cx('flex justify-center overflow-hidden rounded-xl', tintClass[tint])}
        style={{ padding: 'clamp(24px, 4.4vw, 64px) clamp(24px, 4.4vw, 64px) 0' }}
      >
        <div className="w-full max-w-[1080px] flex items-center justify-center aspect-[16/7.2] p-5 sm:p-8 bg-white rounded-t-xl shadow-[0_24px_60px_-30px_rgba(17,19,24,0.35)]">
          <SystemDiagram data={data} />
        </div>
      </div>
      {data.caption ? (
        <figcaption className="max-w-[720px] text-[15px] text-muted">{data.caption}</figcaption>
      ) : null}
    </figure>
  )
}
