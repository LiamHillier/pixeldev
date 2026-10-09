import type { getPayload } from 'payload'

type P = Awaited<ReturnType<typeof getPayload>>
type Seo = { title: string; description: string }

const description =
  'Melbourne software developer building custom software, CRMs, AI automation, Xero and MYOB integrations and WooCommerce sites. One engineer, start to finish.'

export const siteSeo = {
  business: {
    locality: 'Melbourne',
    region: 'VIC',
    areaServed: [{ name: 'Melbourne' }, { name: 'Victoria' }, { name: 'Australia' }],
  },
  seo: {
    defaultDescription: description,
    llmsSummary:
      'Pixeldev is the Melbourne-based software practice of Liam Hillier: websites, custom software and CRMs, AI automation, systems integrations and managed hosting for small and mid-sized Australian businesses. One engineer handles each project from the first call through launch and ongoing support.',
  },
}

const globals: Record<string, Seo> = {
  home: {
    title: 'Software Developer Melbourne | Custom Software & AI | Pixeldev',
    description,
  },
  'services-page': {
    title: 'Software Development Services in Melbourne',
    description:
      'Websites, custom software and CRMs, AI automation, integrations and hosting for Melbourne and Australian businesses. Most projects combine two or three.',
  },
  'work-page': {
    title: 'Work and Case Studies: Melbourne Software Projects',
    description:
      'Custom CRMs, integrations, AI automation and WooCommerce builds for businesses in Melbourne and across Australia, plus the software products I run myself.',
  },
  'about-page': {
    title: 'About Liam Hillier, Melbourne Software Developer',
    description:
      'Liam Hillier is a Melbourne software developer trading as Pixeldev, building websites, custom software, AI automation and integrations across Australia.',
  },
  'contact-page': {
    title: 'Contact a Melbourne Software Developer',
    description:
      'Tell me what’s slow, manual or broken. Melbourne-based, working Australia-wide, and I reply within one business day with what I’d build and what it costs.',
  },
  'journal-page': {
    title: 'Journal: Software, AI and Integration Guides',
    description:
      'Practical notes on custom software, AI automation, integrations, WooCommerce and hosting from a Melbourne developer who builds and runs them.',
  },
}

const services: Record<string, Seo> = {
  'ai-automation': {
    title: 'AI Automation Melbourne: Document and Workflow AI',
    description:
      'AI automation for Melbourne businesses: document extraction, enquiry handling, approvals and reporting, built into the CRM and accounting tools you already use.',
  },
  integrations: {
    title: 'API Integrations Melbourne: Xero, MYOB and CRM Sync',
    description:
      'API and webhook integrations for Melbourne businesses. Two-way sync between Xero, MYOB, your CRM and the tools you pay for, with logging, retries and alerts.',
  },
  'custom-software': {
    title: 'Custom Software and CRM Development Melbourne',
    description:
      'Custom CRMs, client portals, dashboards and internal tools for Melbourne businesses, built in Next.js around how your team actually works.',
  },
  websites: {
    title: 'WordPress and WooCommerce Developer Melbourne',
    description:
      'Melbourne WordPress and WooCommerce developer: fast, maintainable sites, custom blocks, checkout extensions and plugin work by the maker of SquareSync.',
  },
  hosting: {
    title: 'Managed WordPress Hosting and Care Plans Melbourne',
    description:
      'Managed WordPress hosting via CloudPerch, app hosting and monthly care plans for Melbourne businesses. Fast, patched and online, supported by the developer.',
  },
}

const work: Record<string, Seo> = {
  'takeshape-adventures-crm': {
    title: 'TakeShape Adventures: Operations Dashboard Case Study',
    description:
      'A custom Next.js operations dashboard for an adventure travel company, synced with WooCommerce, Keap, Meta lead forms and the member app.',
  },
}

/**
 * Search titles and descriptions. Page globals are always refreshed (like the rest of the global seed);
 * collection documents only get SEO filled in where the editor hasn't set any.
 */
export async function seedSeo(payload: P) {
  for (const [slug, seo] of Object.entries(globals)) {
    await payload.updateGlobal({ slug: slug as 'home', data: { seo } })
  }

  const fill = async (collection: 'services' | 'work', entries: Record<string, Seo>) => {
    for (const [slug, seo] of Object.entries(entries)) {
      const { docs } = await payload.find({
        collection,
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
      })
      const doc = docs[0]
      if (!doc || doc.seo?.title || doc.seo?.description) continue
      await payload.update({ collection, id: doc.id, data: { seo } })
    }
  }
  await fill('services', services)
  await fill('work', work)
}
