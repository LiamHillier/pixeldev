import type { Metadata } from 'next'
import { Figure } from '@/components/Figure'
import { ClosingCta, Eyebrow } from '@/components/ui'
import { getAboutPage } from '@/lib/data'
import { cx } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage()
  return { title: 'About', description: page.intro ?? undefined }
}

export default async function AboutPage() {
  const page = await getAboutPage()
  const background = page.background?.items ?? []
  const promises = page.promises?.items ?? []

  return (
    <>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-x-20 gap-y-12 items-start pt-16 pb-16 lg:pt-[88px] lg:pb-20">
        <div className="flex flex-col gap-7">
          {page.eyebrow ? <Eyebrow>{page.eyebrow}</Eyebrow> : null}
          <h1 className="h-detail">{page.heading}</h1>
          {page.intro ? <p className="text-[20px] leading-[1.55] text-body">{page.intro}</p> : null}
          {page.body ? <p className="text-[18px] leading-[1.6] text-body">{page.body}</p> : null}
        </div>
        <Figure data={page.photo} frameClassName="aspect-[4/5]" sizes="(min-width: 1024px) 520px, 100vw" priority />
      </section>

      {page.facts?.length ? (
        <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-8 gap-y-4 py-7 border-t border-b border-ink text-[15px]">
          {page.facts.map((f) => (
            <div key={f.id ?? f.label} className="flex flex-col gap-1">
              <dt className="text-faint">{f.label}</dt>
              <dd className="m-0">{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {background.length ? (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-x-20 gap-y-8 py-16 lg:py-[88px] items-start">
          <h2 className="h-section">{page.background?.heading}</h2>
          <div className="flex flex-col">
            {background.map((b, i) => (
              <div key={b.id ?? i} className={cx('flex flex-col gap-2 py-6 border-t border-rule', i === background.length - 1 && 'border-b')}>
                <h3 className="text-[26px] leading-[1.2]">{b.title}</h3>
                <p className="text-[16px] text-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {promises.length ? (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-x-20 gap-y-8 py-16 lg:py-20 border-t border-ink items-start">
          <h2 className="h-section">{page.promises?.heading}</h2>
          <ul className="flex flex-col m-0 p-0 list-none">
            {promises.map((p, i) => (
              <li key={p.id ?? i} className={cx('flex flex-col gap-1.5 py-5 border-t border-rule', i === promises.length - 1 && 'border-b')}>
                <span className="font-semibold text-[18px]">{p.title}</span>
                <span className="text-[16px] text-muted">{p.body}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {page.solo?.heading ? (
        <section className="flex flex-col gap-5 py-16 lg:py-20 border-t border-ink">
          <h2 className="font-serif leading-[1.1] tracking-[-0.015em] max-w-[800px]" style={{ fontSize: 'clamp(30px, 3.4vw, 44px)' }}>
            {page.solo.heading}
          </h2>
          {page.solo.body ? <p className="text-[18px] leading-[1.65] text-body max-w-[760px]">{page.solo.body}</p> : null}
        </section>
      ) : null}

      <ClosingCta heading={page.closing?.heading} body={page.closing?.body} ctaLabel={page.closing?.ctaLabel} />
    </>
  )
}
