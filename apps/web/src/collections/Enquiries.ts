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
    { name: 'phone', type: 'text' },
    { name: 'need', type: 'text', label: 'What they are after' },
    { name: 'systems', type: 'text' },
    {
      name: 'problem',
      type: 'textarea',
      required: true,
      label: 'In their words',
      admin: { description: 'The process, project or question they described.' },
    },
    {
      name: 'answers',
      type: 'array',
      label: 'Other answers',
      admin: { description: 'The rest of what they answered in the form, one row per question.' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      // The form no longer asks for a budget. Kept so enquiries sent before that still show theirs.
      name: 'budget',
      type: 'text',
      admin: { readOnly: true, condition: (data) => Boolean(data?.budget) },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: ['new', 'replied', 'won', 'closed'],
      admin: { position: 'sidebar' },
    },
  ],
}
