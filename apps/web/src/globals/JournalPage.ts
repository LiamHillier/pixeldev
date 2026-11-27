import type { GlobalConfig } from 'payload'
import { pageHeader } from '@/fields/cta'
import { seoField } from '@/fields/seo'
import { marqueeField } from './WorkPage'

export const JournalPage: GlobalConfig = {
  slug: 'journal-page',
  label: 'Journal page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    ...pageHeader,
    {
      name: 'index',
      label: 'Journal index labels',
      type: 'group',
      fields: [
        { name: 'topicsLabel', type: 'text', defaultValue: 'Topics' },
        { name: 'featuredLabel', type: 'text', defaultValue: 'Featured' },
        { name: 'readLabel', type: 'text', defaultValue: 'Read the article' },
        { name: 'emptyLabel', type: 'text', defaultValue: 'Nothing here yet.' },
      ],
    },
    {
      name: 'article',
      label: 'Article pages',
      type: 'group',
      admin: { description: 'Shared labels and the author box on every article.' },
      fields: [
        { name: 'tocLabel', type: 'text', defaultValue: 'In this article' },
        { name: 'relatedServiceLabel', type: 'text', defaultValue: 'Related service' },
        { name: 'previousLabel', type: 'text', defaultValue: 'Previous' },
        { name: 'nextLabel', type: 'text', defaultValue: 'Next' },
        {
          name: 'authorBio',
          type: 'textarea',
          admin: {
            description:
              'Third person, about the founder. The name above it comes from Site settings (owner name), the photo from the About page.',
          },
        },
        { name: 'authorLinkLabel', type: 'text', defaultValue: 'More about Liam' },
      ],
    },
    marqueeField,
    seoField,
  ],
}
