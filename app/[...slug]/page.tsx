import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArticleCard } from '@/components/blog/article-card'
import type { BlogCategory } from '@/components/blog/blog-types'
import { Breadcrumbs } from '@/components/blog/breadcrumbs'
import { getHeadings, RichText } from '@/components/blog/rich-text'
import { ShareButtons } from '@/components/blog/share-buttons'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { Blogpost1 } from '@/components/blogpost1'
import { type BlogPost, getCategories, getPostBySlug, getPosts } from '@/lib/payload'
import { categoryPath, postPath } from '@/lib/routes'

/**
 * Renders every content URL of the site:
 *   /<category>          a category's posts
 *   /<category>/<post>   a post (its canonical URL)
 *   /<post>              a post without a category
 */
type ContentPageProps = {
  params: Promise<{ slug: string[] }>
}

type ContentRoute =
  | { type: 'category'; category: BlogCategory; categories: BlogCategory[] }
  | { type: 'post'; post: BlogPost; categories: BlogCategory[] }

const RELATED_POSTS = 3

async function resolveRoute(segments: string[]): Promise<ContentRoute | null> {
  if (segments.length > 2) return null

  const categories = await getCategories()
  if (segments.length === 1) {
    // A category and a post could share a slug; the category wins.
    const category = categories.find((item) => item.id === segments[0])
    if (category) return { type: 'category', category, categories }
  }

  // The last segment is the post; the page redirects if the category before it is wrong.
  const post = await getPostBySlug(segments[segments.length - 1])
  return post ? { type: 'post', post, categories } : null
}

// Pages known at build time are prerendered; ones published later render on first visit.
export async function generateStaticParams() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()])
  return [...categories.map((category) => categoryPath(category.id)), ...posts.map(postPath)].map((path) => ({
    slug: path.split('/').filter(Boolean),
  }))
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { slug } = await params
  const route = await resolveRoute(slug)
  if (!route) return {}

  if (route.type === 'category') {
    return {
      title: route.category.label,
      description: route.category.description,
      alternates: { canonical: categoryPath(route.category.id) },
    }
  }

  const { post } = route
  return {
    title: post.metaTitle ?? post.title,
    description: post.summary,
    alternates: { canonical: postPath(post) },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      images: post.image ? [{ url: post.image, alt: post.imageAlt }] : undefined,
    },
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params
  const route = await resolveRoute(slug)
  if (!route) notFound()

  // Posts have one URL: reaching one through another path leads to the canonical one.
  if (route.type === 'post' && postPath(route.post) !== `/${slug.join('/')}`) {
    redirect(postPath(route.post))
  }

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto max-w-[1280px]">
        {route.type === 'category' ? (
          <CategoryView category={route.category} />
        ) : (
          <PostView categories={route.categories} post={route.post} />
        )}
      </div>
    </main>
  )
}

async function CategoryView({ category }: { category: BlogCategory }) {
  const posts = (await getPosts()).filter((post) => post.tags.includes(category.id))

  return (
    <section aria-labelledby="category-heading" className="px-4 pb-12 pt-8 sm:px-6 md:pt-10 lg:px-7">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: category.label }]} />

      <header className="mt-8 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-[-0.035em] text-pretty text-slate-900 md:text-5xl" id="category-heading">
          {category.label}
        </h1>
        {category.description && <p className="mt-3 text-lg text-slate-500">{category.description}</p>}
      </header>

      {posts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard article={post} key={post.id} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-slate-500">No stories in this category yet.</p>
      )}
    </section>
  )
}

async function PostView({ post, categories }: { post: BlogPost; categories: BlogCategory[] }) {
  const posts = await getPosts()
  const category = categories.find((item) => item.id === post.categoryId)
  const headings = post.content ? getHeadings(post.content) : []
  const others = posts.filter((item) => item.id !== post.id)
  const related = [
    ...others.filter((item) => item.categoryId === post.categoryId),
    ...others.filter((item) => item.categoryId !== post.categoryId),
  ].slice(0, RELATED_POSTS)

  return (
    <>
      <article className="px-4 pb-12 pt-8 sm:px-6 md:pt-10 lg:px-7">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            ...(category ? [{ label: category.label, href: categoryPath(category.id) }] : []),
            { label: post.title },
          ]}
        />

        <Blogpost1
          body={post.content && <RichText root={post.content} />}
          className="pb-0 pt-8"
          date={`${post.date} · ${post.readTime}`}
          datePrefix={category ? `${category.label} ·` : undefined}
          description={post.summary}
          image={post.image ? { src: post.image, alt: post.imageAlt } : undefined}
          sidebar={
            <>
              <TableOfContents headings={headings} />
              <ShareButtons title={post.title} />
            </>
          }
          title={post.title}
        />

        {post.tags.length > 0 && (
          <div className="mx-auto max-w-5xl">
            <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
              {post.tags.map((tag) => (
                <Link
                  className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50"
                  href={categoryPath(tag)}
                  key={tag}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-stories-heading" className="border-t border-slate-100 px-4 py-12 sm:px-6 lg:px-7">
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-slate-900" id="related-stories-heading">
            More stories for you
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <ArticleCard article={item} key={item.id} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
