'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cx } from '@/lib/utils'

type NavItem = { label: string; href: string }

/** Nav on the left, wordmark in the middle, the contact link with its arrow dot on the right. */
export function Header({ name, nav, ctaLabel }: { name: string; nav: NavItem[]; ctaLabel: string }) {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  const contactActive = isActive('/contact')
  return (
    <header className="site-header grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-x-6 gap-y-1 py-4 lg:py-[22px] text-[16px] lg:text-[17px]">
      <nav
        aria-label="Primary"
        className="order-3 md:order-none col-span-2 md:col-span-1 flex flex-wrap items-center gap-x-6 lg:gap-x-7 -ml-px"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={cx(
              'inline-flex items-center min-h-[44px] hover:text-accent transition-colors',
              isActive(item.href) && 'u',
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/"
        className="inline-flex items-center min-h-[44px] font-display text-[24px] font-semibold tracking-[-0.04em]"
      >
        {name}
      </Link>
      <div className="flex justify-end">
        <Link
          href="/contact"
          aria-current={contactActive ? 'page' : undefined}
          className="go inline-flex items-center gap-3.5 min-h-[44px]"
        >
          <span className="u">{ctaLabel}</span>
          <span
            aria-hidden="true"
            className="dot inline-flex items-center justify-center w-[34px] h-[34px] rounded-full bg-accent text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </Link>
      </div>
    </header>
  )
}
