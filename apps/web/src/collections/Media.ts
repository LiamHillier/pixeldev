import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Admin' },
  access: { read: () => true },
  upload: {
    imageSizes: [
      { name: 'card', width: 900, position: 'centre' },
      { name: 'wide', width: 1600, position: 'centre' },
    ],
    adminThumbnail: 'card',
    mimeTypes: ['image/*'],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
