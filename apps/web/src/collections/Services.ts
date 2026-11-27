import type { CollectionConfig } from 'payload'
import { closingField, ctaField, titledItems } from '@/fields/cta'
import { figureField } from '@/fields/figure'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

const markup =
  'Two tones: wrap the grey part in *stars*. ~Tildes~ ink in on scroll. {toggle}, {sync}, {live} or {img} add a pill glyph.'

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
              admin: { description: 'Paragraph beside the title on the services index page.' },
            },
            {
              name: 'indexItems',
              type: 'array',
              label: 'Index bullet list',
              admin: { description: 'The short ruled list on the right of the services index row.' },
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
                {
                  name: 'heading',
                  type: 'text',
                  required: true,
                  admin: {
                    description: `${markup} Example: "Hosting from someone {live} *who knows the code.*"`,
                  },
                },
                { name: 'intro', type: 'textarea', required: true },
                ctaField('primaryCta', 'Primary button'),
                ctaField('secondaryCta', 'Secondary link'),
              ],
            },
            {
              name: 'diagram',
              type: 'group',
              label: 'System diagram (optional)',
              admin: {
                description:
                  'A small animated diagram under the hero: inputs on the left, a dark box in the middle, results on the right. When it has inputs it replaces the figure below.',
              },
              fields: [
                {
                  name: 'inputs',
                  type: 'array',
                  admin: { description: 'Left column. Their lights pulse in turn.' },
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
                { name: 'hubTitle', type: 'text', label: 'Middle box title' },
                { name: 'hubNote', type: 'text', label: 'Middle box note' },
                {
                  name: 'outputs',
                  type: 'array',
                  admin: { description: 'Right column.' },
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    {
                      name: 'waiting',
                      type: 'checkbox',
                      label: 'Waiting for a person (dashed, amber light)',
                    },
                  ],
                },
                { name: 'caption', type: 'text' },
              ],
            },
            figureField(),
            {
              name: 'painPoints',
              type: 'group',
              label: 'Sound familiar?',
              admin: { description: 'The grey band of short statements.' },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Sound familiar?',
                  admin: { description: markup },
                },
                titledItems('items'),
              ],
            },
            {
              name: 'offerings',
              type: 'group',
              label: 'What we build',
              admin: { description: 'Heading and intro on the left, a numbered ruled list on the right.' },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'What we *build*',
                  admin: { description: markup },
                },
                { name: 'intro', type: 'textarea' },
                titledItems('items'),
              ],
            },
            {
              name: 'approach',
              type: 'group',
              label: 'How we approach it',
              admin: { description: 'Three steps under large outlined numerals.' },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'How we *approach it*',
                  admin: { description: markup },
                },
                titledItems('items'),
              ],
            },
            {
              name: 'plans',
              type: 'group',
              label: 'Plans (optional)',
              admin: { description: 'Grey plan cards, e.g. the CloudPerch plans on Hosting.' },
              fields: [
                { name: 'heading', type: 'text', admin: { description: markup } },
                { name: 'intro', type: 'textarea' },
                {
                  name: 'items',
                  type: 'array',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'price', type: 'text', admin: { description: 'Leave blank to hide.' } },
                    { name: 'body', type: 'text', admin: { description: 'Who it is for.' } },
                    { name: 'href', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'relatedHeading',
              type: 'text',
              label: 'Related work heading',
              defaultValue: 'Related *work*',
              admin: { description: markup },
            },
            {
              name: 'relatedWork',
              type: 'relationship',
              relationTo: 'work',
              hasMany: true,
            },
            {
              name: 'faqsHeading',
              type: 'text',
              label: 'Questions heading',
              defaultValue: 'Questions *we get asked*',
              admin: { description: markup },
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'Questions we get asked',
              admin: {
                description:
                  'The "Do you only work with Melbourne businesses?" question is added automatically after these.',
              },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
            {
              ...closingField,
              admin: {
                description: `Dark closing panel. Heading: ${markup} Usual form: "~Lead~ *grey tail*".`,
              },
            } as typeof closingField,
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
