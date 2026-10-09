'use server'

import { getPayloadClient } from '@/lib/payload'

export type EnquiryState = { status: 'idle' } | { status: 'sent' } | { status: 'error'; message: string }

const MAX = { short: 200, long: 5000 }

function text(form: FormData, key: string, max = MAX.short): string {
  const v = form.get(key)
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: real users never fill this.
  if (text(form, 'website')) return { status: 'sent' }

  const name = text(form, 'name')
  const email = text(form, 'email')
  const problem = text(form, 'problem', MAX.long)

  if (!name || !email || !problem) {
    return { status: 'error', message: 'Name, email and a few words about the problem are needed.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'That email address does not look right.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'enquiries',
      data: {
        name,
        email,
        business: text(form, 'business') || undefined,
        need: text(form, 'need') || undefined,
        systems: text(form, 'systems') || undefined,
        problem,
        budget: text(form, 'budget') || undefined,
      },
    })
    return { status: 'sent' }
  } catch (err) {
    console.error('enquiry failed', err)
    return { status: 'error', message: 'Something went wrong sending that. Email me directly instead.' }
  }
}
