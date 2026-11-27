import Link from 'next/link'
import type { Service, Site } from '@/payload-types'
import { Container, SmartLink } from './ui'

export function Footer({ site, services }: { site: Site; services: Service[] }) {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-rule [&_a]:text-muted [&_a:hover]:text-accent [&_a]:transition-colors">
      <Container className="flex flex-col gap-14 pt-16 pb-10 text-[16px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(210px,100%),1fr))] gap-x-8 gap-y-9">
          <div className="flex flex-col gap-2.5 text-muted">
            <p className="font-display text-[24px] font-semibold tracking-[-0.04em] text-ink">
              {site.name}
            </p>
            {site.tagline ? <p className="max-w-[280px]">{site.tagline}</p> : null}
            {site.locationLine ? <p>{site.locationLine}</p> : null}
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-[14px] font-medium text-ink">Services</p>
            {services.map((s) => (
              <Link key={s.id} href={`/services/${s.slug}`}>
                {s.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-[14px] font-medium text-ink">{site.name}</p>
            <Link href="/work">Work</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          {site.products?.length ? (
            <div className="flex flex-col gap-2.5">
              <p className="text-[14px] font-medium text-ink">Products</p>
              {site.products.map((p) => (
                <SmartLink key={p.id ?? p.href} href={p.href}>
                  {p.label}
                </SmartLink>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-3 pt-6 border-t border-rule text-[14px] text-muted">
          <p>
            © {year} {site.name}.{site.ownerName ? ` ${site.ownerName}, sole trader.` : ''}
            {site.abn ? ` ABN ${site.abn}.` : ''}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {site.legalLinks?.map((l) => (
              <SmartLink key={l.id ?? l.href} href={l.href}>
                {l.label}
              </SmartLink>
            ))}
            {site.linkedin ? <a href={site.linkedin}>LinkedIn</a> : null}
          </div>
        </div>
      </Container>
    </footer>
  )
}
