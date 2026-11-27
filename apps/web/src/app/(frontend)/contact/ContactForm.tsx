'use client'

import Link from 'next/link'
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

const labelCls = 'text-[15px] text-body'

export function ContactForm({
  needOptions,
  budgetOptions,
  submitLabel,
  submitNote,
  successHeading,
  successBody,
}: Props) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)

  if (state.status === 'sent') {
    return (
      <div className="flex flex-col gap-5 p-8 lg:p-12 rounded-xl bg-tint-teal" role="status">
        <h2 className="h-section">{successHeading}</h2>
        {successBody ? <p className="text-[18px] text-body">{successBody}</p> : null}
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-7">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-6 gap-y-7">
        <Field id="name" label="Your name" autoComplete="name" required />
        <Field id="email" label="Email" type="email" autoComplete="email" required />
        <Field id="business" label="Business" autoComplete="organization" />
        <div className="flex flex-col gap-2">
          <label htmlFor="need" className={labelCls}>
            What do you need help with?
          </label>
          <select id="need" name="need" className="field px-3">
            {needOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="problem" className={labelCls}>
          What&rsquo;s slow, manual or broken?
        </label>
        <textarea
          id="problem"
          name="problem"
          rows={6}
          required
          placeholder="Plain words are best. What happens today, who does it, and what you wish happened instead."
          className="field min-h-0 py-3.5 leading-[1.5] resize-y"
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-6 gap-y-7">
        <Field
          id="systems"
          label="Which systems are involved? (optional)"
          placeholder="e.g. WooCommerce, Xero, HubSpot, a spreadsheet"
        />
        {budgetOptions.length ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="budget" className={labelCls}>
              Rough budget (optional, helps me scope)
            </label>
            <select id="budget" name="budget" className="field px-3">
              {budgetOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-ink border-0 cursor-pointer disabled:opacity-60"
        >
          {pending ? 'Sending…' : submitLabel}
        </button>
        <p className="flex-[1_1_260px] text-[15px] text-muted">
          {submitNote ? `${submitNote} ` : null}
          How I handle your details:{' '}
          <Link href="/privacy" className="link-u text-ink">
            privacy policy
          </Link>
          .
        </p>
      </div>
      {state.status === 'error' ? (
        <p role="alert" className="text-[15px] text-[#A12C1C]">
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
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className="field"
      />
    </div>
  )
}
