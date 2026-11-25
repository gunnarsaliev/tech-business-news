import Link from 'next/link'
import { ArrowUp } from 'lucide-react'
import { CookieSettingsButton } from '@/components/cookie-settings-button'
import type { NavItem } from '@/components/site-header'
import { TRUST_PAGES } from '@/lib/site'

/** Site-wide footer: brand, category links and a way back to the top. */
export function SiteFooter({ siteName, items }: { siteName: string; items: NavItem[] }) {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/60">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" aria-label={`${siteName} home`} className="flex items-center gap-2">
              <span className="relative grid size-[18px] place-items-center" aria-hidden="true">
                <span className="absolute left-0 top-0 size-3 rounded-[2px] bg-slate-300" />
                <span className="absolute bottom-0 right-0 size-3 rounded-[2px] border border-slate-500 bg-white" />
              </span>
              <span className="text-sm font-semibold tracking-[-0.03em] text-slate-900">{siteName}</span>
            </Link>
            <p className="mt-2 text-sm text-slate-500">Technology and business stories that matter.</p>
          </div>

          {items.length > 0 && (
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-slate-950">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200/70 pt-5 text-xs text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <span>
              © {new Date().getFullYear()} {siteName}
            </span>
            <nav aria-label="About and policies">
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {TRUST_PAGES.map((page) => (
                  <li key={page.path}>
                    <Link className="transition-colors hover:text-slate-950" href={page.path}>
                      {page.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <CookieSettingsButton className="cursor-pointer transition-colors hover:text-slate-950" />
                </li>
              </ul>
            </nav>
          </div>
          <a href="#top" className="inline-flex items-center gap-1 transition-colors hover:text-slate-950">
            Back to top <ArrowUp aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
