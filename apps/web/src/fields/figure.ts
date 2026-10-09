import type { Field } from 'payload'

/** An image with a caption. The placeholder text shows in a muted box until an image is uploaded. */
export const figureField = (name = 'figure', label = 'Figure'): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'placeholder',
      type: 'text',
      admin: { description: 'Shown in a grey box until an image is set.' },
    },
    { name: 'caption', type: 'text' },
  ],
})
