import type { GlobalConfig } from 'payload'

const linkFields = [
  { name: 'label', type: 'text', required: true },
  { name: 'href', type: 'text', required: true },
] as const

export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, defaultValue: 'Pixeldev' },
    { name: 'ownerName', type: 'text', defaultValue: 'Liam Hillier' },
    {
      name: 'tagline',
      type: 'textarea',
      admin: { description: 'Footer blurb and default meta description.' },
    },
    { name: 'locationLine', type: 'text', defaultValue: 'Melbourne, working Australia-wide.' },
    { name: 'email', type: 'email' },
    { name: 'supportEmail', type: 'email' },
    { name: 'linkedin', type: 'text' },
    { name: 'abn', type: 'text', label: 'ABN' },
    {
      name: 'nav',
      type: 'array',
      label: 'Header navigation',
      fields: [...linkFields],
    },
    { name: 'headerCtaLabel', type: 'text', defaultValue: 'Start a project' },
    {
      name: 'products',
      type: 'array',
      label: 'Footer: products',
      fields: [...linkFields],
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Footer: legal links',
      fields: [...linkFields],
    },
  ],
}
