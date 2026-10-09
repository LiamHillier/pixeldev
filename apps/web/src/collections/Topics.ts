import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'

export const Topics: CollectionConfig = {
  slug: 'topics',
  admin: { useAsTitle: 'name', group: 'Journal' },
  access: { read: () => true },
  fields: [{ name: 'name', type: 'text', required: true }, slugField('name')],
}
