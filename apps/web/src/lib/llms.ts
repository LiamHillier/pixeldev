import { getAboutPage, getContactPage, getPosts, getServices, getSite, getWork } from './data'
import { toMarkdown } from './lexical'
import { absoluteUrl, clip } from './seo'
import { formatDate, topicName } from './utils'

const line = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim()

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
      `${site.name} is ${
        site.ownerName ? `${site.ownerName}, ` : ''
      }an independent software developer based in ${where}, working with businesses in Melbourne and across Australia.`,
      `- Location: ${where}${site.locationLine ? ` (${line(site.locationLine)})` : ''}`,
      site.email ? `- Email: ${site.email}` : null,
      b?.phone ? `- Phone: ${b.phone}` : null,
      `- Enquiries: ${absoluteUrl('/contact')} (reply within one business day)`,
      `- Full text of the services and articles: ${absoluteUrl('/llms-full.txt')}`,
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
  const sections: string[] = [summary.trim()]

  sections.push(
    [
      `# About`,
      `Source: ${absoluteUrl('/about')}`,
      line(about.heading),
      line(about.intro),
      line(about.body),
      ...(about.facts ?? []).map((f) => `- ${f.label}: ${f.value}`),
      ...(about.background?.items ?? []).map((i) => `- ${i.title}: ${line(i.body)}`),
      ...(about.promises?.items ?? []).map((i) => `- ${i.title}: ${line(i.body)}`),
    ]
      .filter(Boolean)
      .join('\n\n'),
  )

  for (const s of services) {
    const parts = [
      `# ${s.title}`,
      `Source: ${absoluteUrl(`/services/${s.slug}`)}`,
      `${line(s.hero.heading)} ${line(s.hero.intro)}`,
    ]
    if (s.painPoints?.items?.length) {
      parts.push(
        `## ${s.painPoints.heading}`,
        s.painPoints.items.map((i) => `- ${i.title}: ${line(i.body)}`).join('\n'),
      )
    }
    if (s.offerings?.items?.length) {
      parts.push(
        `## ${s.offerings.heading}`,
        s.offerings.items.map((i) => `- ${i.title}: ${line(i.body)}`).join('\n'),
      )
    }
    if (s.approach?.items?.length) {
      parts.push(
        `## ${s.approach.heading}`,
        s.approach.items.map((i) => `- ${i.title}: ${line(i.body)}`).join('\n'),
      )
    }
    if (s.plans?.items?.length) {
      parts.push(
        `## ${s.plans.heading || 'Plans'}`,
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
