import type { CollectionAfterChangeHook } from 'payload'
import type { Enquiry } from '@/payload-types'

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
  )

/**
 * Emails each new enquiry to ENQUIRY_NOTIFY_TO (or the site email), with Reply-To set to the sender
 * so replying from your inbox goes straight to them. A failed send is logged, never shown to the visitor:
 * the enquiry is already saved in the admin.
 */
export const notifyEnquiry: CollectionAfterChangeHook<Enquiry> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc
  const { payload } = req
  try {
    const site = await payload.findGlobal({ slug: 'site', req })
    const to = process.env.ENQUIRY_NOTIFY_TO || site.email
    if (!to) {
      payload.logger.warn('Enquiry email skipped: set ENQUIRY_NOTIFY_TO or the site email')
      return doc
    }

    const rows: [string, string | null | undefined][] = [
      ['Name', doc.name],
      ['Email', doc.email],
      ['Business', doc.business],
      ['Needs help with', doc.need],
      ['Current systems', doc.systems],
      ['Budget', doc.budget],
    ]
    const filled = rows.filter((r): r is [string, string] => Boolean(r[1]))
    const adminUrl = `${
      process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    }/admin/collections/enquiries/${doc.id}`
    const subject = `New enquiry: ${doc.name}${doc.business ? `, ${doc.business}` : ''}`

    await payload.sendEmail({
      to,
      replyTo: { name: doc.name, address: doc.email },
      subject,
      text: [
        ...filled.map(([k, v]) => `${k}: ${v}`),
        '',
        doc.problem,
        '',
        `Open in admin: ${adminUrl}`,
      ].join('\n'),
      html: `<table cellpadding="4" style="font:15px/1.5 -apple-system,Segoe UI,sans-serif;color:#1b1a17">${filled
        .map(
          ([k, v]) =>
            `<tr><td style="color:#7a7468;padding-right:16px">${k}</td><td>${escape(v)}</td></tr>`,
        )
        .join('')}</table>
<p style="font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1b1a17;white-space:pre-wrap;border-left:3px solid #2f5d50;padding-left:12px">${escape(
        doc.problem,
      )}</p>
<p style="font:14px -apple-system,Segoe UI,sans-serif"><a href="${adminUrl}" style="color:#2f5d50">Open in admin</a></p>`,
    })
  } catch (err) {
    payload.logger.error({ err, msg: `Enquiry ${doc.id} saved but the notification email failed` })
  }
  return doc
}
