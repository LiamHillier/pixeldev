/**
 * Page copy for the Journal index and the shared article chrome, from the Inline design.
 *
 *   journalPageCopy  ->  payload.updateGlobal({ slug: 'journal-page', data: journalPageCopy })
 *
 * `seo` is left out so it keeps its current value. Posts are content and are not touched here.
 */
import type { JournalPage } from '@/payload-types'

export const journalPageCopy = {
  eyebrow: 'The Systems Brief',
  heading: 'Notes from building and running software {sync} *for small businesses.*',
  intro:
    'Practical, specific, occasionally opinionated. The things we end up explaining on calls, written down once.',
  index: {
    topicsLabel: 'Topics',
    featuredLabel: 'Featured',
    readLabel: 'Read the article',
    emptyLabel: 'Nothing here yet.',
  },
  article: {
    tocLabel: 'In this article',
    relatedServiceLabel: 'Related service',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    authorBio:
      'Founder of Pixeldev. Helps growing Australian businesses make AI, automation and software work together, and runs SquareSync for Woo, OnCloudWine and CloudPerch.',
    authorLinkLabel: 'More about Liam',
  },
  marquee: {
    label: 'Businesses and brands we’ve built for',
    items: [{ name: 'TakeShape Adventures' }, { name: 'Bowery' }, { name: 'Test Drive' }],
  },
} satisfies Partial<JournalPage>
