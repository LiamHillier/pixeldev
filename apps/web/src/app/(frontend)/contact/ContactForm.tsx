'use client'

import { useActionState } from 'react'
import { submitEnquiry, type EnquiryState } from './actions'

type Props = {
  needOptions: string[]
  budgetOptions: string[]
  submitLabel: string
  submitNote?: string | null
  successHeading: string
  successBody?: string | null
}

const initial: EnquiryState = { status: 'idle' }

export function ContactForm({ needOptions, budgetOptions, submitLabel, submitNote, successHeading, successBody }: Props) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)

  if (state.status === 'sent') {
    return (
      <div className="flex flex-col gap-4 pt-12 max-w-[560px]" role="status">
        <h2 className="h-section">{successHeading}</h2>
        {successBody ? <p className="text-[18px] text-body">{successBody}</p> : null}
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-8 max-w-[720px] pt-12">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-8">
        <Field id="name" label="Your name" autoComplete="name" required />
        <Field id="email" label="Email" type="email" autoComplete="email" required />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-8">
        <Field id="business" label="Business" autoComplete="organization" />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="need" className="text-[14px] text-faint">
            What do you need help with?
          </label>
          <select id="need" name="need" className="field-line">
            {needOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>
      <Field id="systems" label="Which systems are involved? (optional)" placeholder="e.g. WooCommerce, Xero, HubSpot, a spreadsheet" />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="problem" className="text-[14px] text-faint">
          What&rsquo;s slow, manual or broken?
        </label>
        <textarea
          id="problem"
          name="problem"
          rows={5}
          required
          placeholder="Plain words are best. What happens today, who does it, and what you wish happened instead."
          className="field-line min-h-0 py-2.5 leading-[1.5] resize-y"
        />
      </div>
      {budgetOptions.length ? (
        <div className="flex flex-col gap-1.5 max-w-[340px]">
          <label htmlFor="budget" className="text-[14px] text-faint">
            Rough budget (optional, helps me scope)
          </label>
          <select id="budget" name="budget" className="field-line">
            {budgetOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-2">
        <button type="submit" disabled={pending} className="btn-ink border-0 rounded-none cursor-pointer disabled:opacity-60">
          {pending ? 'Sending…' : submitLabel}
        </button>
        {submitNote ? <p className="text-[15px] text-faint">{submitNote}</p> : null}
      </div>
      {state.status === 'error' ? (
        <p role="alert" className="text-[15px] text-[#8A2E1F]">
          {state.message}
        </p>
      ) : null}
    </form>
  )
}

function Field({
  id,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  required,
}: {
  id: string
  label: string
  type?: string
  autoComplete?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[14px] text-faint">
        {label}
      </label>
      <input id={id} name={id} type={type} autoComplete={autoComplete} placeholder={placeholder} required={required} className="field-line" />
    </div>
  )
}
