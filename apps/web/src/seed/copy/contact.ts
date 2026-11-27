/**
 * Contact page copy, from the Inline design and its copy doc, rewritten in the "we" voice.
 *
 *   contactPageCopy  ->  payload.updateGlobal({ slug: 'contact-page', data: contactPageCopy })
 *
 * The `form` group is left out on purpose: the form keeps its current button label and messages
 * (its questions are in src/app/(frontend)/contact/form-config.ts). The seo group is left out too.
 * The booking card stays hidden until `options.booking.bookingUrl` is set, the call card until
 * Site settings has `business.phone`, and the message card until one of those two shows.
 */
import type { ContactPage } from '@/payload-types'

export const contactPageCopy = {
  eyebrow: 'Contact',
  heading: '*Let’s talk about* {live} your business.',
  intro:
    'You don’t need to know what you need. Tell us what’s slow, manual or frustrating, in your own words, and we’ll come back with what we’d do about it.',
  options: {
    booking: {
      title: 'Book a 30-minute call',
      body: 'Pick a time that suits you.',
    },
    call: {
      title: 'Call',
      body: 'Weekdays, Melbourne time. If we’re heads-down we’ll call you back.',
    },
    message: {
      title: 'Send a message below',
      body: 'A personal reply from us within one business day. No newsletter, no sequence.',
    },
  },
  nextSteps: {
    heading: 'What happens next',
    items: [
      { text: 'We read it and reply within one business day, usually with a couple of questions.' },
      {
        text: 'A thirty-minute call where you walk us through how your business works today. No slides.',
      },
      { text: 'A short written plan and quote, or an honest “you don’t need us for this”.' },
    ],
  },
  aside: {
    directHeading: 'Direct',
    directNote: 'Melbourne, VIC. Working with businesses across Australia, in your time zone.',
    supportHeading: 'Already a client or a SquareSync customer?',
    supportNote: 'Support goes to {email} so it lands in the right queue.',
  },
} satisfies Partial<ContactPage>
