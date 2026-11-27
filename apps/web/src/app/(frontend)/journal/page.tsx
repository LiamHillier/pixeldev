import type { Metadata } from 'next'
import Link from 'next/link'
import { Figure } from '@/components/Figure'
import { PageHeader } from '@/components/ui'
import { JsonLd } from '@/components/JsonLd'
import { getJournalPage, getPosts, getTopics } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata, absoluteUrl, ids } from '@/lib/seo'
import { cx, formatDate, topicName } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getJournalPage()
  return pageMetadata({
    path: '/journal',
    seo: page.seo,
    title: 'Journal',
    heading: page.heading,
    eyebrow: page.eyebrow,
    description: page.intro,
  })
}

export default async function JournalIndex({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>
}) {
  const { topic } = await searchParams
  const [page, posts, topics] = await Promise.all([getJournalPage(), getPosts(), getTopics()])

  const filtered = topic
    ? posts.filter((p) => typeof p.topic === 'object' && p.topic?.slug === topic)
    : posts
  const featured = topic ? null : (filtered.find((p) => p.featured) ?? null)
  const rest = featured ? filtered.filter((p) => p.id !== featured.id) : filtered

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: 'Journal', path: '/journal' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': absoluteUrl('/journal#blog'),
            url: absoluteUrl('/journal'),
            name: page.eyebrow || 'Journal',
            description: page.intro ?? undefined,
            inLanguage: 'en-AU',
            publisher: { '@id': ids.business },
          },
        ]}
      />
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro}>
        {topics.length ? (
          <nav
            aria-label="Topics"
            className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[16px]"
          >
            <span className="text-muted">Topics</span>
            {topics.map((t) => (
              <Link
                key={t.id}
                href={topic === t.slug ? '/journal' : `/journal?topic=${t.slug}`}
                aria-current={topic === t.slug ? 'page' : undefined}
                className={cx(
                  'link-u inline-flex items-center min-h-[44px]',
                  topic === t.slug && 'text-accent',
                )}
              >
                {t.name}
              </Link>
            ))}
          </nav>
        ) : null}
      </PageHeader>

      {featured ? (
        <section className="pt-20 lg:pt-24">
          <Link
            href={`/journal/${featured.slug}`}
            className="row-hover flex flex-wrap items-center gap-x-[72px] gap-y-8"
          >
            <Figure
              data={featured.cover}
              frameClassName="aspect-[16/10] bg-tint-teal"
              showCaption={false}
              className="flex-[3_1_480px] min-w-0"
              sizes="(min-width: 1024px) 800px, 100vw"
            />
            <div className="flex-[2_1_400px] min-w-0 flex flex-col gap-[18px]">
              <p className="text-[15px] text-muted">
                {[
                  'Featured',
                  topicName(featured),
                  formatDate(featured.publishedAt),
                  featured.readingMinutes ? `${featured.readingMinutes} minute read` : null,
                ]
                  .filter(Boolean)
                  .join('. ')}
                .
              </p>
              <h2
                className="font-display font-medium leading-[1.05] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(30px, 3.2vw, 44px)' }}
              >
                {featured.title}
              </h2>
              <p className="text-[18px] text-body">{featured.excerpt}</p>
              <span className="link-u self-start pt-1 text-accent">Read the article</span>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="flex flex-col pt-20 lg:pt-28 pb-24 lg:pb-[136px]">
        {rest.map((p, i) => (
          <Link
            key={p.id}
            href={`/journal/${p.slug}`}
            className={cx(
              'row-hover flex flex-wrap items-baseline gap-x-16 gap-y-3 py-8 lg:py-[34px] border-t',
              i === 0 ? 'border-ink' : 'border-rule',
              i === rest.length - 1 && 'border-b border-b-ink',
            )}
          >
            <p className="flex-[1_1_200px] text-[15px] text-muted">
              {formatDate(p.publishedAt)}
              <br />
              {topicName(p)}
            </p>
            <div className="flex-[3_1_520px] min-w-0 max-w-[900px] flex flex-col gap-2.5">
              <h3 className="h-card">{p.title}</h3>
              <p className="text-[16px] text-muted">{p.excerpt}</p>
            </div>
          </Link>
        ))}
        {!rest.length && !featured ? (
          <p className="py-12 text-[16px] text-muted border-t border-ink">Nothing here yet.</p>
        ) : null}
      </section>
    </>
  )
}
