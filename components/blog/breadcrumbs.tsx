import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export type BreadcrumbItem = {
  label: string
  /** Items without a link are shown as plain text. */
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li className="flex min-w-0 items-center gap-1.5" key={`${item.label}-${index}`}>
              {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-slate-300" />}
              {item.href ? (
                <Link className="font-medium text-sky-700 hover:text-sky-800" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'max-w-[60vw] truncate text-slate-700' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
