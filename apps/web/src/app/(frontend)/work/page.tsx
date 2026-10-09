import type { Metadata } from 'next'
import { PageHeader, StatRow, ULink } from '@/components/ui'
import { WorkCard, WorkRow } from '@/components/WorkCard'
import { getWork, getWorkPage } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWorkPage()
  return { title: 'Work', description: page.intro ?? undefined }
}

export default async function WorkIndex() {
  const [page, all] = await Promise.all([getWorkPage(), getWork()])
  const products = all.filter((w) => w.kind === 'product')
  const clients = all.filter((w) => w.kind === 'client')
  const anonymised = all.filter((w) => w.kind === 'anonymised')

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} className="lg:pb-16">
        <div className="flex flex-wrap gap-x-7 gap-y-2 text-[16px]">
          {products.length ? <ULink href="#products">{page.products?.heading}</ULink> : null}
          {clients.length ? <ULink href="#clients">{page.clients?.heading}</ULink> : null}
          {anonymised.length ? <ULink href="#anonymised">{page.anonymised?.heading}</ULink> : null}
        </div>
      </PageHeader>

      {products.length ? (
        <section id="products" className="flex flex-col gap-10 pt-16 pb-24 border-t border-ink scroll-mt-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-x-16 gap-y-4 items-start">
            <h2 className="h-section">{page.products?.heading}</h2>
            {page.products?.intro ? <p className="text-[17px] text-body max-w-[520px]">{page.products.intro}</p> : null}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-10 gap-y-12">
            {products.map((w) => (
              <WorkCard key={w.id} item={w} showStats showCategory />
            ))}
          </div>
        </section>
      ) : null}

      {clients.length ? (
        <section id="clients" className="flex flex-col gap-10 pt-16 pb-24 border-t border-ink scroll-mt-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-x-16 gap-y-4 items-start">
            <h2 className="h-section">{page.clients?.heading}</h2>
            <div className="flex flex-col gap-2 max-w-[520px]">
              {page.clients?.intro ? <p className="text-[17px] text-body">{page.clients.intro}</p> : null}
              {page.clients?.note ? <p className="text-[14px] text-faint">{page.clients.note}</p> : null}
            </div>
          </div>
          <div className="flex flex-col">
            {clients.map((w, i) => (
              <WorkRow key={w.id} item={w} last={i === clients.length - 1} />
            ))}
          </div>
        </section>
      ) : null}

      {anonymised.length ? (
        <section id="anonymised" className="flex flex-col gap-10 pt-16 pb-24 border-t border-ink scroll-mt-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-x-16 gap-y-4 items-start">
            <h2 className="h-section">{page.anonymised?.heading}</h2>
            {page.anonymised?.intro ? <p className="text-[17px] text-body max-w-[520px]">{page.anonymised.intro}</p> : null}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-10">
            {anonymised.map((w) => (
              <div key={w.id} className="flex flex-col gap-3.5 pt-5 border-t border-ink">
                {w.category ? <p className="text-[14px] text-faint">{w.category}</p> : null}
                <h3 className="text-[28px] leading-[1.15] tracking-[-0.01em]">{w.title}</h3>
                <p className="text-[16px] text-body">{w.summary}</p>
                <StatRow stats={w.stats} className="mt-auto" />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
