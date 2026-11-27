/**
 * The contact form's questions. One place to edit them: the form renders from this, and the server
 * action reads the same definitions to validate a submission and label each answer.
 *
 * The first screen asks what the visitor is after and picks a path. Each path is a list of steps.
 * A field with `store` is written to that Enquiries column; every other field is saved as a
 * question-and-answer row on the enquiry.
 */

type Base = {
  name: string
  label: string
  /** Enquiries column this field is saved to. Without it the answer is saved as a Q&A row. */
  store?: 'name' | 'email' | 'business' | 'phone' | 'problem' | 'systems'
  required?: boolean
  /** Message shown when a required field is left empty. */
  missing?: string
}

export type TextField = Base & {
  kind: 'text'
  type?: 'text' | 'email' | 'tel'
  autoComplete?: string
  placeholder?: string
}

export type TextareaField = Base & {
  kind: 'textarea'
  placeholder?: string
  rows?: number
}

export type ChoiceField = Base & {
  kind: 'choice'
  options: string[]
  multiple?: boolean
  /** Adds a free-text input under the options; what is typed there joins the answer. */
  other?: { label: string; placeholder?: string }
}

export type FormField = TextField | TextareaField | ChoiceField

export type FormStep = { title: string; intro?: string; fields: FormField[] }

export type FormPath = { id: string; label: string; body: string; steps: FormStep[] }

/** Name of the free-text input that goes with a choice field's `other`. */
export const otherName = (field: ChoiceField) => `${field.name}Other`

const aboutYou: FormStep = {
  title: 'Where do we send the reply?',
  fields: [
    { kind: 'text', name: 'name', label: 'Your name', store: 'name', autoComplete: 'name', required: true },
    {
      kind: 'text',
      name: 'email',
      label: 'Email',
      store: 'email',
      type: 'email',
      autoComplete: 'email',
      required: true,
    },
    { kind: 'text', name: 'business', label: 'Business', store: 'business', autoComplete: 'organization' },
    {
      kind: 'text',
      name: 'phone',
      label: 'Phone (optional)',
      store: 'phone',
      type: 'tel',
      autoComplete: 'tel',
    },
    {
      kind: 'choice',
      name: 'teamSize',
      label: 'How big is the team?',
      options: ['Just me', '2 to 10', '11 to 50', 'More than 50'],
    },
    {
      kind: 'choice',
      name: 'timeline',
      label: 'When do you want this running?',
      options: ['As soon as possible', 'In the next few months', 'No rush, just exploring'],
    },
  ],
}

export const formPaths: FormPath[] = [
  {
    id: 'automation',
    label: 'Automate a process',
    body: 'Something manual, repetitive or error-prone that should run itself.',
    steps: [
      {
        title: 'Tell us about the process',
        intro: 'Rough answers are fine. This is what lets us come back with a real plan instead of more questions.',
        fields: [
          {
            kind: 'textarea',
            name: 'process',
            label: 'What’s the job you want off your plate?',
            store: 'problem',
            required: true,
            missing: 'A few words about the process are needed.',
            placeholder:
              'Plain words are best. What happens today, step by step, who does it, and what sets it off.',
          },
          {
            kind: 'choice',
            name: 'frequency',
            label: 'How often does it happen?',
            options: ['A few times a month', 'Every week', 'Every day', 'Many times a day'],
          },
          {
            kind: 'choice',
            name: 'hours',
            label: 'Roughly how much time does it take each week?',
            options: ['Under 2 hours', '2 to 5 hours', '5 to 10 hours', '10 to 20 hours', 'More than 20 hours', 'Not sure'],
          },
          {
            kind: 'choice',
            name: 'pain',
            label: 'What goes wrong with it today?',
            multiple: true,
            options: [
              'It takes too long',
              'Mistakes and double entry',
              'Things get missed',
              'Only one person knows how',
              'No way to see where things are at',
            ],
          },
        ],
      },
      {
        title: 'What does it touch?',
        fields: [
          {
            kind: 'choice',
            name: 'tools',
            label: 'Which tools are involved?',
            store: 'systems',
            multiple: true,
            options: [
              'Xero',
              'MYOB',
              'Shopify',
              'WooCommerce',
              'Square',
              'Stripe',
              'HubSpot',
              'Salesforce',
              'Google Sheets or Excel',
              'Gmail or Outlook',
              'Slack or Teams',
            ],
            other: {
              label: 'Anything else?',
              placeholder: 'e.g. industry software, an in-house system, paper forms',
            },
          },
          {
            kind: 'choice',
            name: 'tried',
            label: 'Have you tried automating it already?',
            options: [
              'Not yet',
              'Zapier, Make or n8n',
              'A script or a developer',
              'A feature in one of our tools',
            ],
          },
          {
            kind: 'textarea',
            name: 'outcome',
            label: 'If it ran itself, what would the result look like? (optional)',
            rows: 4,
            placeholder: 'e.g. every paid order becomes a Xero invoice, and we only hear about the ones that fail.',
          },
        ],
      },
      aboutYou,
    ],
  },
  {
    id: 'project',
    label: 'Build or fix software',
    body: 'A custom system, an integration, a plugin or a website.',
    steps: [
      {
        title: 'Tell us about the project',
        fields: [
          {
            kind: 'textarea',
            name: 'brief',
            label: 'What do you want built or fixed?',
            store: 'problem',
            required: true,
            missing: 'A few words about the project are needed.',
            placeholder: 'Plain words are best. What it should do, who uses it, and what you’re using in the meantime.',
          },
          {
            kind: 'choice',
            name: 'projectType',
            label: 'What kind of thing is it?',
            options: [
              'Internal tool or CRM',
              'Customer portal or web app',
              'Integration between systems',
              'WordPress or WooCommerce plugin',
              'Website',
              'Not sure yet',
            ],
          },
          {
            kind: 'choice',
            name: 'stage',
            label: 'Where is it at?',
            options: ['Just an idea', 'We have a written brief', 'It exists and needs work'],
          },
          {
            kind: 'text',
            name: 'projectSystems',
            label: 'Which systems does it need to work with? (optional)',
            store: 'systems',
            placeholder: 'e.g. WooCommerce, Xero, HubSpot, a spreadsheet',
          },
        ],
      },
      aboutYou,
    ],
  },
  {
    id: 'question',
    label: 'Ask a quick question',
    body: 'Not sure what you need yet, or you just want to ask something.',
    steps: [
      {
        title: 'What’s on your mind?',
        fields: [
          {
            kind: 'textarea',
            name: 'message',
            label: 'Your message',
            store: 'problem',
            required: true,
            missing: 'A message is needed.',
            placeholder: 'Ask away. If you’re not sure what you need, tell us what’s slow, manual or broken.',
          },
          { kind: 'text', name: 'name', label: 'Your name', store: 'name', autoComplete: 'name', required: true },
          {
            kind: 'text',
            name: 'email',
            label: 'Email',
            store: 'email',
            type: 'email',
            autoComplete: 'email',
            required: true,
          },
          {
            kind: 'text',
            name: 'business',
            label: 'Business (optional)',
            store: 'business',
            autoComplete: 'organization',
          },
        ],
      },
    ],
  },
]

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The problem with what was entered for a field, or null when it is fine. Used on both sides. */
export function fieldError(field: FormField, value: string | string[]): string | null {
  const empty = Array.isArray(value) ? value.length === 0 : !value.trim()
  if (empty) {
    return field.required ? (field.missing ?? `${field.label.replace(/ \(optional\)$/, '')} is needed.`) : null
  }
  if (field.kind === 'text' && field.type === 'email' && !EMAIL_RE.test(String(value).trim())) {
    return 'That email address does not look right.'
  }
  return null
}
