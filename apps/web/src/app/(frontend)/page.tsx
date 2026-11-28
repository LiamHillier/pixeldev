import type { Metadata } from 'next'
import { Fragment, type CSSProperties } from 'react'
import { BrowserFigure } from '@/components/home/BrowserFigure'
import { CaseStack } from '@/components/home/CaseStack'
import { Shot } from '@/components/home/Shot'
import {
  Button,
  ClosingCta,
  Eyebrow,
  GoLink,
  Marquee,
  NumberedCard,
  RuleStep,
  SmartLink,
  StatBand,
  TwoTone,
  ULink,
  plainHeading,
} from '@/components/ui'
import { getClientWork, getHome, getHomePage, getServices, getSite } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'
import { doc, media, serviceHref } from '@/lib/utils'
import type { Service, Work } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const [home, site] = await Promise.all([getHome(), getSite()])
  return pageMetadata({
    path: '/',
    seo: home.seo,
    title: `${site.name}: ${plainHeading(home.hero.heading)}`,
    description: home.hero.intro,
    eyebrow: home.hero.eyebrow ?? undefined,
    absoluteTitle: true,
  })
}

/** The name to show for a client: the case study's "Client" meta when it is a proper name, else the title. */
function clientName(w: Work): string {
  const client = w.caseStudy?.meta?.find((m) => m.label.toLowerCase() === 'client')?.value?.trim()
  if (client && !/^(a|an|the)\s/i.test(client)) return client
  return w.title
}

/** "Custom software and CRMs" reads as "custom software and CRMs" mid-sentence; "AI and…" stays. */
function midSentence(title: string): string {
  return /^[A-Z][a-z]/.test(title) ? title.charAt(0).toLowerCase() + title.slice(1) : title
}

/** "The tools behind it: a, b, c, and d." with each service linked. */
function ServiceLinks({ lead, services }: { lead?: string | null; services: Service[] }) {
  if (!services.length) return null
  const sep = (i: number) => {
    if (i === 0) return null
    if (i < services.length - 1) return ', '
    return services.length > 2 ? ', and ' : ' and '
  }
  return (
    <p className="rv text-[16px] text-muted">
      {lead ? `${lead} ` : null}
      {services.map((s, i) => (
        <Fragment key={s.id}>
          {sep(i)}
          <SmartLink href={serviceHref(s)} className="u text-ink">
            {midSentence(s.title)}
          </SmartLink>
        </Fragment>
      ))}
      .
    </p>
  )
}

export default async function HomePage() {
  const [home, services, clients, site] = await Promise.all([
    getHomePage(),
    getServices(),
    getClientWork(),
    getSite(),
  ])
  const { hero, familiar, approach, workSection, testimonial, process, about, closing } = home

  const figureWork = doc<Work>(home.figureWork)
  const figureImg = media(figureWork?.caseStudy?.hero?.image) ?? media(home.figure?.image)
  const names = [...new Set(clients.map(clientName))]
  const statements = familiar?.statements ?? []
  const approachSteps = approach?.steps ?? []
  const cases = (workSection?.cases ?? []).flatMap((c) => {
    const work = doc<Work>(c.work)
    return work ? [{ ...c, work }] : []
  })
  const steps = process?.steps ?? []
  const aboutParas = (about?.body ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const phone = site.business?.phone?.trim()

  return (
    <>
      {/* Hero */}
      <section className="hero-in flex flex-col gap-16 lg:gap-[136px] pt-10">
        {hero.eyebrow ? <Eyebrow>{hero.eyebrow}</Eyebrow> : null}
        <h1
          className="max-w-[1320px] font-display font-medium leading-[1.02] tracking-[-0.045em]"
          style={{ fontSize: 'clamp(44px, 6.5vw, 94px)' }}
        >
          <TwoTone text={hero.heading} />
        </h1>
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
          <p className="lead flex-[1_1_420px] max-w-[560px]">{hero.intro}</p>
          {hero.primaryCta?.label || hero.secondaryCta?.label ? (
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {hero.primaryCta?.label ? (
                <Button href={hero.primaryCta.href || '/contact'}>{hero.primaryCta.label}</Button>
              ) : null}
              {hero.secondaryCta?.label ? (
                <ULink href={hero.secondaryCta.href || '/contact'}>{hero.secondaryCta.label}</ULink>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* Lead figure, with the line that introduces the name strip */}
      {figureImg || home.figure?.caption ? (
        <BrowserFigure
          img={figureImg}
          caption={home.figure?.caption}
          note={names.length > 1 ? home.marquee?.intro : null}
        />
      ) : null}

      {/* Client names, from Work */}
      <Marquee items={names} label={home.marquee?.label || 'Businesses we’ve built for'} />

      {/* Sound familiar? */}
      {familiar?.heading || statements.length ? (
        <section
          className="band flex flex-col gap-12 lg:gap-14 pt-20 lg:pt-[104px]"
          style={{ '--bt': '40px' } as CSSProperties}
        >
          {familiar?.heading ? (
            <h2 className="rv h-section">
              <TwoTone text={familiar.heading} />
            </h2>
          ) : null}
          {statements.length ? (
            <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(270px,100%),1fr))] gap-8">
              {statements.map((s, i) => (
                <p
                  key={s.id ?? i}
                  className="rule2 wipe pt-[22px] text-[20px] lg:text-[22px] leading-[1.25] tracking-[-0.025em]"
                >
                  {s.text}
                </p>
              ))}
            </div>
          ) : null}
          {familiar?.closing ? (
            <p
              className="rv max-w-[1040px] pt-10 font-display leading-[1.2] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(24px, 2.5vw, 36px)' }}
            >
              <TwoTone text={familiar.closing} />
            </p>
          ) : null}
        </section>
      ) : null}

      {/* AI, automation and software, working together */}
      {approach?.heading || approachSteps.length ? (
        <section className="section-gap flex flex-col gap-12 lg:gap-16">
          <div className="rv flex flex-wrap items-end justify-between gap-x-16 gap-y-5">
            <h2 className="h-section flex-[1_1_520px] max-w-[820px]">
              <TwoTone text={approach?.heading} />
            </h2>
            {approach?.intro ? (
              <p className="flex-[1_1_340px] max-w-[440px] text-[18px] text-muted">
                {approach.intro}
              </p>
            ) : null}
          </div>
          {approachSteps.length ? (
            <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-10 gap-y-12">
              {approachSteps.map((s, i) => (
                <NumberedCard key={s.id ?? i} n={i + 1} title={s.title} body={s.body} size="lg" />
              ))}
            </div>
          ) : null}
          <ServiceLinks lead={approach?.toolsLead} services={services} />
        </section>
      ) : null}

      {/* Stat band */}
      <StatBand stats={home.stats} />

      {/* Case studies */}
      {cases.length ? (
        <section className="section-gap flex flex-col gap-12 lg:gap-[72px]">
          <div className="rv flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 className="h-section max-w-[900px]">
              <TwoTone text={workSection?.heading} />
            </h2>
            <GoLink href="/work">{workSection?.linkLabel || 'All case studies'}</GoLink>
          </div>
          <CaseStack cases={cases} />
        </section>
      ) : null}

      {/* Testimonial */}
      {testimonial?.quote ? (
        <section className="section-gap flex flex-col gap-12">
          <blockquote
            className="rv m-0 max-w-[1180px] font-display leading-[1.08] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(30px, 3.9vw, 56px)' }}
          >
            <span className="inkin">“{testimonial.quote}”</span>
          </blockquote>
          {testimonial.attribution || testimonial.result ? (
            <div className="rv flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
              <p className="text-[16px] text-muted">{testimonial.attribution}</p>
              {testimonial.result ? (
                <div className="flex flex-col gap-2 max-w-[420px] pt-5 border-t-2 border-accent">
                  <span className="text-[20px] leading-[1.25] font-medium tracking-[-0.02em]">
                    {testimonial.result}
                  </span>
                  {testimonial.resultNote ? (
                    <span className="text-[15px] text-muted">{testimonial.resultNote}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Working with us */}
      {steps.length ? (
        <section className="flex flex-col gap-12 lg:gap-14 pt-24 lg:pt-[132px]">
          <div className="rv flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 className="h-section">
              <TwoTone text={process?.heading} />
            </h2>
            {process?.note ? <p className="text-[18px] text-muted">{process.note}</p> : null}
          </div>
          <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-8 gap-y-10">
            {steps.map((s, i) => (
              <RuleStep key={s.id ?? i} n={i + 1} title={s.title} body={s.body} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Founder */}
      {about?.heading ? (
        <section className="section-gap flex flex-wrap items-end gap-x-[88px] gap-y-10">
          <Shot
            img={media(about.photo?.image)}
            className="rv flex-[1_1_320px] max-w-[460px] aspect-[4/5] rounded-xl bg-fill"
            sizes="(min-width: 1024px) 460px, 100vw"
          />
          <div className="rv flex-[2_1_480px] min-w-0 max-w-[700px] flex flex-col gap-[22px]">
            <h2 className="h-section pb-4">
              <TwoTone text={about.heading} />
            </h2>
            {aboutParas.map((p, i) => (
              <p key={i} className="max-w-[620px] text-[18px] leading-[1.55] text-body">
                {p}
              </p>
            ))}
            <ULink href="/about" className="self-start">
              {about.linkLabel || 'More about how we work'}
            </ULink>
          </div>
        </section>
      ) : null}

      <ClosingCta
        size="lg"
        heading={closing?.heading}
        body={closing?.body}
        ctaLabel={closing?.ctaLabel}
        secondary={
          closing?.secondaryCta?.label || phone ? (
            <>
              {closing?.secondaryCta?.label ? (
                <ULink href={closing.secondaryCta.href || '/contact'}>
                  {closing.secondaryCta.label}
                </ULink>
              ) : null}
              {phone ? (
                <ULink href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
                  {`${closing?.phoneLabel || 'Or call'} ${phone}`}
                </ULink>
              ) : null}
            </>
          ) : null
        }
      />
    </>
  )
}
