import type { Field, GlobalConfig } from 'payload'
import { pageHeader } from '@/fields/cta'
import { seoField } from '@/fields/seo'

const MARKUP_HELP =
  'Two tones: wrap the grey part in *stars*. ~Tildes~ ink in on scroll. {toggle}, {sync}, {live} or {img} add a pill glyph.'

const group = (name: string, label: string, heading: string, navLabel: string, extra: Field[] = []): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'heading', type: 'text', defaultValue: heading, admin: { description: MARKUP_HELP } },
    { name: 'intro', type: 'textarea' },
    ...extra,
    {
      name: 'navLabel',
      type: 'text',
      defaultValue: navLabel,
      admin: { description: 'Jump link under the page intro.' },
    },
  ],
})

/** Client names in the scrolling strip. Shared shape with the journal page. */
export const marqueeField: Field = {
  name: 'marquee',
  label: 'Client name strip',
  type: 'group',
  fields: [
    {
      name: 'label',
      type: 'text',
      defaultValue: 'Businesses and brands we’ve built for',
      admin: { description: 'Read out by screen readers for the strip.' },
    },
    {
      name: 'items',
      type: 'array',
      admin: { description: 'Only name direct clients and our own products.' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
  ],
}

export const WorkPage: GlobalConfig = {
  slug: 'work-page',
  label: 'Work page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    ...pageHeader,
    group('products', 'Products section', 'Products we *own and run*', 'Products we run'),
    group('clients', 'Client projects section', 'Client *projects*', 'Client projects', [
      { name: 'note', type: 'text', admin: { description: 'Small print under the intro.' } },
    ]),
    group('anonymised', 'Anonymised section', 'Anonymised', 'Anonymised'),
    {
      name: 'labels',
      type: 'group',
      label: 'Card labels',
      fields: [
        { name: 'readCaseStudy', type: 'text', defaultValue: 'Read the case study' },
        { name: 'comingSoon', type: 'text', defaultValue: 'Case study coming soon' },
      ],
    },
    {
      name: 'closing',
      label: 'Closing call to action',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', admin: { description: MARKUP_HELP } },
        { name: 'body', type: 'textarea' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Talk about your business' },
      ],
    },
    {
      name: 'caseStudy',
      label: 'Case study pages',
      type: 'group',
      admin: { description: 'Shared labels on every case study page.' },
      fields: [
        { name: 'atAGlanceLabel', type: 'text', defaultValue: 'At a glance' },
        {
          name: 'moreHeading',
          type: 'text',
          defaultValue: 'More *work*',
          admin: { description: MARKUP_HELP },
        },
        { name: 'moreLinkLabel', type: 'text', defaultValue: 'All case studies' },
      ],
    },
    marqueeField,
    seoField,
  ],
}
