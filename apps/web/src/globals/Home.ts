import type { GlobalConfig } from 'payload'
import { closingField, ctaField, labelValueItems, titledItems } from '@/fields/cta'
import { figureField } from '@/fields/figure'
import { seoField } from '@/fields/seo'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            description: 'Small label above the heading. A good place for what you do and where.',
          },
        },
        { name: 'heading', type: 'text', required: true },
        { name: 'intro', type: 'textarea', required: true },
        ctaField('primaryCta', 'Primary button'),
        ctaField('secondaryCta', 'Secondary link'),
        labelValueItems('facts', 'Facts list (right column)'),
      ],
    },
    figureField('figure', 'Lead figure'),
    {
      name: 'servicesSection',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'What I do' },
        {
          name: 'note',
          type: 'text',
          defaultValue: 'Most projects use two or three of these together',
        },
      ],
    },
    {
      name: 'workSection',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Selected work' },
        { name: 'linkLabel', type: 'text', defaultValue: 'All case studies' },
      ],
    },
    {
      name: 'process',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'How a project runs' },
        titledItems('steps'),
      ],
    },
    {
      name: 'about',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'linkLabel', type: 'text', defaultValue: 'More about how I work' },
        figureField('photo', 'Photo'),
      ],
    },
    {
      name: 'testimonial',
      type: 'group',
      fields: [
        { name: 'quote', type: 'textarea' },
        { name: 'attribution', type: 'text' },
      ],
    },
    closingField,
    seoField,
  ],
}
