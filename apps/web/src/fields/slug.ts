import type { Field, FieldHook } from 'payload'

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, operation }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    if (operation === 'create' || !value) {
      const source = data?.[fallbackField]
      if (typeof source === 'string') return slugify(source)
    }
    return value
  }

export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Used in the URL. Generated from the title if left blank.',
  },
  hooks: {
    beforeValidate: [formatSlug(fallbackField)],
  },
})
