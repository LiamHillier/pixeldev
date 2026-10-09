import type { CollectionConfig } from 'payload'
import { figureField } from '@/fields/figure'
import { slugField } from '@/fields/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Journal',
    defaultColumns: ['title', 'topic', 'publishedAt', '_status'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
  },
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'topic', type: 'relationship', relationTo: 'topics', admin: { position: 'sidebar' } },
    { name: 'readingMinutes', type: 'number', admin: { position: 'sidebar' } },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Pinned at the top of the journal.' },
    },
    { name: 'excerpt', type: 'textarea', required: true },
    figureField('cover', 'Cover'),
    { name: 'content', type: 'richText', required: true },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    { name: 'relatedService', type: 'relationship', relationTo: 'services' },
  ],
}
