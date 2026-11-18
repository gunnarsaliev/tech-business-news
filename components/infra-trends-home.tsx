'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export type Story = {
  slug: string
  /** Link to the story's page. */
  href: string
  category: string
  title: string
  summary: string
  date: string
  readTime: string
  image: string
  imageAlt: string
}

/** Most stories shown in the "Latest news" carousel. */
const MAX_LATEST_STORIES = 12

function StoryMeta({ story, className }: { story: Story; className?: string }) {
  return (
    <p className={className}>
      {story.date} <span className="px-1">·</span> {story.readTime}
    </p>
  )
}

function HeroStory({ story }: { story: Story }) {
  return (
    <Card className="relative isolate flex min-h-[390px] gap-0 overflow-hidden rounded-xl border-0 bg-slate-200 p-0 shadow-none ring-0 sm:min-h-[420px] lg:min-h-[430px]">
      <Image
        src={story.image}
        alt={story.imageAlt}
        fill
        // The hero image is the Largest Contentful Paint: fetch it first instead of lazily.
        loading="eager"
        fetchPriority="high"
        sizes="(max-width: 1023px) 100vw, 66vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#102023]/85 via-[#102023]/40 to-transparent" />
      <CardContent className="relative z-10 mt-auto max-w-[650px] px-5 pb-5 pt-24 text-white sm:px-7 sm:pb-7 lg:px-8 lg:pb-8">
        {story.category && (
          <p className="mb-2 text-[10px] font-medium tracking-[0.04em] text-white/80">{story.category}</p>
        )}
        <CardTitle className="line-clamp-4 max-w-[590px] font-serif text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.02] font-medium tracking-[-0.035em] text-white">
          {story.title}
        </CardTitle>
        <CardDescription className="mt-3 line-clamp-2 max-w-[440px] text-[11px] leading-[1.55] text-white/80">
          {story.summary}
        </CardDescription>
        <Button
          size="sm"
          className="mt-4 h-8 rounded-md bg-white px-3 text-[11px] font-medium text-slate-900 hover:bg-slate-100"
          nativeButton={false}
          render={<Link href={story.href} />}
        >
          Read story
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  )
}

function FeaturedAside({ feature, links }: { feature?: Story; links: Story[] }) {
  return (
    <aside aria-label="Editors' picks" className="flex flex-col gap-2.5">
      {feature && (
        <Card className="relative isolate flex min-h-[166px] gap-0 overflow-hidden rounded-xl border-0 bg-slate-300 p-0 shadow-none ring-0 sm:min-h-[190px] lg:min-h-[176px]">
          <Image
            src={feature.image}
            alt={feature.imageAlt}
            fill
            sizes="(max-width: 1023px) 100vw, 28vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <CardContent className="relative z-10 mt-auto px-3.5 pb-3.5 pt-16 text-white sm:px-4 sm:pb-4">
            {feature.category && <p className="text-[10px] leading-4 text-white/75">{feature.category}</p>}
            <CardTitle className="mt-0.5 line-clamp-3 text-[13px] leading-[1.25] font-medium text-white">
              <Link href={feature.href} className="after:absolute after:inset-0">
                {feature.title}
              </Link>
            </CardTitle>
            <StoryMeta story={feature} className="mt-1.5 text-[9px] text-white/75" />
          </CardContent>
        </Card>
      )}

      {links.length > 0 && (
        <div className="flex flex-1 flex-col divide-y divide-slate-200/80 rounded-xl bg-slate-50/70 px-3.5 sm:px-4">
          {links.map((story) => (
            <FeaturedLink key={story.slug} story={story} />
          ))}
        </div>
      )}
    </aside>
  )
}

function FeaturedLink({ story }: { story: Story }) {
  return (
    <article className="relative flex flex-1 flex-col justify-center gap-1.5 py-3 sm:py-3.5">
      {story.category && <p className="text-[9px] leading-none text-slate-500">{story.category}</p>}
      <h3 className="line-clamp-2 text-[12px] leading-[1.3] font-medium tracking-[-0.01em] text-slate-900">
        <Link href={story.href} className="after:absolute after:inset-0 hover:underline">
          {story.title}
        </Link>
      </h3>
      <StoryMeta story={story} className="text-[9px] text-slate-500" />
    </article>
  )
}

function LatestNews({ stories }: { stories: Story[] }) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollStories = (direction: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: direction === 'right' ? 360 : -360, behavior: 'smooth' })
  }

  return (
    <section id="latest" aria-labelledby="latest-heading" className="scroll-mt-24 pt-8 sm:pt-9 lg:pt-10">
      <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
        <div>
          <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:hidden">The latest</p>
          <h2 id="latest-heading" className="font-serif text-[27px] leading-none tracking-[-0.035em] text-slate-950 sm:text-[30px]">
            Latest news.
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="icon-sm"
            variant="outline"
            className="rounded-md border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label="Scroll to previous stories"
            onClick={() => scrollStories('left')}
          >
            <ArrowLeft />
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            className="rounded-md border-slate-400 bg-white text-slate-950 hover:bg-slate-50"
            aria-label="Scroll to more stories"
            onClick={() => scrollStories('right')}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        aria-label="Latest articles"
      >
        {stories.map((story) => (
          <article key={story.slug} className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]">
            <Card className="relative h-full gap-0 overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none ring-0">
              <div className="relative aspect-[1.35] overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(max-width: 639px) 78vw, (max-width: 1023px) 46vw, 22vw"
                  className="object-cover transition-transform duration-500 group-hover/card:scale-[1.04]"
                />
              </div>
              <CardHeader className="gap-1 px-0 pt-3 pb-0">
                {story.category && <p className="text-[9px] leading-none text-slate-500">{story.category}</p>}
                <CardTitle className="line-clamp-3 text-[13px] leading-[1.25] font-medium tracking-[-0.015em] text-slate-950 sm:text-[14px]">
                  <Link href={story.href} className="after:absolute after:inset-0">
                    {story.title}
                  </Link>
                </CardTitle>
                <CardDescription className="pt-0.5 text-[9px] text-slate-500">
                  {story.date} <span className="px-1">·</span> {story.readTime}
                </CardDescription>
              </CardHeader>
            </Card>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function InfraTrendsHome({
  siteName,
  stories,
}: {
  /** The page's h1; visually hidden because the header already shows the brand. */
  siteName: string
  /** Newest first. */
  stories: Story[]
}) {
  const [hero, feature, ...rest] = stories
  const links = rest.slice(0, 3)
  const latest = rest.slice(3, 3 + MAX_LATEST_STORIES)

  return (
    <main className="flex-1 bg-white text-slate-950">
      <h1 className="sr-only">{siteName}: latest technology and business news</h1>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="px-3.5 pb-7 pt-2.5 sm:px-6 sm:pb-9 sm:pt-3 lg:px-7">
          {hero ? (
            <>
              <section aria-label="Featured stories" className="grid grid-cols-1 gap-2.5 lg:grid-cols-[minmax(0,2.7fr)_minmax(190px,1fr)]">
                <HeroStory story={hero} />
                <FeaturedAside feature={feature} links={links} />
              </section>
              {latest.length > 0 && <LatestNews stories={latest} />}
            </>
          ) : (
            <p className="px-2 py-24 text-center text-sm text-slate-500">
              No stories to show right now. Please check back soon.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
