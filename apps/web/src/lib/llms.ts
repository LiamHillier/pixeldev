import { getAboutPage, getContactPage, getPosts, getServices, getSite, getWork } from './data'
import { toMarkdown } from './lexical'
import { absoluteUrl, areasServed, clip, locationFaq } from './seo'
import { formatDate, topicName } from './utils'
import { plainHeading } from '@/components/ui'

const line = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim()

/** The most recent content edit, as YYYY-MM-DD. */
const lastUpdated = (docs: { updatedAt?: string | null }[]) =>
  docs
    .map((d) => d.updatedAt ?? '')
    .sort()
    .at(-1)
    ?.slice(0, 10)

/** /llms.txt, following llmstxt.org: a summary, then annotated links to the pages worth reading. */
export async function buildLlmsTxt(): Promise<string> {
  const [site, services, work, posts] = await Promise.all([
    getSite(),
    getServices(),
    getWork(),
    getPosts(),
  ])
  const caseStudies = work.filter((w) => w.caseStudy?.enabled && !w.seo?.noIndex)
  const products = work.filter((w) => w.kind === 'product')
  const b = site.business
  const where = [b?.locality || 'Melbourne', b?.region || 'VIC', 'Australia'].join(', ')

  const out = [
    `# ${site.name}`,
    `> ${line(site.seo?.llmsSummary || site.seo?.defaultDescription || site.tagline)}`,
    [
      `${site.name} is a software development business based in ${where}${
        site.ownerName ? `, founded by ${site.ownerName}` : ''
      }. It works with small and mid-sized businesses in Melbourne, across Victoria and Australia-wide.`,
      `- Location: ${where}${site.locationLine ? ` (${line(site.locationLine)})` : ''}`,
      `- Service area: ${areasServed(site).join(', ')}. Remote-friendly; time zone is Melbourne (AEST/AEDT).`,
      site.abn
        ? `- Business: ${site.ownerName ? `${site.ownerName}, sole trader, trading as ${site.name}. ` : ''}ABN ${site.abn}`
        : null,
      site.email ? `- Email: ${site.email}` : null,
      b?.phone ? `- Phone: ${b.phone}` : null,
      `- Enquiries: ${absoluteUrl('/contact')} (reply within one business day)`,
      `- Good fit for: businesses that have outgrown spreadsheets, off-the-shelf tools or a chain of Zapier automations, especially those on Xero, MYOB, WooCommerce, Square or a CRM.`,
      `- Full text of the services and articles: ${absoluteUrl('/llms-full.txt')}`,
      `- Last updated: ${lastUpdated([site, ...services, ...work, ...posts])}`,
    ]
      .filter(Boolean)
      .join('\n'),
    '## Services',
    services
      .map((s) => `- [${s.title}](${absoluteUrl(`/services/${s.slug}`)}): ${line(s.summary)}`)
      .join('\n'),
    caseStudies.length
      ? [
          '## Case studies',
          caseStudies
            .map((w) => `- [${w.title}](${absoluteUrl(`/work/${w.slug}`)}): ${line(w.summary)}`)
            .join('\n'),
        ]
      : null,
    products.length
      ? [
          '## Products',
          products
            .map(
              (w) => `- [${w.title}](${w.externalUrl || absoluteUrl('/work')}): ${line(w.summary)}`,
            )
            .join('\n'),
        ]
      : null,
    '## About',
    [
      `- [About ${site.ownerName || site.name}](${absoluteUrl(
        '/about',
      )}): background, how projects run and who does the work`,
      `- [All work](${absoluteUrl('/work')}): products, client projects and anonymised projects`,
      `- [Contact](${absoluteUrl('/contact')}): start a project or ask a question`,
    ].join('\n'),
    posts.length
      ? [
          '## Optional',
          posts
            .map(
              (p) =>
                `- [${p.title}](${absoluteUrl(`/journal/${p.slug}`)}): ${line(
                  clip(p.excerpt, 200),
                )}`,
            )
            .join('\n'),
        ]
      : null,
  ]
  return `${out.flat().filter(Boolean).join('\n\n')}\n`
}

/** /llms-full.txt: the same, with the full service pages, FAQs and articles inlined. */
export async function buildLlmsFullTxt(): Promise<string> {
  const [summary, services, posts, about, contact] = await Promise.all([
    buildLlmsTxt(),
    getServices(),
    getPosts(),
    getAboutPage(),
    getContactPage(),
  ])
  const where = locationFaq(await getSite())
  const sections: string[] = [summary.trim()]

  sections.push(
    [
      `# About`,
      `Source: ${absoluteUrl('/about')}`,
      line(plainHeading(about.heading)),
      line(about.intro),
      line(about.body),
      ...(about.stats ?? []).map((f) => `- ${f.value} ${f.label}`),
      ...(about.background?.items ?? []).map((i) => `- ${i.title}: ${line(i.body)}`),
      ...(about.promises?.items ?? []).map((i) => `- ${i.title}: ${line(i.body)}`),
      `## ${where.question}\n\n${where.answer}`,
    ]
      .filter(Boolean)
      .join('\n\n'),
  )

  for (const s of services) {
    const parts = [
      `# ${s.title}`,
      `Source: ${absoluteUrl(`/services/${s.slug}`)}`,
      `${line(plainHeading(s.hero.heading))} ${line(s.hero.intro)}`,
    ]
    if (s.painPoints?.items?.length) {
      parts.push(
        `## ${plainHeading(s.painPoints.heading)}`,
        s.painPoints.items.map((i) => `- ${i.title}: ${line(i.body)}`).join('\n'),
      )
    }
    if (s.offerings?.items?.length) {
      parts.push(
        `## ${plainHeading(s.offerings.heading)}`,
        s.offerings.items.map((i) => `- ${i.title}: ${line(i.body)}`).join('\n'),
      )
    }
    if (s.approach?.items?.length) {
      parts.push(
        `## ${plainHeading(s.approach.heading)}`,
        s.approach.items.map((i) => `- ${i.title}: ${line(i.body)}`).join('\n'),
      )
    }
    if (s.plans?.items?.length) {
      parts.push(
        `## ${plainHeading(s.plans.heading) || 'Plans'}`,
        s.plans.items
          .map((i) => `- ${i.name}${i.price ? ` (${i.price})` : ''}: ${line(i.body)}`)
          .join('\n'),
      )
    }
    if (s.faqs?.length) {
      parts.push(
        '## Questions',
        s.faqs.map((f) => `### ${f.question}\n\n${line(f.answer)}`).join('\n\n'),
      )
    }
    sections.push(parts.join('\n\n'))
  }

  for (const p of posts) {
    sections.push(
      [
        `# ${p.title}`,
        `Source: ${absoluteUrl(`/journal/${p.slug}`)}`,
        [formatDate(p.publishedAt), topicName(p)].filter(Boolean).join(' · '),
        line(p.excerpt),
        toMarkdown(p.content),
      ]
        .filter(Boolean)
        .join('\n\n'),
    )
  }

  sections.push(`# Contact\n\nSource: ${absoluteUrl('/contact')}\n\n${line(contact.intro)}`)
  return `${sections.join('\n\n---\n\n')}\n`
}
