import type { Field, GlobalConfig } from 'payload'
import { ctaField, statsField, titledItems } from '@/fields/cta'
import { figureField } from '@/fields/figure'
import { seoField } from '@/fields/seo'

const MARKUP_HELP =
  'Two tones: wrap the grey part in *stars*. ~Tildes~ ink in on scroll. {toggle}, {sync}, {live} or {img} add a pill glyph.'

const heading = (defaultValue?: string, required = false): Field => ({
  name: 'heading',
  type: 'text',
  required,
  defaultValue,
  admin: { description: MARKUP_HELP },
})

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
          admin: { description: 'Optional small label above the heading.' },
        },
        heading(undefined, true),
        { name: 'intro', type: 'textarea', required: true },
        ctaField('primaryCta', 'Primary button'),
        ctaField('secondaryCta', 'Secondary link'),
      ],
    },
    figureField('figure', 'Lead figure (browser frame)'),
    {
      name: 'figureWork',
      label: 'Lead figure: use a project screenshot',
      type: 'relationship',
      relationTo: 'work',
      admin: {
        description:
          "If set, the browser frame shows this project's case study hero image instead of the image above. The caption above still applies.",
      },
    },
    {
      name: 'marquee',
      label: 'Client name strip',
      type: 'group',
      admin: {
        description:
          'The names come from Work: every project whose kind is "Client project", in Work order.',
      },
      fields: [
        {
          name: 'intro',
          type: 'text',
          admin: {
            description: 'Second caption line beside the lead figure, introducing the strip.',
          },
        },
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Businesses we’ve built for',
          admin: { description: 'Read out by screen readers for the strip.' },
        },
      ],
    },
    {
      name: 'familiar',
      label: '"Sound familiar?" band',
      type: 'group',
      fields: [
        heading('Sound familiar?'),
        {
          name: 'statements',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        {
          name: 'closing',
          type: 'textarea',
          admin: { description: `Closing line under the statements. ${MARKUP_HELP}` },
        },
      ],
    },
    {
      name: 'approach',
      label: 'How it works (numbered)',
      type: 'group',
      fields: [
        heading(),
        { name: 'intro', type: 'textarea' },
        titledItems('steps'),
        {
          name: 'toolsLead',
          type: 'text',
          defaultValue: 'The tools behind it:',
          admin: { description: 'Lead-in for the sentence that links every service page.' },
        },
      ],
    },
    statsField('stats', 'Stat band (the last number is teal)'),
    {
      name: 'workSection',
      label: 'Case studies',
      type: 'group',
      fields: [
        heading('Work that changed *how a business runs*'),
        { name: 'linkLabel', type: 'text', defaultValue: 'All case studies' },
        {
          name: 'cases',
          type: 'array',
          admin: {
            description:
              'Each row shows the project’s card image and links to its case study. Leave "What changed" empty to hide it.',
          },
          fields: [
            { name: 'work', type: 'relationship', relationTo: 'work', required: true },
            {
              name: 'title',
              type: 'text',
              admin: { description: 'Short name for the row. Defaults to the project title.' },
            },
            { name: 'struggle', type: 'textarea', label: 'The struggle' },
            { name: 'built', type: 'textarea', label: 'What we built' },
            { name: 'changed', type: 'textarea', label: 'What changed' },
          ],
        },
      ],
    },
    {
      name: 'testimonial',
      type: 'group',
      fields: [
        { name: 'quote', type: 'textarea' },
        { name: 'attribution', type: 'text' },
        {
          name: 'result',
          type: 'text',
          admin: { description: 'Headline result in the box with the teal rule.' },
        },
        {
          name: 'resultNote',
          type: 'text',
          admin: { description: 'Small line under the result.' },
        },
      ],
    },
    {
      name: 'process',
      label: 'Working with us (steps)',
      type: 'group',
      fields: [
        heading('Working with us *is simple*'),
        { name: 'note', type: 'text' },
        titledItems('steps'),
      ],
    },
    {
      name: 'about',
      label: 'Founder',
      type: 'group',
      fields: [
        heading(),
        {
          name: 'body',
          type: 'textarea',
          admin: { description: 'Leave a blank line between paragraphs.' },
        },
        { name: 'linkLabel', type: 'text', defaultValue: 'More about how we work' },
        figureField('photo', 'Photo'),
      ],
    },
    {
      name: 'closing',
      label: 'Closing call to action',
      type: 'group',
      fields: [
        heading(),
        { name: 'body', type: 'textarea' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Talk about your business' },
        ctaField('secondaryCta', 'Secondary link'),
        {
          name: 'phoneLabel',
          type: 'text',
          defaultValue: 'Or call',
          admin: {
            description:
              'Shown before the phone number from Site settings. Hidden when no phone number is set.',
          },
        },
      ],
    },
    seoField,
  ],
}
