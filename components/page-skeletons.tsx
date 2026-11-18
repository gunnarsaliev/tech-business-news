import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loading placeholders shown by loading.tsx while a page streams in.
 * Each mirrors the real page's layout so nothing jumps when the content arrives.
 */

const LATEST_PLACEHOLDERS = 4
const CARD_PLACEHOLDERS = 6
const PARAGRAPH_PLACEHOLDERS = 3

/** Announces the loading state to screen readers; the skeleton shapes themselves are hidden from them. */
function LoadingStatus({ label }: { label: string }) {
  return (
    <p className="sr-only" role="status">
      {label}
    </p>
  )
}

function BreadcrumbsSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-40" />
    </div>
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-100 bg-white">
      <Skeleton className="aspect-[1.55] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="mt-1 h-4 w-full" />
        <Skeleton className="mt-2 h-3 w-28" />
      </div>
    </div>
  )
}

/** Home page: hero story, editors' picks and the latest-news carousel. */
export function HomeSkeleton() {
  return (
    <main aria-busy="true" className="flex-1 bg-white">
      <LoadingStatus label="Loading the latest stories…" />
      <div aria-hidden="true" className="mx-auto w-full max-w-[1280px] px-3.5 pb-7 pt-2.5 sm:px-6 sm:pb-9 sm:pt-3 lg:px-7">
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[minmax(0,2.7fr)_minmax(190px,1fr)]">
          <Skeleton className="min-h-[390px] rounded-xl sm:min-h-[420px] lg:min-h-[430px]" />
          <div className="flex flex-col gap-2.5">
            <Skeleton className="min-h-[166px] rounded-xl sm:min-h-[190px] lg:min-h-[176px]" />
            <div className="flex flex-1 flex-col gap-5 rounded-xl bg-slate-50/70 p-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div className="flex flex-col gap-2" key={index}>
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 sm:pt-9 lg:pt-10">
          <Skeleton className="mb-5 h-8 w-44 sm:mb-6" />
          <div className="flex gap-3 overflow-hidden sm:gap-4">
            {Array.from({ length: LATEST_PLACEHOLDERS }, (_, index) => (
              <div className="w-[78%] shrink-0 sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]" key={index}>
                <Skeleton className="aspect-[1.35] w-full rounded-lg" />
                <Skeleton className="mt-3 h-2.5 w-16" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1.5 h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

/** Article page: breadcrumbs, centred title block, hero image, and body with the sidebar. */
export function ArticleSkeleton() {
  return (
    <main aria-busy="true" className="flex-1 bg-white">
      <LoadingStatus label="Loading story…" />
      <div aria-hidden="true" className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6 md:pt-10 lg:px-7">
        <BreadcrumbsSkeleton />

        <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center gap-4">
          <Skeleton className="h-10 w-full max-w-3xl md:h-14" />
          <Skeleton className="h-10 w-2/3 max-w-2xl md:h-14" />
          <Skeleton className="mt-2 h-5 w-full max-w-2xl" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="mt-4 mb-8 aspect-video w-full rounded-lg" />
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
          <div className="flex flex-col gap-8">
            {Array.from({ length: PARAGRAPH_PLACEHOLDERS }, (_, index) => (
              <div className="flex flex-col gap-3" key={index}>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
          <div className="hidden flex-col gap-3 lg:flex">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-4/6" />
          </div>
        </div>
      </div>
    </main>
  )
}

/** Category page: breadcrumbs, title and a grid of article cards. */
export function CategorySkeleton() {
  return (
    <main aria-busy="true" className="flex-1 bg-white">
      <LoadingStatus label="Loading stories…" />
      <div aria-hidden="true" className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6 md:pt-10 lg:px-7">
        <BreadcrumbsSkeleton />
        <Skeleton className="mt-8 h-10 w-64 md:h-12" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: CARD_PLACEHOLDERS }, (_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  )
}
