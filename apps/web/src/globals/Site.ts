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
      name: 'business',
      type: 'group',
      label: 'Business details (search engines)',
      admin: {
        description:
          'Used for the structured data Google reads for local search. Leave the street address blank to show only the suburb.',
      },
      fields: [
        {
          name: 'phone',
          type: 'text',
          admin: { description: 'Include the country code, e.g. +61 400 000 000.' },
        },
        { name: 'streetAddress', type: 'text' },
        { name: 'locality', type: 'text', defaultValue: 'Melbourne' },
        { name: 'region', type: 'text', defaultValue: 'VIC' },
        { name: 'postcode', type: 'text' },
        {
          name: 'areaServed',
          type: 'array',
          label: 'Areas served',
          fields: [{ name: 'name', type: 'text', required: true }],
        },
        { name: 'priceRange', type: 'text', admin: { description: 'Optional, e.g. $$.' } },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Search defaults',
      fields: [
        {
          name: 'defaultDescription',
          type: 'textarea',
          admin: { description: 'Used when a page has no description of its own.' },
        },
        {
          name: 'llmsSummary',
          type: 'textarea',
          label: 'Summary for AI assistants',
          admin: { description: 'The one-paragraph summary at the top of /llms.txt.' },
        },
      ],
    },
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
