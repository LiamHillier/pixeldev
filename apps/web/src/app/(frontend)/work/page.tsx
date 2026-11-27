import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import { ClosingCta, Eyebrow, Marquee, TwoTone, ULink, plainHeading } from '@/components/ui'
import { WorkAnon, WorkCard, WorkRow } from '@/components/WorkCard'
import { tintAt } from '@/components/work/ShotFrame'
import { JsonLd } from '@/components/JsonLd'
import { getWork, getWorkPage } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'
import { cx } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWorkPage()
  return pageMetadata({
    path: '/work',
    seo: page.seo,
    title: 'Work',
    heading: plainHeading(page.heading),
    eyebrow: page.eyebrow,
    description: page.intro,
  })
}

function GroupHeader({
  heading,
  intro,
  note,
}: {
  heading?: string | null
  intro?: string | null
  note?: string | null
}) {
  return (
    <div className="rv flex flex-wrap items-end justify-between gap-x-16 gap-y-5">
      <h2 className="h-section flex-[1_1_480px]">
        <TwoTone text={heading} />
      </h2>
      {intro || note ? (
        <div className="flex-[1_1_340px] max-w-[480px] flex flex-col gap-2.5">
          {intro ? <p className="text-[18px] text-muted">{intro}</p> : null}
          {note ? <p className="text-[14px] text-muted">{note}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

function Group({
  id,
  children,
  className,
  style,
}: {
  id: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <section id={id} className={cx('flex flex-col gap-12 lg:gap-14', className)} style={style}>
      {children}
    </section>
  )
}

const grid = 'stagger grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-8 gap-y-12'

export default async function WorkIndex() {
  const [page, all] = await Promise.all([getWorkPage(), getWork()])
  const products = all.filter((w) => w.kind === 'product')
  const clients = all.filter((w) => w.kind === 'client')
  const anonymised = all.filter((w) => w.kind === 'anonymised')
  const marquee = (page.marquee?.items ?? []).map((m) => m.name).filter(Boolean)

  const jump = [
    products.length ? { href: '#products', label: page.products?.navLabel } : null,
    clients.length ? { href: '#clients', label: page.clients?.navLabel } : null,
    anonymised.length ? { href: '#anonymised', label: page.anonymised?.navLabel } : null,
  ].filter((j): j is { href: string; label: string } => Boolean(j?.label))

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: 'Work', path: '/work' }])]} />

      <section className="hero-in flex flex-col gap-10 lg:gap-14 pt-12 lg:pt-[72px]">
        {page.eyebrow ? <Eyebrow>{page.eyebrow}</Eyebrow> : null}
        <h1 className="h-page max-w-[1200px]">
          <TwoTone text={page.heading} />
        </h1>
        {page.intro || jump.length ? (
          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
            {page.intro ? <p className="lead flex-[1_1_420px] max-w-[700px]">{page.intro}</p> : null}
            {jump.length ? (
              <nav aria-label="Jump to" className="flex flex-wrap gap-x-7 gap-y-1">
                {jump.map((j) => (
                  <ULink key={j.href} href={j.href}>
                    {j.label}
                  </ULink>
                ))}
              </nav>
            ) : null}
          </div>
        ) : null}
      </section>

      {products.length ? (
        <Group id="products" className="pt-24 lg:pt-[136px]">
          <GroupHeader heading={page.products?.heading} intro={page.products?.intro} />
          <div className={grid}>
            {products.map((w, i) => (
              <WorkCard key={w.id} item={w} tint={tintAt(i)} showStats showCategory />
            ))}
          </div>
        </Group>
      ) : null}

      {clients.length ? (
        <Group id="clients" className="pt-20 lg:pt-[110px]">
          <GroupHeader
            heading={page.clients?.heading}
            intro={page.clients?.intro}
            note={page.clients?.note}
          />
          <div className="flex flex-col gap-14 lg:gap-[72px]">
            {clients.map((w, i) => (
              <WorkRow
                key={w.id}
                item={w}
                tint={tintAt(i)}
                readLabel={page.labels?.readCaseStudy}
                soonLabel={page.labels?.comingSoon}
              />
            ))}
          </div>
        </Group>
      ) : null}

      {anonymised.length ? (
        <Group
          id="anonymised"
          className="band pt-20 lg:pt-[110px]"
          style={{ '--bt': '46px' } as CSSProperties}
        >
          <GroupHeader heading={page.anonymised?.heading} intro={page.anonymised?.intro} />
          <div className={grid}>
            {anonymised.map((w) => (
              <WorkAnon key={w.id} item={w} />
            ))}
          </div>
        </Group>
      ) : null}

      {page.closing?.heading ? (
        <ClosingCta
          heading={page.closing.heading}
          body={page.closing.body}
          ctaLabel={page.closing.ctaLabel}
        />
      ) : (
        <div className="pb-24 lg:pb-[136px]" />
      )}

      <Marquee items={marquee} label={page.marquee?.label ?? 'Businesses we’ve built for'} />
    </>
  )
}
