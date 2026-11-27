/**
 * Writes the site's page copy (globals and service pages) from the files in this folder.
 * Used by the seed and by `pnpm sync:copy`, which updates an existing database without touching
 * Work, Posts, Enquiries, media or users. Upload fields and SEO groups are not in the copy, so they
 * keep their current values.
 */
import type { Payload } from 'payload'
import { aboutPageCopy } from './about'
import { contactPageCopy } from './contact'
import { resolveHomeCopy } from './home'
import { journalPageCopy } from './journal-page'
import { servicesCopy, servicesPageCopy } from './services'
import { siteCopy } from './site'
import { workPageCopy } from './work-page'

export async function applyCopy(payload: Payload, log: (msg: string) => void = console.log) {
  await payload.updateGlobal({ slug: 'site', data: siteCopy })
  await payload.updateGlobal({ slug: 'home', data: await resolveHomeCopy(payload) })
  await payload.updateGlobal({ slug: 'services-page', data: servicesPageCopy })
  await payload.updateGlobal({ slug: 'work-page', data: workPageCopy })
  await payload.updateGlobal({ slug: 'about-page', data: aboutPageCopy })
  await payload.updateGlobal({ slug: 'contact-page', data: contactPageCopy })
  await payload.updateGlobal({ slug: 'journal-page', data: journalPageCopy })
  log('page globals')

  for (const { slug, data } of servicesCopy) {
    const res = await payload.update({ collection: 'services', where: { slug: { equals: slug } }, data })
    if (!res.docs.length) log(`service not found, skipped: ${slug}`)
  }
  log('services')
}
