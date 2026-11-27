import type { GlobalConfig } from 'payload'
import { pageHeader } from '@/fields/cta'
import { seoField } from '@/fields/seo'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    ...pageHeader,
    {
      name: 'options',
      type: 'group',
      label: 'Option cards',
      admin: {
        description:
          'The tinted cards under the heading. The booking card shows only when a booking link is set, the call card only when Site settings has a phone number, and the message card only next to one of those.',
      },
      fields: [
        {
          name: 'booking',
          type: 'group',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Book a 30-minute call' },
            { name: 'body', type: 'text' },
            {
              name: 'bookingUrl',
              type: 'text',
              label: 'Booking link',
              admin: { description: 'Full URL of the booking page. Leave blank to hide the card.' },
            },
          ],
        },
        {
          name: 'call',
          type: 'group',
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Call',
              admin: { description: 'Shown before the phone number from Site settings.' },
            },
            { name: 'body', type: 'text' },
          ],
        },
        {
          name: 'message',
          type: 'group',
          fields: [
            { name: 'title', type: 'text', defaultValue: 'Send a message below' },
            { name: 'body', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'form',
      type: 'group',
      admin: {
        description:
          'The questions themselves live in the code (src/app/(frontend)/contact/form-config.ts).',
      },
      fields: [
        { name: 'submitLabel', type: 'text', defaultValue: 'Send it' },
        { name: 'submitNote', type: 'text' },
        { name: 'successHeading', type: 'text', defaultValue: 'Got it.' },
        { name: 'successBody', type: 'textarea' },
      ],
    },
    {
      name: 'nextSteps',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'What happens next' },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'aside',
      type: 'group',
      fields: [
        { name: 'directHeading', type: 'text', defaultValue: 'Direct' },
        { name: 'directNote', type: 'text' },
        { name: 'supportHeading', type: 'text' },
        {
          name: 'supportNote',
          type: 'text',
          admin: {
            description:
              'Write {email} where the support address goes (Site settings support email, else the main email). Leave the heading blank to hide the note.',
          },
        },
      ],
    },
    seoField,
  ],
}
