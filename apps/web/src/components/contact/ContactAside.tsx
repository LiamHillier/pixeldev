import { Fragment } from 'react'
import { cx } from '@/lib/utils'

const linkCls = 'u inline-flex items-center self-start min-h-[44px] text-[16px]'

/** "What happens next" steps, direct contact details and the support note beside the form. */
export function ContactAside({
  stepsHeading,
  steps,
  directHeading,
  email,
  phone,
  linkedin,
  directNote,
  supportHeading,
  supportNote,
  supportEmail,
}: {
  stepsHeading?: string | null
  steps: string[]
  directHeading?: string | null
  email?: string | null
  phone?: string | null
  linkedin?: string | null
  directNote?: string | null
  supportHeading?: string | null
  supportNote?: string | null
  supportEmail?: string | null
}) {
  const showDirect = Boolean(email || phone || linkedin || directNote)
  const showSupport = Boolean(supportHeading && supportEmail)

  return (
    <aside className="rv flex-[1_1_300px] min-w-0 flex flex-col gap-12">
      {steps.length ? (
        <div className="flex flex-col">
          {stepsHeading ? <p className="pb-4 text-[15px] text-muted">{stepsHeading}</p> : null}
          {steps.map((text, i) => (
            <div
              key={i}
              className={cx(
                'flex gap-5 py-[18px] border-t',
                i === 0 ? 'wipe border-ink' : 'border-rule',
                i === steps.length - 1 && 'border-b border-b-rule',
              )}
            >
              <span
                className={cx(
                  'shrink-0 w-6 font-display font-medium text-[24px] leading-[1.1]',
                  i === steps.length - 1 ? 'text-ink' : 'text-grey',
                )}
              >
                {i + 1}
              </span>
              <p className="text-[16px]">{text}</p>
            </div>
          ))}
        </div>
      ) : null}

      {showDirect ? (
        <div className="flex flex-col gap-1 text-[16px]">
          {directHeading ? <p className="pb-2 text-[15px] text-muted">{directHeading}</p> : null}
          {email ? (
            <a href={`mailto:${email}`} className={linkCls}>
              {email}
            </a>
          ) : null}
          {phone ? (
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className={linkCls}>
              {phone}
            </a>
          ) : null}
          {linkedin ? (
            <a href={linkedin} rel="noopener" className={linkCls}>
              LinkedIn
            </a>
          ) : null}
          {directNote ? <p className="pt-2 text-muted">{directNote}</p> : null}
        </div>
      ) : null}

      {showSupport && supportEmail ? (
        <div className="flex flex-col gap-2 p-6 rounded-xl bg-fill text-[16px]">
          <p className="font-medium">{supportHeading}</p>
          <p className="text-muted">
            <SupportNote note={supportNote} email={supportEmail} />
          </p>
        </div>
      ) : null}
    </aside>
  )
}

/** Places the email link where the note says {email}, or after the note when it has no token. */
function SupportNote({ note, email }: { note?: string | null; email: string }) {
  const link = (
    <a href={`mailto:${email}`} className="u text-ink">
      {email}
    </a>
  )
  if (!note) return link
  if (!note.includes('{email}')) {
    return (
      <>
        {note} {link}
      </>
    )
  }
  return (
    <>
      {note.split('{email}').map((part, i) => (
        <Fragment key={i}>
          {i > 0 ? link : null}
          {part}
        </Fragment>
      ))}
    </>
  )
}
