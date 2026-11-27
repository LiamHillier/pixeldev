/**
 * About page copy, from the Inline design and its copy doc, rewritten in the "we" voice.
 *
 *   aboutPageCopy  ->  payload.updateGlobal({ slug: 'about-page', data: aboutPageCopy })
 *
 * The photo upload and the seo group are left out so they keep their current values.
 * Client names are not here: the page reads them from Work entries of kind "client".
 */
import type { AboutPage } from '@/payload-types'

export const aboutPageCopy = {
  eyebrow: 'About',
  heading: 'Meet Liam, *our founder.*',
  intro:
    'When you work with Pixeldev, you’re talking directly to the person who understands your business, designs the solution and is accountable for delivering it. No salespeople, no account managers, no handovers to a developer you’ve never met.',
  body: 'Liam Hillier spent ten years as a senior developer in agencies, building applications, CRMs and internal tools for businesses of every size, before setting up Pixeldev to do that work for growing businesses directly.',
  stats: [
    { value: '10 years', label: 'as a senior developer, in agencies and now directly' },
    { value: 'Hundreds', label: 'of applications, CRMs and internal tools delivered' },
    { value: 'Thousands', label: 'of websites shipped and kept running' },
    { value: '3', label: 'software products of our own, with paying customers' },
  ],
  clients: { label: 'Businesses we’ve built for' },
  background: {
    heading: 'What shaped *how we work*',
    items: [
      {
        title: 'Ten years of agency work',
        body: 'Hundreds of applications and thousands of websites for clients from local businesses to national brands. It taught us what makes a project go well, and what makes a client dread the next invoice. Pixeldev is built to avoid the second one.',
      },
      {
        title: 'Years inside WordPress and WooCommerce',
        body: 'Custom blocks, checkout extensions, plugin work, multisite networks, catalogue imports. We know where the bodies are buried, because we’ve dug a few of them up.',
      },
      {
        title: 'Running our own products',
        body: 'SquareSync for Woo has paying subscribers around the world, and we answer every support email ourselves. Nothing teaches you to build carefully like being the one who gets the 6am “it’s broken” message.',
      },
      {
        title: 'Running our own servers',
        body: 'Dedicated servers, Docker, Cloudflare, DNS for hundreds of domains. We host what we build, so we design it to be hosted well.',
      },
    ],
  },
  promises: {
    heading: 'A few things *you can count on*',
    items: [
      {
        title: 'Plain language',
        body: 'We’ll explain what we’re building and why in words you’d use, not jargon. If we can’t explain it simply, we don’t understand it well enough yet.',
      },
      {
        title: 'A written plan before a dollar changes hands',
        body: 'What’s being built, what it costs, what it will change, what’s out of this phase. You’ll know before we start.',
      },
      {
        title: 'Honest about fit',
        body: 'If an off-the-shelf tool will do the job, we’ll say so. If we’re not the right people, we’ll say that too.',
      },
      {
        title: 'Around after launch',
        body: 'We host, monitor and keep improving what we build. The relationship doesn’t end at the invoice.',
      },
    ],
  },
  solo: {
    heading: 'Small *by design*',
    body: 'We deliberately work with a small number of businesses at a time, so each one gets our full attention and you’re always talking to the people doing the work. For bigger builds we bring in specialists we’ve worked with before, and we stay accountable for the result.',
  },
  closing: {
    heading: '~Let’s talk~ {toggle} *about your business.*',
    body: 'A thirty-minute conversation, no pitch. You describe what’s slow or frustrating, we tell you what we’d do about it. We reply within one business day.',
    ctaLabel: 'Talk about your business',
  },
} satisfies Partial<AboutPage>
