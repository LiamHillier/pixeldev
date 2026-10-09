import type { CollectionConfig } from 'payload'
import { closingField, ctaField, titledItems } from '@/fields/cta'
import { figureField } from '@/fields/figure'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'order', 'slug'],
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Listing',
          description: 'How this service appears on the home page and the services index.',
          fields: [
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              admin: { description: 'One or two sentences. Shown on the home page row.' },
            },
            {
              name: 'examples',
              type: 'text',
              admin: {
                description:
                  'A short line of concrete examples under the summary on the home page.',
              },
            },
            {
              name: 'indexIntro',
              type: 'textarea',
              admin: { description: 'Paragraph on the services index page.' },
            },
            {
              name: 'indexItems',
              type: 'array',
              label: 'Index bullet list',
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            { name: 'indexLinkLabel', type: 'text', defaultValue: 'About this service' },
          ],
        },
        {
          label: 'Page',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text', required: true },
                { name: 'intro', type: 'textarea', required: true },
                ctaField('primaryCta', 'Primary button'),
                ctaField('secondaryCta', 'Secondary link'),
              ],
            },
            figureField(),
            {
              name: 'painPoints',
              type: 'group',
              label: 'Sound familiar?',
              fields: [
                { name: 'heading', type: 'text', defaultValue: 'Sound familiar?' },
                titledItems('items'),
              ],
            },
            {
              name: 'offerings',
              type: 'group',
              label: 'What I build',
              fields: [
                { name: 'heading', type: 'text', defaultValue: 'What I build' },
                { name: 'intro', type: 'textarea' },
                titledItems('items'),
              ],
            },
            {
              name: 'approach',
              type: 'group',
              label: 'How I approach it',
              fields: [
                { name: 'heading', type: 'text', defaultValue: 'How I approach it' },
                titledItems('items'),
              ],
            },
            {
              name: 'plans',
              type: 'group',
              label: 'Plans (optional)',
              fields: [
                { name: 'heading', type: 'text' },
                { name: 'intro', type: 'textarea' },
                {
                  name: 'items',
                  type: 'array',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'price', type: 'text' },
                    { name: 'body', type: 'text' },
                    { name: 'href', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'relatedWork',
              type: 'relationship',
              relationTo: 'work',
              hasMany: true,
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'Questions I get asked',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
            closingField,
          ],
        },
        {
          label: 'SEO',
          fields: [seoField],
        },
      ],
    },
  ],
}
