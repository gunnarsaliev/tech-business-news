'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type NavItem = {
  label: string
  href: string
}

/** Site-wide header: brand, category navigation and the mobile menu. */
export function SiteHeader({ siteName, items }: { siteName: string; items: NavItem[] }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // A category is current on its own page and on the posts under it.
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="relative mx-auto flex min-h-14 w-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:min-h-[62px] sm:px-6 lg:px-7">
        <Link href="/" aria-label={`${siteName} home`} className="flex shrink-0 items-center gap-2">
          <span className="relative grid size-[18px] place-items-center" aria-hidden="true">
            <span className="absolute left-0 top-0 size-3 rounded-[2px] bg-slate-300" />
            <span className="absolute bottom-0 right-0 size-3 rounded-[2px] border border-slate-500 bg-white" />
          </span>
          <span className="text-sm font-semibold tracking-[-0.03em] text-slate-900">{siteName}</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex xl:gap-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              className="whitespace-nowrap text-[13px] text-slate-600 transition-colors hover:text-slate-950 aria-[current]:font-medium aria-[current]:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button size="sm" className="h-8 rounded-md bg-slate-950 px-3 text-xs font-medium text-white hover:bg-slate-800">
            Subscribe
          </Button>
          {items.length > 0 && (
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-slate-200 bg-white p-3 shadow-lg lg:hidden"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 aria-[current]:bg-slate-100 aria-[current]:font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
