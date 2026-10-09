import type { Field } from 'payload'

export const ctaField = (name: string, label?: string): Field => ({
  name,
  label: label ?? name,
  type: 'group',
  fields: [
    { name: 'label', type: 'text' },
    {
      name: 'href',
      type: 'text',
      admin: { description: 'Internal path (/contact) or full URL.' },
    },
  ],
})

export const statsField = (name = 'stats', label = 'Stats'): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    { name: 'value', type: 'text', required: true },
    { name: 'label', type: 'text', required: true },
  ],
})

export const titledItems = (name: string, label?: string): Field => ({
  name,
  label: label ?? name,
  type: 'array',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
  ],
})

export const labelValueItems = (name: string, label?: string): Field => ({
  name,
  label: label ?? name,
  type: 'array',
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'value', type: 'text', required: true },
  ],
})

export const closingField: Field = {
  name: 'closing',
  label: 'Closing call to action',
  type: 'group',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'ctaLabel', type: 'text', defaultValue: 'Start a project' },
  ],
}
