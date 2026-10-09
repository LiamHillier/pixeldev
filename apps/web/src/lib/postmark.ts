import type { PayloadEmailAdapter as EmailAdapter, SendEmailOptions } from 'payload'

type Recipient = SendEmailOptions['to']

/** Nodemailer-style addresses (string, { name, address }, or arrays of either) to Postmark's comma list. */
function addresses(value: Recipient): string | undefined {
  if (!value) return undefined
  const list = Array.isArray(value) ? value : [value]
  const out = list
    .map((v) => {
      if (typeof v === 'string') return v
      return v.name ? `"${v.name.replace(/"/g, '')}" <${v.address}>` : v.address
    })
    .filter(Boolean)
  return out.length ? out.join(', ') : undefined
}

function body(value: SendEmailOptions['html']): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') return value
  if (Buffer.isBuffer(value)) return value.toString('utf8')
  throw new Error('Postmark adapter only supports string or Buffer email bodies')
}

type PostmarkOptions = {
  serverToken: string
  defaultFromAddress: string
  defaultFromName: string
  /** Postmark message stream. "outbound" is the default transactional stream. */
  messageStream?: string
}

/** Payload email adapter that sends through Postmark's HTTP API. */
export const postmarkAdapter =
  ({
    serverToken,
    defaultFromAddress,
    defaultFromName,
    messageStream = 'outbound',
  }: PostmarkOptions): EmailAdapter =>
  () => ({
    name: 'postmark',
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      const from = addresses(message.from ?? { name: defaultFromName, address: defaultFromAddress })
      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': serverToken,
        },
        body: JSON.stringify({
          From: from,
          To: addresses(message.to),
          Cc: addresses(message.cc),
          Bcc: addresses(message.bcc),
          ReplyTo: addresses(message.replyTo),
          Subject: message.subject,
          HtmlBody: body(message.html),
          TextBody: body(message.text),
          MessageStream: messageStream,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ErrorCode?: number; Message?: string }
      if (!res.ok || data.ErrorCode) {
        throw new Error(
          `Postmark ${res.status} (code ${data.ErrorCode ?? 'n/a'}): ${
            data.Message ?? 'send failed'
          }`,
        )
      }
      return data
    },
  })
