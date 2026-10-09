import Link from 'next/link'
import { Figure } from '@/components/Figure'
import { Button, ClosingCta, NumberedCard, ULink } from '@/components/ui'
import { WorkCard } from '@/components/WorkCard'
import { getFeaturedWork, getHome, getServices, getSite } from '@/lib/data'
import { cx } from '@/lib/utils'

export default async function HomePage() {
  const [home, services, work, site] = await Promise.all([getHome(), getServices(), getFeaturedWork(), getSite()])
  const hero = home.hero

  return (
    <>
      <section className="flex flex-col gap-10 pt-16 pb-14 lg:pt-24 lg:pb-[72px]">
        <h1 className="h-display max-w-[1000px]">{hero.heading}</h1>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))] gap-x-16 gap-y-8 items-start">
          <div className="flex flex-col gap-7 max-w-[560px]">
            <p className="text-[21px] leading-[1.5] text-body">{hero.intro}</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              {hero.primaryCta?.label ? <Button href={hero.primaryCta.href || '/contact'}>{hero.primaryCta.label}</Button> : null}
              {hero.secondaryCta?.label ? <ULink href={hero.secondaryCta.href || '/work'}>{hero.secondaryCta.label}</ULink> : null}
            </div>
          </div>
          {hero.facts?.length ? (
            <ul className="flex flex-col gap-2.5 text-[15px] text-muted pt-1.5 lg:justify-self-end min-w-[240px] m-0 p-0 list-none">
              {hero.facts.map((f) => (
                <li key={f.id ?? f.label} className="flex justify-between gap-6 pb-2.5 border-b border-rule">
                  <span>{f.label}</span>
                  <span>{f.value}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {home.figure?.image || home.figure?.placeholder ? (
        <Figure data={home.figure} frameClassName="min-h-[320px] lg:min-h-[540px]" className="pb-16 lg:pb-24" priority />
      ) : null}

      <section className="flex flex-col pb-16 lg:pb-24">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pb-6 text-[15px] text-faint">
          <p>{home.servicesSection?.eyebrow}</p>
          <p>{home.servicesSection?.note}</p>
        </div>
        {services.map((s, i) => (
          <Link
            key={s.id}
            href={`/services/${s.slug}`}
            className={cx(
              'row-hover grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-16 gap-y-3 py-8 border-t items-start',
              i === 0 ? 'border-ink' : 'border-rule',
              i === services.length - 1 && 'border-b border-b-ink',
            )}
          >
            <h3 className="h-row">{s.title}</h3>
            <div className="flex flex-col gap-2">
              <p className="text-[17px] text-body">{s.summary}</p>
              {s.examples ? <p className="text-[15px] text-faint">{s.examples}</p> : null}
            </div>
          </Link>
        ))}
      </section>

      {work.length ? (
        <section className="flex flex-col gap-8 pb-16 lg:pb-24">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <h2 className="h-section">{home.workSection?.heading}</h2>
            <ULink href="/work">{home.workSection?.linkLabel}</ULink>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-x-10 gap-y-12">
            {work.map((w) => (
              <WorkCard key={w.id} item={w} />
            ))}
          </div>
        </section>
      ) : null}

      {home.process?.steps?.length ? (
        <section className="flex flex-col gap-10 py-16 lg:py-[72px] border-t border-ink">
          <h2 className="h-section">{home.process.heading}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-10">
            {home.process.steps.map((step, i) => (
              <NumberedCard key={step.id ?? i} n={i + 1} title={step.title} body={step.body} />
            ))}
          </div>
        </section>
      ) : null}

      {home.about?.heading ? (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-16 gap-y-10 py-16 lg:py-[72px] border-t border-ink items-start">
          <Figure data={home.about.photo} frameClassName="w-full max-w-[320px] aspect-square" showCaption={false} sizes="320px" />
          <div className="flex flex-col gap-5 max-w-[640px]">
            <h2 className="font-serif leading-[1.1] tracking-[-0.015em]" style={{ fontSize: 'clamp(30px, 3.2vw, 40px)' }}>
              {home.about.heading}
            </h2>
            {home.about.body ? <p className="text-[18px] leading-[1.6] text-body">{home.about.body}</p> : null}
            <ULink href="/about">{home.about.linkLabel ?? 'More about how I work'}</ULink>
          </div>
        </section>
      ) : null}

      {home.testimonial?.quote ? (
        <section className="flex flex-col items-center gap-5 py-16 lg:py-[72px] border-t border-rule text-center">
          <p className="font-serif italic leading-[1.3] max-w-[860px]" style={{ fontSize: 'clamp(24px, 2.8vw, 34px)' }}>
            “{home.testimonial.quote}”
          </p>
          {home.testimonial.attribution ? <p className="text-[15px] text-faint">{home.testimonial.attribution}</p> : null}
        </section>
      ) : null}

      <ClosingCta
        heading={home.closing?.heading}
        body={home.closing?.body}
        ctaLabel={home.closing?.ctaLabel}
        secondary={site.email ? <ULink href={`mailto:${site.email}`}>{site.email}</ULink> : null}
      />
    </>
  )
}
