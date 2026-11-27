import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { PageHeader, StatRow, TwoTone, ULink } from '@/components/ui'
import { WorkCard, WorkRow } from '@/components/WorkCard'
import { JsonLd } from '@/components/JsonLd'
import { getWork, getWorkPage } from '@/lib/data'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWorkPage()
  return pageMetadata({
    path: '/work',
    seo: page.seo,
    title: 'Work',
    heading: page.heading,
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
    <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-5">
      <h2 className="h-section flex-[1_1_420px]">
        <TwoTone text={heading} />
      </h2>
      {intro || note ? (
        <div className="flex-[1_1_340px] max-w-[520px] flex flex-col gap-2">
          {intro ? <p className="text-[18px] text-muted">{intro}</p> : null}
          {note ? <p className="text-[15px] text-muted">{note}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

function Group({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="section-gap flex flex-col gap-12 lg:gap-14 scroll-mt-8">
      {children}
    </section>
  )
}

export default async function WorkIndex() {
  const [page, all] = await Promise.all([getWorkPage(), getWork()])
  const products = all.filter((w) => w.kind === 'product')
  const clients = all.filter((w) => w.kind === 'client')
  const anonymised = all.filter((w) => w.kind === 'anonymised')

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: 'Work', path: '/work' }])]} />
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro}>
        <nav aria-label="Jump to" className="flex flex-wrap gap-x-7 gap-y-1">
          {products.length ? <ULink href="#products">{page.products?.heading}</ULink> : null}
          {clients.length ? <ULink href="#clients">{page.clients?.heading}</ULink> : null}
          {anonymised.length ? (
            <ULink href="#anonymised">{page.anonymised?.heading}</ULink>
          ) : null}
        </nav>
      </PageHeader>

      {products.length ? (
        <Group id="products">
          <GroupHeader heading={page.products?.heading} intro={page.products?.intro} />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-8 gap-y-14">
            {products.map((w) => (
              <WorkCard key={w.id} item={w} showStats showCategory />
            ))}
          </div>
        </Group>
      ) : null}

      {clients.length ? (
        <Group id="clients">
          <GroupHeader
            heading={page.clients?.heading}
            intro={page.clients?.intro}
            note={page.clients?.note}
          />
          <div className="flex flex-col">
            {clients.map((w, i) => (
              <WorkRow key={w.id} item={w} first={i === 0} last={i === clients.length - 1} />
            ))}
          </div>
        </Group>
      ) : null}

      {anonymised.length ? (
        <Group id="anonymised">
          <GroupHeader heading={page.anonymised?.heading} intro={page.anonymised?.intro} />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
            {anonymised.map((w) => (
              <div key={w.id} className="flex flex-col gap-3.5 p-7 rounded-xl bg-fill">
                {w.category ? <p className="text-[15px] text-muted">{w.category}</p> : null}
                <h3 className="text-[26px] leading-[1.12]">{w.title}</h3>
                <p className="text-[16px] text-body">{w.summary}</p>
                <StatRow stats={w.stats} className="mt-auto border-line" />
              </div>
            ))}
          </div>
        </Group>
      ) : null}

      <div className="pb-24 lg:pb-[136px]" />
    </>
  )
}
