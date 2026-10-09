import type { GlobalConfig } from 'payload'
import { closingField, labelValueItems, titledItems } from '@/fields/cta'
import { figureField } from '@/fields/figure'

const pageHeader = [
  { name: 'eyebrow', type: 'text' },
  { name: 'heading', type: 'text', required: true },
  { name: 'intro', type: 'textarea' },
] as const

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Services page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    ...pageHeader,
    {
      name: 'engagement',
      type: 'group',
      label: 'Ways to work together',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Ways to work together' },
        { name: 'intro', type: 'text' },
        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'price', type: 'text' },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
      ],
    },
    closingField,
  ],
}

export const WorkPage: GlobalConfig = {
  slug: 'work-page',
  label: 'Work page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    ...pageHeader,
    {
      name: 'products',
      type: 'group',
      label: 'Products section',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Products I own and run' },
        { name: 'intro', type: 'textarea' },
      ],
    },
    {
      name: 'clients',
      type: 'group',
      label: 'Client projects section',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Client projects' },
        { name: 'intro', type: 'textarea' },
        { name: 'note', type: 'text' },
      ],
    },
    {
      name: 'anonymised',
      type: 'group',
      label: 'Anonymised section',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Anonymised' },
        { name: 'intro', type: 'textarea' },
      ],
    },
  ],
}

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    ...pageHeader,
    { name: 'body', type: 'textarea' },
    figureField('photo', 'Photo'),
    labelValueItems('facts', 'Facts row'),
    {
      name: 'background',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'What shaped how I work' },
        titledItems('items'),
      ],
    },
    {
      name: 'promises',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'A few things you can count on' },
        titledItems('items'),
      ],
    },
    {
      name: 'solo',
      type: 'group',
      label: 'One person section',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
    closingField,
  ],
}

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    ...pageHeader,
    {
      name: 'form',
      type: 'group',
      fields: [
        {
          name: 'needOptions',
          type: 'array',
          fields: [{ name: 'label', type: 'text', required: true }],
        },
        {
          name: 'budgetOptions',
          type: 'array',
          fields: [{ name: 'label', type: 'text', required: true }],
        },
        { name: 'submitLabel', type: 'text', defaultValue: 'Send it' },
        { name: 'submitNote', type: 'text' },
        { name: 'successHeading', type: 'text', defaultValue: 'Got it.' },
        { name: 'successBody', type: 'textarea' },
      ],
    },
    {
      name: 'nextSteps',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'What happens next' },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'aside',
      type: 'group',
      fields: [
        { name: 'directHeading', type: 'text', defaultValue: 'Or directly' },
        { name: 'directNote', type: 'text' },
        { name: 'supportHeading', type: 'text' },
        { name: 'supportNote', type: 'text' },
      ],
    },
  ],
}

export const JournalPage: GlobalConfig = {
  slug: 'journal-page',
  label: 'Journal page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [...pageHeader],
}
