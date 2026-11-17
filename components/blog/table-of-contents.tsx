import type { ArticleHeading } from '@/components/blog/rich-text'

export function TableOfContents({ headings }: { headings: ArticleHeading[] }) {
  if (headings.length === 0) return null

  return (
    <nav aria-labelledby="toc-heading">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500" id="toc-heading">
        On this page
      </h2>
      <ul className="mt-3 flex flex-col gap-2 border-l border-slate-200 text-sm">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              className={`-ml-px block border-l border-transparent text-slate-600 hover:border-sky-600 hover:text-sky-700 ${heading.level === 3 ? 'pl-6' : 'pl-3'}`}
              href={`#${heading.id}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
