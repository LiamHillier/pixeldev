import Link from 'next/link'
import type { Service, Site } from '@/payload-types'
import { SmartLink } from './ui'

export function Footer({ site, services }: { site: Site; services: Service[] }) {
  const year = new Date().getFullYear()
  return (
    <footer className="flex flex-col gap-8 pt-10 pb-12 border-t border-ink text-[15px] [&_a]:text-muted [&_a:hover]:text-accent">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-8 gap-y-6">
        <div className="flex flex-col gap-2 text-muted">
          <p className="font-serif text-[22px] text-ink">{site.name}</p>
          {site.tagline ? <p>{site.tagline}</p> : null}
          {site.locationLine ? <p>{site.locationLine}</p> : null}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-faint">Services</p>
          {services.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}`}>
              {s.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-faint">{site.name}</p>
          <Link href="/work">Work</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        {site.products?.length ? (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] text-faint">Products</p>
            {site.products.map((p) => (
              <SmartLink key={p.id ?? p.href} href={p.href}>
                {p.label}
              </SmartLink>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap justify-between gap-x-6 gap-y-3 pt-5 border-t border-rule text-[14px] text-faint">
        <p>
          © {year} {site.name}.{site.ownerName ? ` ${site.ownerName}, sole trader.` : ''}
          {site.abn ? ` ABN ${site.abn}.` : ''}
        </p>
        <div className="flex gap-5">
          {site.legalLinks?.map((l) => (
            <SmartLink key={l.id ?? l.href} href={l.href}>
              {l.label}
            </SmartLink>
          ))}
          {site.linkedin ? <a href={site.linkedin}>LinkedIn</a> : null}
        </div>
      </div>
    </footer>
  )
}
