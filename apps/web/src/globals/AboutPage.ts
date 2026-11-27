import type { GlobalConfig } from 'payload'
import { closingField, labelValueItems, pageHeader, statsField, titledItems } from '@/fields/cta'
import { figureField } from '@/fields/figure'
import { seoField } from '@/fields/seo'

const headingDescription =
  'Two tones: wrap the grey part in *stars*. ~Tildes~ ink in on scroll. {toggle}, {sync}, {live} or {img} add a pill glyph.'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    ...pageHeader,
    {
      name: 'body',
      type: 'textarea',
      admin: { description: 'Second paragraph under the intro, beside the photo.' },
    },
    figureField('photo', 'Photo'),
    statsField('stats', 'Numbers band (big numbers between rules; the last one is teal)'),
    labelValueItems('facts', 'Facts (not shown on the page; listed in /llms.txt)'),
    {
      name: 'clients',
      type: 'group',
      label: 'Client names',
      admin: {
        description:
          'The names come from Work entries marked "Client project", so only direct clients are listed.',
      },
      fields: [{ name: 'label', type: 'text', defaultValue: 'Businesses we’ve built for' }],
    },
    {
      name: 'background',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'What shaped *how we work*',
          admin: { description: headingDescription },
        },
        titledItems('items'),
      ],
    },
    {
      name: 'promises',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'A few things *you can count on*',
          admin: { description: headingDescription },
        },
        titledItems('items'),
      ],
    },
    {
      name: 'solo',
      type: 'group',
      label: 'Small by design section',
      fields: [
        { name: 'heading', type: 'text', admin: { description: headingDescription } },
        { name: 'body', type: 'textarea' },
      ],
    },
    closingField,
    seoField,
  ],
}
