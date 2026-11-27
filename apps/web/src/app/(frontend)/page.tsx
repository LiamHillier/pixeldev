import type { Metadata } from 'next'
import Link from 'next/link'
import { Figure } from '@/components/Figure'
import {
  Button,
  ClosingCta,
  Eyebrow,
  GoLink,
  NumberedCard,
  TwoTone,
  ULink,
} from '@/components/ui'
import { WorkCard } from '@/components/WorkCard'
import { getFeaturedWork, getHome, getServices, getSite } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'
import { cx, media } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const [home, site] = await Promise.all([getHome(), getSite()])
  return pageMetadata({
    path: '/',
    seo: home.seo,
    title: `${site.name}: ${home.hero.heading}`,
    description: home.hero.intro,
    eyebrow: home.hero.eyebrow ?? undefined,
    absoluteTitle: true,
  })
}

export default async function HomePage() {
  const [home, services, work, site] = await Promise.all([
    getHome(),
    getServices(),
    getFeaturedWork(),
    getSite(),
  ])
  const hero = home.hero
  const steps = home.process?.steps ?? []

  return (
    <>
      <section className="flex flex-col gap-10 lg:gap-14 pt-14 lg:pt-[88px]">
        {hero.eyebrow ? <Eyebrow>{hero.eyebrow}</Eyebrow> : null}
        <h1 className="h-display max-w-[1280px]">
          <TwoTone text={hero.heading} />
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-10">
          <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-8 max-w-[660px]">
            <p className="lead">{hero.intro}</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {hero.primaryCta?.label ? (
                <Button href={hero.primaryCta.href || '/contact'}>{hero.primaryCta.label}</Button>
              ) : null}
              {hero.secondaryCta?.label ? (
                <ULink href={hero.secondaryCta.href || '/work'}>{hero.secondaryCta.label}</ULink>
              ) : null}
            </div>
          </div>
          {hero.facts?.length ? (
            <dl className="flex-[1_1_300px] max-w-[400px] m-0 flex flex-col text-[16px]">
              {hero.facts.map((f, i) => (
                <div
                  key={f.id ?? f.label}
                  className={cx(
                    'flex justify-between gap-6 py-3 border-t',
                    i === 0 ? 'border-ink' : 'border-rule',
                    i === hero.facts!.length - 1 && 'border-b border-b-rule',
                  )}
                >
                  <dt className="text-muted">{f.label}</dt>
                  <dd className="m-0 text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      {home.figure?.image || home.figure?.placeholder ? (
        <Figure
          data={home.figure}
          tint="teal"
          frameClassName={media(home.figure.image) ? undefined : 'aspect-[16/8] min-h-[240px]'}
          className="pt-14 lg:pt-20"
          priority
        />
      ) : null}

      {services.length ? (
        <section className="section-gap flex flex-col gap-10 lg:gap-14">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <h2 className="h-section">
              <TwoTone text={home.servicesSection?.eyebrow || 'What we do'} />
            </h2>
            {home.servicesSection?.note ? (
              <p className="max-w-[460px] text-[18px] text-muted">{home.servicesSection.note}</p>
            ) : null}
          </div>
          <div className="flex flex-col">
            {services.map((s, i) => (
              <Link
                key={s.id}
                href={`/services/${s.slug}`}
                className={cx(
                  'group row-hover flex flex-wrap items-start gap-x-16 gap-y-3 py-8 lg:py-10 border-t',
                  i === 0 ? 'border-t-2 border-ink' : 'border-rule',
                  i === services.length - 1 && 'border-b border-b-rule',
                )}
              >
                <h3 className="h-row flex-[1_1_360px] min-w-0">{s.title}</h3>
                <div className="flex-[1.2_1_420px] min-w-0 flex items-start justify-between gap-8">
                  <div className="flex flex-col gap-2">
                    <p className="text-[17px] text-body">{s.summary}</p>
                    {s.examples ? <p className="text-[15px] text-muted">{s.examples}</p> : null}
                  </div>
                  <span
                    aria-hidden="true"
                    className="hidden sm:inline-flex shrink-0 items-center justify-center w-[34px] h-[34px] rounded-full bg-accent text-white transition-colors group-hover:bg-ink"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {work.length ? (
        <section className="section-gap flex flex-col gap-10 lg:gap-14">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 className="h-section max-w-[900px]">
              <TwoTone text={home.workSection?.heading} />
            </h2>
            <GoLink href="/work">{home.workSection?.linkLabel ?? 'All work'}</GoLink>
          </div>
          <div
            className={cx(
              'grid gap-x-8 gap-y-14',
              work.length % 3 === 0
                ? 'grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))]'
                : 'grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))]',
            )}
          >
            {work.map((w) => (
              <WorkCard key={w.id} item={w} />
            ))}
          </div>
        </section>
      ) : null}

      {steps.length ? (
        <section className="section-gap flex flex-col gap-12 lg:gap-16">
          <h2 className="h-section">
            <TwoTone text={home.process?.heading} />
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-10 gap-y-12">
            {steps.map((step, i) => (
              <NumberedCard
                key={step.id ?? i}
                n={i + 1}
                title={step.title}
                body={step.body}
                last={i === steps.length - 1}
              />
            ))}
          </div>
        </section>
      ) : null}

      {home.about?.heading ? (
        <section className="section-gap">
          <div className="flex flex-wrap items-center gap-x-20 gap-y-10 p-6 sm:p-10 lg:p-16 rounded-xl bg-fill">
            <Figure
              data={home.about.photo}
              frameClassName="w-full aspect-square bg-white"
              className="flex-[0_1_340px] min-w-[220px]"
              showCaption={false}
              sizes="340px"
            />
            <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-6 max-w-[720px]">
              <h2 className="h-section">
                <TwoTone text={home.about.heading} />
              </h2>
              {home.about.body ? (
                <p className="text-[18px] leading-[1.6] text-body">{home.about.body}</p>
              ) : null}
              <GoLink href="/about">{home.about.linkLabel ?? 'More about how we work'}</GoLink>
            </div>
          </div>
        </section>
      ) : null}

      {home.testimonial?.quote ? (
        <section className="section-gap">
          <figure className="m-0 flex flex-col gap-8 max-w-[1100px]">
            <blockquote
              className="m-0 font-display font-medium leading-[1.15] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(28px, 3.4vw, 46px)' }}
            >
              “{home.testimonial.quote}”
            </blockquote>
            {home.testimonial.attribution ? (
              <figcaption className="text-[16px] text-muted">
                {home.testimonial.attribution}
              </figcaption>
            ) : null}
          </figure>
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
