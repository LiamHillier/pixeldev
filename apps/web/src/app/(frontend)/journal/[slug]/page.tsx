import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ImageBox } from '@/components/Figure'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { Crumb, Marquee, TwoTone } from '@/components/ui'
import { PostVisual, hasDrawnVisual } from '@/components/journal/PostVisual'
import { getAboutPage, getJournalPage, getPost, getPosts, getSite } from '@/lib/data'
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

const cardTitle = 'text-[24px] lg:text-[26px] leading-[1.12] tracking-[-0.03em]'

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const [post, posts, site, about, page] = await Promise.all([
    getPost(slug),
    getPosts(),
    getSite(),
    getAboutPage(),
    getJournalPage(),
  ])
  if (!post) notFound()

  const labels = page.article
  const headings = extractHeadings(post.content)
  const service = doc<Service>(post.relatedService)
  const idx = posts.findIndex((p) => p.id === post.id)
  const prev = idx >= 0 ? posts[idx + 1] : undefined
  const next = idx > 0 ? posts[idx - 1] : undefined
  const topic = topicName(post)
  const path = `/journal/${post.slug}`
  const cover = media(post.cover?.image)
  const showVisual = hasDrawnVisual(post) || Boolean(cover)
  const photo = media(about.photo?.image)
  const firstName = site.ownerName?.split(' ')[0]
  const authorLink = labels?.authorLinkLabel || (firstName ? `More about ${firstName}` : 'More about us')
  const marquee = (page.marquee?.items ?? []).map((m) => m.name).filter(Boolean)

  return (
    <div className="reads">
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

      <section className="hero-in flex flex-col gap-8 lg:gap-10 pt-10 lg:pt-14">
        <Crumb parent="Journal" parentHref="/journal" current={topic ?? 'Article'} />
        <h1 className="h-detail max-w-[1240px]">
          <TwoTone text={post.title} auto pill="toggle" />
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

      {showVisual ? (
        <figure className="hero-fig m-0 flex flex-col gap-4 pt-12">
          <PostVisual
            post={post}
            tint="blue"
            className="min-h-[260px] md:aspect-[16/6.4]"
            sizes="(min-width: 1408px) 1344px, 100vw"
            priority
          />
          {!hasDrawnVisual(post) && post.cover?.caption ? (
            <figcaption className="text-[15px] text-muted">{post.cover.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}

      <section className="flex flex-wrap items-start gap-x-24 gap-y-16 pt-16 lg:pt-[88px]">
        <article className="rv flex-[999_1_560px] min-w-0 max-w-[760px] flex flex-col">
          <RichText data={post.content} variant="article" />

          <div className="wipe flex flex-wrap items-start gap-x-7 gap-y-5 mt-16 pt-8 border-t border-ink text-[16px] leading-[1.55]">
            {photo ? (
              <ImageBox img={photo} frameClassName="w-24 aspect-square shrink-0" sizes="96px" />
            ) : null}
            <div className="flex-[1_1_320px] min-w-0 flex flex-col gap-2">
              <p className="font-display font-medium text-[26px] leading-[1.12] tracking-[-0.03em] text-ink">
                {site.ownerName}
              </p>
              <p className="text-muted">
                {labels?.authorBio || site.tagline}{' '}
                <Link
                  href="/about"
                  className="text-accent underline underline-offset-4 decoration-1 hover:text-ink"
                >
                  {authorLink}
                </Link>
                .
              </p>
            </div>
          </div>
        </article>

        <aside className="rv flex-[1_1_260px] min-w-0 flex flex-col gap-10">
          {headings.length ? (
            <nav
              aria-label={labels?.tocLabel || 'In this article'}
              className="wipe flex flex-col gap-0.5 pt-5 border-t border-ink text-[16px]"
            >
              <p className="pb-2 text-[15px] text-muted">{labels?.tocLabel || 'In this article'}</p>
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className="inline-flex items-center min-h-[44px] hover:text-accent"
                >
                  {h.text}
                </a>
              ))}
            </nav>
          ) : null}
          {service ? (
            <Link
              href={`/services/${service.slug}`}
              className="case flex flex-col gap-2.5 p-6 rounded-xl bg-fill"
            >
              <p className="text-[15px] text-muted">{labels?.relatedServiceLabel || 'Related service'}</p>
              <h3 className={cardTitle}>{service.title}</h3>
              <p className="text-[16px] text-muted">{service.summary}</p>
            </Link>
          ) : null}
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 text-[14px] text-body">
              {post.tags.map((t) => (
                <span key={t.id ?? t.tag} className="px-3 py-1.5 rounded-full border border-line">
                  {t.tag}
                </span>
              ))}
            </div>
          ) : null}
        </aside>
      </section>

      {prev || next ? (
        <section className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-8 pt-28 lg:pt-[136px] pb-[60px]">
          {prev ? (
            <Link
              href={`/journal/${prev.slug}`}
              className="case case-arrow rule2 wipe flex flex-col gap-3 pt-[22px] pr-8"
            >
              <p className="text-[15px] text-muted">{labels?.previousLabel || 'Previous'}</p>
              <h3 className={`max-w-[560px] ${cardTitle}`}>{prev.title}</h3>
            </Link>
          ) : (
            <div aria-hidden="true" />
          )}
          {next ? (
            <Link
              href={`/journal/${next.slug}`}
              className="case rule2 wipe flex flex-col gap-3 pt-[22px] md:items-end md:text-right"
            >
              <p className="text-[15px] text-muted">{labels?.nextLabel || 'Next'}</p>
              <h3 className={`max-w-[560px] ${cardTitle}`}>{next.title}</h3>
            </Link>
          ) : null}
        </section>
      ) : (
        <div className="pb-24 lg:pb-[136px]" />
      )}

      <Marquee items={marquee} label={page.marquee?.label ?? 'Businesses we’ve built for'} />
    </div>
  )
}
