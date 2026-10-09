import type { Field } from 'payload'

/** Search and social overrides. Anything left blank falls back to the page's own heading and intro. */
export const seoField: Field = {
  name: 'seo',
  label: 'SEO',
  type: 'group',
  admin: {
    description:
      'How this page appears in Google and when shared. Leave blank to use the page heading and intro.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description:
          'Around 50 to 60 characters. " | Pixeldev" is added automatically on inner pages.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Around 140 to 160 characters. Mention Melbourne where it reads naturally.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Social share image, 1200 x 630. A branded card is generated if left blank.',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      label: 'Hide from search engines',
    },
  ],
}
