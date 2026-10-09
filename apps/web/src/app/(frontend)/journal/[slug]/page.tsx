import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Figure, ImageBox } from '@/components/Figure'
import { RichText } from '@/components/RichText'
import { Crumb } from '@/components/ui'
import { getAboutPage, getPost, getPosts, getSite } from '@/lib/data'
import { extractHeadings } from '@/lib/lexical'
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
  return { title: post.title, description: post.excerpt }
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const [post, posts, site, about] = await Promise.all([getPost(slug), getPosts(), getSite(), getAboutPage()])
  if (!post) notFound()

  const headings = extractHeadings(post.content)
  const service = doc<Service>(post.relatedService)
  const idx = posts.findIndex((p) => p.id === post.id)
  const prev = idx >= 0 ? posts[idx + 1] : undefined
  const next = idx > 0 ? posts[idx - 1] : undefined
  const topic = topicName(post)

  return (
    <>
      <section className="flex flex-col gap-7 pt-12 pb-12 lg:pt-16 max-w-[900px]">
        <Crumb parent="Journal" parentHref="/journal" current={topic ?? 'Article'} />
        <h1 className="h-detail" style={{ fontSize: 'clamp(36px, 4.7vw, 64px)' }}>
          {post.title}
        </h1>
        <p className="text-[22px] leading-[1.5] text-body max-w-[760px]">{post.excerpt}</p>
        <p className="text-[15px] text-faint">
          {[site.ownerName, formatDate(post.publishedAt), post.readingMinutes ? `${post.readingMinutes} minute read` : null]
            .filter(Boolean)
            .join('. ')}
          .
        </p>
      </section>

      {post.cover?.image || post.cover?.placeholder ? (
        <Figure data={post.cover} frameClassName="min-h-[260px] lg:min-h-[460px]" className="pb-16" priority />
      ) : null}

      <section className="flex flex-wrap gap-x-20 gap-y-12 pb-24">
        <article className="flex-[999_1_540px] min-w-0 max-w-[720px]">
          <RichText data={post.content} />

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-8 gap-y-5 items-start pt-8 mt-10 border-t border-ink text-[16px] leading-[1.6]">
            <ImageBox img={media(about.photo?.image)} frameClassName="w-24 aspect-square" sizes="96px" />
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <p className="font-serif text-[24px]">{site.ownerName}</p>
              <p className="text-muted">
                {site.tagline}{' '}
                <Link href="/about" className="link-u">
                  More about {site.ownerName?.split(' ')[0] ?? 'me'}
                </Link>
                .
              </p>
            </div>
          </div>
        </article>

        <aside className="flex-[1_1_240px] flex flex-col gap-10">
          {headings.length ? (
            <nav aria-label="In this article" className="flex flex-col gap-3 pt-5 border-t border-ink text-[15px]">
              <p className="text-[13px] text-faint">In this article</p>
              {headings.map((h) => (
                <a key={h.id} href={`#${h.id}`} className="hover:text-accent">
                  {h.text}
                </a>
              ))}
            </nav>
          ) : null}
          {service ? (
            <div className="flex flex-col gap-2.5 pt-5 border-t border-ink text-[15px]">
              <p className="text-[13px] text-faint">Related service</p>
              <Link href={`/services/${service.slug}`} className="row-hover flex flex-col gap-1.5">
                <h3 className="text-[26px] leading-[1.15]">{service.title}</h3>
                <p className="text-muted">{service.summary}</p>
              </Link>
            </div>
          ) : null}
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-5 border-t border-ink text-[14px] text-faint">
              {post.tags.map((t) => (
                <span key={t.id ?? t.tag}>{t.tag}</span>
              ))}
            </div>
          ) : null}
        </aside>
      </section>

      {prev || next ? (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-x-16 gap-y-8 pt-12 pb-24 border-t border-ink">
          {prev ? (
            <Link href={`/journal/${prev.slug}`} className="row-hover flex flex-col gap-2.5">
              <p className="text-[14px] text-faint">Previous</p>
              <h3 className="text-[26px] leading-[1.15] tracking-[-0.01em]">{prev.title}</h3>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/journal/${next.slug}`} className="row-hover flex flex-col gap-2.5 md:text-right md:items-end">
              <p className="text-[14px] text-faint">Next</p>
              <h3 className="text-[26px] leading-[1.15] tracking-[-0.01em]">{next.title}</h3>
            </Link>
          ) : null}
        </section>
      ) : null}
    </>
  )
}
