import { cache } from 'react'
import { getPayloadClient } from './payload'
import type { Where } from 'payload'
import type { Post, Service, Work } from '@/payload-types'

// The local API skips access control, so drafts have to be filtered out explicitly.
const published: Where = { _status: { equals: 'published' } }

export const getSite = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site' })
})

export const getHome = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home', depth: 1 })
})

export const getServicesPage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'services-page' })
})

export const getWorkPage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'work-page' })
})

export const getAboutPage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'about-page', depth: 1 })
})

export const getContactPage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'contact-page' })
})

export const getJournalPage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'journal-page' })
})

export const getServices = cache(async (): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    sort: 'order',
    limit: 20,
    depth: 1,
  })
  return docs
})

export const getService = cache(async (slug: string): Promise<Service | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export const getWork = cache(async (): Promise<Work[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'work',
    sort: 'order',
    limit: 50,
    depth: 1,
  })
  return docs
})

export const getFeaturedWork = cache(async (): Promise<Work[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'work',
    where: { featured: { equals: true } },
    sort: 'order',
    limit: 4,
    depth: 1,
  })
  return docs
})

export const getWorkItem = cache(async (slug: string): Promise<Work | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'work',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export const getPosts = cache(async (): Promise<Post[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: published,
    sort: '-publishedAt',
    limit: 100,
    depth: 1,
  })
  return docs
})

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [published, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export const getTopics = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'topics', limit: 50, sort: 'name' })
  return docs
})
