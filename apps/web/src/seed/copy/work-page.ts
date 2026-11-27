/**
 * Page copy for the Work index and the shared case-study chrome, from the Inline design.
 *
 *   workPageCopy  ->  payload.updateGlobal({ slug: 'work-page', data: workPageCopy })
 *
 * Upload fields and `seo` are left out so they keep their current values.
 * Projects themselves (the Work collection) are content and are not touched here.
 */
import type { WorkPage } from '@/payload-types'

export const workPageCopy = {
  eyebrow: 'Work',
  heading: 'Things we’ve shipped, {live} *and the ones we still look after.*',
  intro:
    'Every one of these started with someone describing something slow, manual or fragile in their business. Two kinds below: products we own and support ourselves, and client projects we can name.',
  products: {
    heading: 'Products we *own and run*',
    intro:
      'Real software with paying customers. We build it, host it, and answer the support emails. It’s the best proof we have that we ship things that keep working.',
    navLabel: 'Products we run',
  },
  clients: {
    heading: 'Client *projects*',
    intro:
      'Named with the client’s permission. Each one is a business that had a process running on spreadsheets, email and goodwill, and needed software that fit how they already worked.',
    note: null,
    navLabel: 'Client projects',
  },
  anonymised: {
    heading: 'Anonymised',
    intro:
      'Some clients would rather their competitors didn’t know what they’ve automated. Fair enough. The numbers are theirs; the names aren’t.',
    navLabel: 'Anonymised',
  },
  labels: {
    readCaseStudy: 'Read the case study',
    comingSoon: 'Case study coming soon',
  },
  closing: {
    heading: '~Want yours~ *on this page?*',
    body: 'Tell us what’s slow or manual in your business. We’ll come back within one business day with what we’d build.',
    ctaLabel: 'Talk about your business',
  },
  caseStudy: {
    atAGlanceLabel: 'At a glance',
    moreHeading: 'More *work*',
    moreLinkLabel: 'All case studies',
  },
  marquee: {
    label: 'Businesses and brands we’ve built for',
    items: [{ name: 'TakeShape Adventures' }, { name: 'Bowery' }, { name: 'KIR' }],
  },
} satisfies Partial<WorkPage>
