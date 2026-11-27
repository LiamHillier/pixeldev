import { Eyebrow } from '@/components/ui'
import { cx } from '@/lib/utils'

/** The row of direct-client names under the numbers band, alternating ink and grey. */
export function ClientNames({ label, names }: { label?: string | null; names: string[] }) {
  if (!names.length) return null
  return (
    <section className="flex flex-col gap-6 pt-14">
      {label ? <Eyebrow className="rv">{label}</Eyebrow> : null}
      <ul
        className="rv flex flex-wrap gap-x-10 gap-y-2 font-display font-medium leading-[1.2] tracking-[-0.035em]"
        style={{ fontSize: 'clamp(24px, 2.5vw, 36px)' }}
      >
        {names.map((name, i) => (
          <li key={name} className={cx(i % 2 === 1 && 'text-grey')}>
            {name}
          </li>
        ))}
      </ul>
    </section>
  )
}
