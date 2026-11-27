'use server'

import { getPayloadClient } from '@/lib/payload'
import { fieldError, formPaths, otherName, type FormField } from './form-config'

export type EnquiryState = { status: 'idle' } | { status: 'sent' } | { status: 'error'; message: string }

const MAX = { short: 200, long: 5000 }

function text(form: FormData, key: string, max = MAX.short): string {
  const v = form.get(key)
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

/** What was entered for a field, as one string. Choice values outside the field's options are dropped. */
function answer(form: FormData, field: FormField): string {
  if (field.kind === 'textarea') return text(form, field.name, MAX.long)
  if (field.kind === 'text') return text(form, field.name)
  const picked = form.getAll(field.name).filter((v): v is string => typeof v === 'string')
  const valid = field.options.filter((o) => picked.includes(o))
  const chosen = field.multiple ? valid : valid.slice(0, 1)
  const other = field.other ? text(form, otherName(field)) : ''
  return [...chosen, ...(other ? [other] : [])].join(', ')
}

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: real users never fill this.
  if (text(form, 'website')) return { status: 'sent' }

  const path = formPaths.find((p) => p.id === text(form, 'intent'))
  if (!path) return { status: 'error', message: 'Pick what you’re after first.' }

  const stored: Record<string, string> = {}
  const answers: { question: string; answer: string }[] = []
  for (const field of path.steps.flatMap((s) => s.fields)) {
    const value = answer(form, field)
    const error = fieldError(field, value)
    if (error) return { status: 'error', message: error }
    if (!value) continue
    if (field.store) stored[field.store] = value
    else answers.push({ question: field.label.replace(/ \(optional\)$/, ''), answer: value })
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'enquiries',
      data: {
        name: stored.name,
        email: stored.email,
        business: stored.business || undefined,
        phone: stored.phone || undefined,
        need: path.label,
        systems: stored.systems || undefined,
        problem: stored.problem,
        answers,
      },
    })
    return { status: 'sent' }
  } catch (err) {
    console.error('enquiry failed', err)
    return { status: 'error', message: 'Something went wrong sending that. Email us directly instead.' }
  }
}
