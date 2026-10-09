'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cx } from '@/lib/utils'

type NavItem = { label: string; href: string }

export function Header({ name, nav, ctaLabel }: { name: string; nav: NavItem[]; ctaLabel: string }) {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pt-8 pb-6 border-b border-ink">
      <Link href="/" className="font-serif text-[26px] font-medium tracking-[-0.01em]">
        {name}
      </Link>
      <nav aria-label="Primary" className="flex flex-wrap gap-x-7 gap-y-2 text-[16px]">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            className={cx('hover:text-accent transition-colors', isActive(item.href) && 'text-accent')}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/contact"
          aria-current={isActive('/contact') ? 'page' : undefined}
          className={cx('link-u', isActive('/contact') && 'text-accent')}
        >
          {ctaLabel}
        </Link>
      </nav>
    </header>
  )
}
