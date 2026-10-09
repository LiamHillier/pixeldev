import type { Metadata } from 'next'
import Link from 'next/link'
import { Figure } from '@/components/Figure'
import { PageHeader } from '@/components/ui'
import { getJournalPage, getPosts, getTopics } from '@/lib/data'
import { cx, formatDate, topicName } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getJournalPage()
  return { title: 'Journal', description: page.intro ?? undefined }
}

export default async function JournalIndex({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams
  const [page, posts, topics] = await Promise.all([getJournalPage(), getPosts(), getTopics()])

  const filtered = topic
    ? posts.filter((p) => typeof p.topic === 'object' && p.topic?.slug === topic)
    : posts
  const featured = topic ? null : (filtered.find((p) => p.featured) ?? null)
  const rest = featured ? filtered.filter((p) => p.id !== featured.id) : filtered

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} className="lg:pt-[88px] lg:pb-14">
        {topics.length ? (
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-faint">
            <span>Topics</span>
            {topics.map((t) => (
              <Link
                key={t.id}
                href={topic === t.slug ? '/journal' : `/journal?topic=${t.slug}`}
                className={cx('link-u', topic === t.slug && 'text-accent')}
              >
                {t.name}
              </Link>
            ))}
          </div>
        ) : null}
      </PageHeader>

      {featured ? (
        <Link
          href={`/journal/${featured.slug}`}
          className="row-hover grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-x-16 gap-y-8 py-12 border-t border-ink items-start"
        >
          <Figure data={featured.cover} frameClassName="aspect-[4/3]" showCaption={false} sizes="(min-width: 1024px) 560px, 100vw" />
          <div className="flex flex-col gap-4">
            <p className="text-[14px] text-faint">
              {['Featured', topicName(featured), formatDate(featured.publishedAt), featured.readingMinutes ? `${featured.readingMinutes} minute read` : null]
                .filter(Boolean)
                .join('. ')}
              .
            </p>
            <h2 className="font-serif leading-[1.08] tracking-[-0.015em]" style={{ fontSize: 'clamp(30px, 3.4vw, 44px)' }}>
              {featured.title}
            </h2>
            <p className="text-[17px] text-body">{featured.excerpt}</p>
            <span className="link-u text-[16px] self-start">Read the article</span>
          </div>
        </Link>
      ) : null}

      <section className="flex flex-col pb-24">
        {rest.map((p, i) => (
          <Link
            key={p.id}
            href={`/journal/${p.slug}`}
            className={cx(
              'row-hover grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-12 gap-y-3 py-8 border-t items-start',
              i === 0 ? 'border-ink' : 'border-rule',
              i === rest.length - 1 && 'border-b border-b-ink',
            )}
          >
            <p className="text-[14px] text-faint">
              {formatDate(p.publishedAt)}
              <br />
              {topicName(p)}
            </p>
            <div className="flex flex-col gap-2 md:col-span-2">
              <h3 className="h-card">{p.title}</h3>
              <p className="text-[16px] text-muted">{p.excerpt}</p>
            </div>
          </Link>
        ))}
        {!rest.length && !featured ? <p className="py-12 text-[16px] text-faint border-t border-ink">Nothing here yet.</p> : null}
      </section>
    </>
  )
}
