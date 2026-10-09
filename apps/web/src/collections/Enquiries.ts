import type { CollectionConfig } from 'payload'
import { notifyEnquiry } from '@/hooks/notifyEnquiry'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    group: 'Inbox',
    defaultColumns: ['name', 'business', 'need', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: { afterChange: [notifyEnquiry] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'business', type: 'text' },
    { name: 'need', type: 'text' },
    { name: 'systems', type: 'text' },
    { name: 'problem', type: 'textarea', required: true },
    { name: 'budget', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: ['new', 'replied', 'won', 'closed'],
      admin: { position: 'sidebar' },
    },
  ],
}
