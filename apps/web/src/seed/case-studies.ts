/**
 * Upserts the case studies in ./case-studies/<slug>/ (brief.json + images) into Work, uploading
 * their imagery to Media. Safe to re-run: projects are matched by slug and images by filename.
 *
 *   pnpm seed:work
 */
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '@payload-config'
import { p, richText, ul } from './lexical'

const log = (msg: string) => console.log(`[seed:work] ${msg}`)
const DIR = join(fileURLToPath(new URL('.', import.meta.url)), 'case-studies')

/** Listing order, home-page featuring and "more work" links. Slugs not in a brief.json are left alone. */
const LAYOUT: Record<string, { order: number; featured: boolean; moreWork: string[] }> = {
  'squaresync-for-woo': { order: 10, featured: true, moreWork: ['vinoshipper-wordpress-plugin', 'oncloudwine'] },
  oncloudwine: { order: 20, featured: false, moreWork: ['squaresync-for-woo', 'vinoshipper-wordpress-plugin'] },
  'takeshape-adventures-crm': { order: 40, featured: true, moreWork: ['bowery-investor-onboarding', 'kir'] },
  'bowery-investor-onboarding': { order: 50, featured: true, moreWork: ['kir', 'takeshape-adventures-crm'] },
  kir: { order: 52, featured: false, moreWork: ['bowery-investor-onboarding', 'takeshape-adventures-crm'] },
  flo: { order: 54, featured: false, moreWork: ['takeshape-adventures-crm', 'oncloudwine'] },
  'vinoshipper-wordpress-plugin': { order: 56, featured: false, moreWork: ['squaresync-for-woo', 'oncloudwine'] },
}

type Item = { label: string; value: string }
type Fig = { file: string; alt: string; caption?: string }
type Brief = {
  slug: string
  title: string
  kind: 'product' | 'client' | 'anonymised'
  category: string
  summary: string
  externalUrl?: string | null
  image: Fig
  stats: Item[]
  seo?: { title: string; description: string }
  caseStudy: {
    heading: string
    intro: string
    meta: Item[]
    hero: Fig
    bigStats: Item[]
    sections: Array<{ heading: string; paragraphs: string[]; steps?: string[]; bullets?: string[]; figure?: Fig }>
    quote?: { text: string; attribution: string } | null
    atAGlance: Item[]
    asideCta: { heading: string; body: string; ctaLabel?: string }
  }
}

async function run() {
  const payload = await getPayload({ config })

  const upload = async (slug: string, fig: Fig | undefined) => {
    if (!fig?.file) return undefined
    const name = `${slug}-${fig.file}`
    const found = await payload.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1, depth: 0 })
    const data = await readFile(join(DIR, slug, fig.file))
    const file = { data, name, mimetype: 'image/png', size: data.length }
    if (found.docs[0]) {
      const doc = await payload.update({ collection: 'media', id: found.docs[0].id, data: { alt: fig.alt }, file, overwriteExistingFiles: true })
      return doc.id
    }
    const doc = await payload.create({ collection: 'media', data: { alt: fig.alt }, file })
    return doc.id
  }
  const figure = async (slug: string, fig: Fig | undefined) =>
    fig ? { image: await upload(slug, fig), caption: fig.caption ?? null, placeholder: null } : undefined

  const slugs = (await readdir(DIR, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name)
  const ids: Record<string, number> = {}

  for (const dir of slugs) {
    const b: Brief = JSON.parse(await readFile(join(DIR, dir, 'brief.json'), 'utf8'))
    const cs = b.caseStudy
    const layout = LAYOUT[b.slug]
    const data = {
      title: b.title,
      slug: b.slug,
      kind: b.kind,
      category: b.category,
      summary: b.summary,
      externalUrl: b.externalUrl ?? null,
      ...(layout ? { order: layout.order, featured: layout.featured } : {}),
      image: await figure(dir, b.image),
      stats: b.stats,
      caseStudy: {
        enabled: true,
        heading: cs.heading,
        intro: cs.intro,
        meta: cs.meta,
        hero: await figure(dir, cs.hero),
        bigStats: cs.bigStats,
        sections: await Promise.all(
          cs.sections.map(async (s) => ({
            heading: s.heading,
            body: richText(...s.paragraphs.map(p), ...(s.bullets?.length ? [ul(s.bullets)] : [])),
            steps: s.steps?.map((text) => ({ text })) ?? [],
            figure: (await figure(dir, s.figure)) ?? { image: null, caption: null, placeholder: null },
          })),
        ),
        quote: cs.quote ?? { text: null, attribution: null },
        atAGlance: cs.atAGlance,
        asideCta: { ctaLabel: 'Start a project', ...cs.asideCta },
      },
      ...(b.seo ? { seo: b.seo } : {}),
    }
    const found = await payload.find({ collection: 'work', where: { slug: { equals: b.slug } }, limit: 1, depth: 0 })
    const doc = found.docs[0]
      ? await payload.update({ collection: 'work', id: found.docs[0].id, data })
      : await payload.create({ collection: 'work', data })
    ids[b.slug] = doc.id
    log(`${found.docs[0] ? 'updated' : 'created'} ${b.slug}`)
  }

  // Second pass, once every project has an id.
  for (const [slug, id] of Object.entries(ids)) {
    const more = LAYOUT[slug]?.moreWork.map((s) => ids[s]).filter(Boolean)
    if (!more?.length) continue
    const doc = await payload.findByID({ collection: 'work', id, depth: 0 })
    await payload.update({ collection: 'work', id, data: { caseStudy: { ...doc.caseStudy, moreWork: more } } })
  }
  log('done')
  process.exit(0)
}

try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
