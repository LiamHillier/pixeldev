import type { GlobalConfig } from 'payload'
import { closingField, pageHeader } from '@/fields/cta'
import { seoField } from '@/fields/seo'

const markup =
  'Two tones: wrap the grey part in *stars*. ~Tildes~ ink in on scroll. {toggle}, {sync}, {live} or {img} add a pill glyph.'

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Services page',
  admin: {
    group: 'Pages',
    description:
      'The services index. The five service rows come from the Services collection (title, index intro, index bullet list and link label).',
  },
  access: { read: () => true },
  fields: [
    ...pageHeader,
    {
      name: 'engagement',
      type: 'group',
      label: 'Ways to work together',
      admin: { description: 'The grey band of engagement options under the service rows.' },
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Ways to *work together*',
          admin: { description: markup },
        },
        { name: 'intro', type: 'text' },
        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'price',
              type: 'text',
              admin: { description: 'Optional. Shown under the title when set.' },
            },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      ...closingField,
      admin: {
        description: `Dark closing panel. Heading: ${markup} Usual form: "~Lead~ *grey tail*".`,
      },
    } as typeof closingField,
    seoField,
  ],
}
