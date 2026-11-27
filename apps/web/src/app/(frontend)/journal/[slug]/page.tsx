import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Figure, ImageBox } from '@/components/Figure'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { Crumb, TwoTone } from '@/components/ui'
import { getAboutPage, getPost, getPosts, getSite } from '@/lib/data'
import { extractHeadings } from '@/lib/lexical'
import { absoluteUrl, breadcrumbJsonLd, ids, pageMetadata } from '@/lib/seo'
import { doc, formatDate, media, topicName } from '@/lib/utils'
import type { Service } from '@/payload-types'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return pageMetadata({
    path: `/journal/${post.slug}`,
    seo: post.seo,
    title: post.title,
    eyebrow: topicName(post) ?? 'Journal',
    description: post.excerpt,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  })
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const [post, posts, site, about] = await Promise.all([
    getPost(slug),
    getPosts(),
    getSite(),
    getAboutPage(),
  ])
  if (!post) notFound()

  const headings = extractHeadings(post.content)
  const service = doc<Service>(post.relatedService)
  const idx = posts.findIndex((p) => p.id === post.id)
  const prev = idx >= 0 ? posts[idx + 1] : undefined
  const next = idx > 0 ? posts[idx - 1] : undefined
  const topic = topicName(post)
  const path = `/journal/${post.slug}`
  const cover = media(post.cover?.image)

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Journal', path: '/journal' },
            { name: post.title, path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            url: absoluteUrl(path),
            mainEntityOfPage: absoluteUrl(path),
            datePublished: post.publishedAt ?? post.createdAt,
            dateModified: post.updatedAt,
            inLanguage: 'en-AU',
            image: cover?.url
              ? absoluteUrl(cover.url)
              : absoluteUrl(`/og?title=${encodeURIComponent(post.title)}`),
            articleSection: topic ?? undefined,
            keywords: post.tags?.map((t) => t.tag).join(', ') || undefined,
            timeRequired: post.readingMinutes ? `PT${post.readingMinutes}M` : undefined,
            author: { '@id': ids.person },
            publisher: { '@id': ids.business },
            isPartOf: { '@id': absoluteUrl('/journal#blog') },
          },
        ]}
      />
      <section className="flex flex-col gap-8 lg:gap-10 pt-14">
        <Crumb parent="Journal" parentHref="/journal" current={topic ?? 'Article'} />
        <h1 className="h-detail max-w-[1240px]">
          <TwoTone text={post.title} />
        </h1>
        <p className="lead max-w-[780px]">{post.excerpt}</p>
        <p className="text-[16px] text-muted">
          {[
            site.ownerName,
            formatDate(post.publishedAt),
            post.readingMinutes ? `${post.readingMinutes} minute read` : null,
          ]
            .filter(Boolean)
            .join('. ')}
          .
        </p>
      </section>

      {post.cover?.image || post.cover?.placeholder ? (
        <Figure
          data={post.cover}
          frameClassName="aspect-[16/6.4] min-h-[220px] bg-tint-blue"
          className="pt-12"
          priority
        />
      ) : null}

      <section className="flex flex-wrap items-start gap-x-24 gap-y-16 pt-16 lg:pt-[88px]">
        <article className="flex-[999_1_560px] min-w-0 max-w-[760px]">
          <RichText data={post.content} />

          <div className="flex flex-wrap items-start gap-x-7 gap-y-5 mt-12 pt-8 border-t border-ink text-[16px] leading-[1.55]">
            <ImageBox
              img={media(about.photo?.image)}
              frameClassName="w-24 aspect-square shrink-0"
              sizes="96px"
            />
            <div className="flex-[1_1_320px] min-w-0 flex flex-col gap-2">
              <p className="font-display font-medium text-[26px] leading-[1.12] tracking-[-0.03em]">
                {site.ownerName}
              </p>
              <p className="text-muted">
                {site.tagline}{' '}
                <Link href="/about" className="link-u text-ink">
                  More about {site.ownerName?.split(' ')[0] ?? 'the author'}
                </Link>
                .
              </p>
            </div>
          </div>
        </article>

        <aside className="flex-[1_1_260px] min-w-0 flex flex-col gap-10 lg:sticky lg:top-8">
          {headings.length ? (
            <nav
              aria-label="In this article"
              className="flex flex-col pt-5 border-t border-ink text-[16px]"
            >
              <p className="pb-2 text-[15px] text-muted">In this article</p>
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className="inline-flex items-center min-h-[44px] hover:text-accent transition-colors"
                >
                  {h.text}
                </a>
              ))}
            </nav>
          ) : null}
          {service ? (
            <Link
              href={`/services/${service.slug}`}
              className="row-hover flex flex-col gap-2.5 p-6 rounded-xl bg-fill"
            >
              <p className="text-[15px] text-muted">Related service</p>
              <h3 className="text-[26px] leading-[1.12]">{service.title}</h3>
              <p className="text-[16px] text-muted">{service.summary}</p>
            </Link>
          ) : null}
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 text-[14px] text-body">
              {post.tags.map((t) => (
                <span
                  key={t.id ?? t.tag}
                  className="px-3 py-1.5 rounded-full border border-line"
                >
                  {t.tag}
                </span>
              ))}
            </div>
          ) : null}
        </aside>
      </section>

      {prev || next ? (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-8 pt-28 lg:pt-[136px] pb-24 lg:pb-[136px]">
          {prev ? (
            <Link
              href={`/journal/${prev.slug}`}
              className="row-hover flex flex-col gap-3 pt-[22px] border-t-2 border-ink"
            >
              <p className="text-[15px] text-muted">Previous</p>
              <h3 className="max-w-[560px] text-[24px] lg:text-[26px] leading-[1.12]">
                {prev.title}
              </h3>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/journal/${next.slug}`}
              className="row-hover flex flex-col gap-3 pt-[22px] border-t-2 border-ink md:items-end md:text-right"
            >
              <p className="text-[15px] text-muted">Next</p>
              <h3 className="max-w-[560px] text-[24px] lg:text-[26px] leading-[1.12]">
                {next.title}
              </h3>
            </Link>
          ) : null}
        </section>
      ) : (
        <div className="pb-24 lg:pb-[136px]" />
      )}
    </>
  )
}
