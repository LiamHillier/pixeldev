/**
 * Updates page copy in an existing database from src/seed/copy, plus the SEO titles and
 * descriptions from src/seed/seo.ts. Work, Posts, Enquiries, media and users are left alone.
 *
 *   DATABASE_URL=file:/path/to/copy.db pnpm sync:copy
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { applyCopy } from './copy'
import { seedSeo, siteSeo } from './seo'

const log = (msg: string) => console.log(`[sync] ${msg}`)

try {
  const payload = await getPayload({ config })
  await applyCopy(payload, log)
  await payload.updateGlobal({ slug: 'site', data: siteSeo })
  await seedSeo(payload)
  log('seo')
  log('done')
  process.exit(0)
} catch (err) {
  console.error(err)
  process.exit(1)
}
