import type { Media, Post, Service, Topic, Work } from '@/payload-types'

export type Rel<T> = T | number | null | undefined

/** Narrow a Payload relationship to its populated document. */
export function doc<T>(value: Rel<T>): T | null {
  if (value && typeof value === 'object') return value as T
  return null
}

export function docs<T>(value: Rel<T>[] | null | undefined): T[] {
  if (!value) return []
  return value.map((v) => doc(v)).filter((v): v is T => v !== null)
}

export function media(value: Rel<Media>): Media | null {
  return doc<Media>(value)
}

export function workHref(item: Work): string {
  if (item.caseStudy?.enabled) return `/work/${item.slug}`
  if (item.externalUrl) return item.externalUrl
  return '/work'
}

export function serviceHref(item: Service): string {
  return `/services/${item.slug}`
}

export function postHref(item: Post): string {
  return `/journal/${item.slug}`
}

export function topicName(post: Post): string | null {
  const t = doc<Topic>(post.topic)
  return t?.name ?? null
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href)
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Melbourne',
  }).format(new Date(iso))
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
