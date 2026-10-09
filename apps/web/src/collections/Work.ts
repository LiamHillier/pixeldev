import type { CollectionConfig } from 'payload'
import { labelValueItems, statsField } from '@/fields/cta'
import { figureField } from '@/fields/figure'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

export const Work: CollectionConfig = {
  slug: 'work',
  labels: { singular: 'Project', plural: 'Work' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'kind', 'featured', 'order'],
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        { label: 'Product I run', value: 'product' },
        { label: 'Client project', value: 'client' },
        { label: 'Anonymised', value: 'anonymised' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show under Selected work on the home page.' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'category',
      type: 'text',
      admin: { description: 'Short label, e.g. Plugin, WooCommerce and Square.' },
    },
    { name: 'summary', type: 'textarea', required: true },
    {
      name: 'externalUrl',
      type: 'text',
      admin: { description: 'If set and there is no case study, cards link here.' },
    },
    figureField('image', 'Card image'),
    statsField(),
    {
      name: 'caseStudy',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Publish a case study page',
        },
        {
          type: 'collapsible',
          label: 'Case study content',
          admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) },
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'intro', type: 'textarea' },
            labelValueItems('meta', 'Meta row (client, industry, stack...)'),
            figureField('hero', 'Hero figure'),
            statsField('bigStats', 'Headline numbers'),
            {
              name: 'sections',
              type: 'array',
              label: 'Narrative sections',
              fields: [
                { name: 'heading', type: 'text', required: true },
                { name: 'body', type: 'richText' },
                {
                  name: 'steps',
                  type: 'array',
                  label: 'Numbered list (optional)',
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
                figureField('figure', 'Figure (optional)'),
              ],
            },
            {
              name: 'quote',
              type: 'group',
              fields: [
                { name: 'text', type: 'textarea' },
                { name: 'attribution', type: 'text' },
              ],
            },
            labelValueItems('atAGlance', 'At a glance'),
            {
              name: 'asideCta',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
                { name: 'ctaLabel', type: 'text', defaultValue: 'Start a project' },
              ],
            },
            {
              name: 'moreWork',
              type: 'relationship',
              relationTo: 'work',
              hasMany: true,
            },
          ],
        },
      ],
    },
    seoField,
  ],
}
