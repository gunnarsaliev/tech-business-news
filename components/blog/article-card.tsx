import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import type { BlogArticle } from '@/components/blog/blog-types'

export function ArticleCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  return (
    <article className={`group relative overflow-hidden rounded-[20px] border border-slate-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-30px_rgba(15,67,125,0.28)] ${featured ? 'md:col-span-2' : ''}`}>
      <div className={`relative overflow-hidden bg-slate-100 ${featured ? 'aspect-[2.15]' : 'aspect-[1.55]'}`}>
        {article.image && (
          <Image
            alt={article.imageAlt}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            fill
            sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            src={article.image}
          />
        )}
        {article.categoryId && (
          <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-sky-700 backdrop-blur-sm">
            {article.categoryId.replace('-', ' ')}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-medium text-sky-700">
          {article.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em] text-slate-900">
            <Link className="after:absolute after:inset-0 after:content-['']" href={`/${article.id}`}>{article.title}</Link>
          </h3>
          <ArrowUpRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-600" />
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{article.summary}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Clock3 aria-hidden="true" className="size-3.5" />
          <span>{article.timeAgo ?? article.date}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  )
}
