import { Sparkles } from 'lucide-react'
import type { BlogHeroData } from '@/components/blog/blog-types'

export function BlogHero({ data }: { data: BlogHeroData }) {
  return (
    <header className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <p className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/80 px-3 py-1.5 text-xs font-medium text-slate-500">
        <Sparkles aria-hidden="true" className="size-3.5 text-sky-600" />
        {data.eyebrow}
      </p>
      <h1 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.045em] text-slate-900 sm:text-4xl md:text-[46px] md:leading-[1.12]">
        {data.title} <span className="italic text-sky-600">{data.accent}</span>
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
        {data.description}
      </p>
    </header>
  )
}
