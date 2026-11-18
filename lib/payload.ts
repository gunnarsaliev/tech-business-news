import type { BlogArticle, BlogAuthor, BlogCategory } from '@/components/blog/blog-types'
import type { LexicalNode } from '@/components/blog/rich-text'

/**
 * Server-side client for the Payload CMS REST API.
 *
 * PAYLOAD_API_URL          base URL of the CMS (default http://localhost:3000)
 * PAYLOAD_API_BACKUP_URL   base URL tried when PAYLOAD_API_URL is unreachable or errors (optional)
 * PAYLOAD_TENANT_ID        only show content of this tenant (default: all tenants)
 * PAYLOAD_LOCALE           content locale, e.g. "en" or "bg" (default: the CMS default)
 * PAYLOAD_FALLBACK_LOCALE  locale used for fields missing in PAYLOAD_LOCALE
 */
const API_URL = (process.env.PAYLOAD_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const BACKUP_API_URL = process.env.PAYLOAD_API_BACKUP_URL?.replace(/\/$/, '')
/** CMS base URLs in the order they are tried. */
const API_URLS = BACKUP_API_URL && BACKUP_API_URL !== API_URL ? [API_URL, BACKUP_API_URL] : [API_URL]
const TENANT_ID = process.env.PAYLOAD_TENANT_ID
const LOCALE = process.env.PAYLOAD_LOCALE
const FALLBACK_LOCALE = process.env.PAYLOAD_FALLBACK_LOCALE

/** Seconds before cached CMS responses are refreshed. */
const REVALIDATE_SECONDS = 60
const WORDS_PER_MINUTE = 200
const SUMMARY_LENGTH = 180
/** Shown for posts that have no main image in the CMS; picked by post id so neighbours differ. */
const FALLBACK_IMAGES = [
  '1518005020951-eccb494ad742',
  '1485827404703-89b55fcc595e',
  '1486406146926-c627a92ad1ab',
  '1487958449943-2429e8be8625',
  '1473968512647-3e447244af8f',
  '1511818966892-d7d671e672a2',
  '1503387762-592deb58ef4e',
  '1541888946425-d81bb19240f5',
].map((id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=75`)

type PayloadList<T> = { docs: T[]; hasNextPage?: boolean; nextPage?: number | null }

type PayloadMedia = {
  url?: string | null
  alt?: string | null
}

type PayloadCategory = {
  id: number
  slug?: string | null
  title?: string | null
  description?: string | null
}

/** An author as Payload returns it: a populated user/author document, or just its id at low depth. */
type PayloadAuthor = {
  id?: number | string
  name?: string | null
  slug?: string | null
  url?: string | null
  bio?: string | null
  description?: string | null
}

type PayloadPost = {
  id: number
  slug?: string | null
  title?: string | null
  mainImage?: PayloadMedia | number | null
  content?: { root?: LexicalNode } | null
  meta?: { title?: string | null; description?: string | null } | null
  categories?: (PayloadCategory | number)[] | null
  /** Set by the Payload website template's authors hook; preferred because it is readable without user access. */
  populatedAuthors?: PayloadAuthor[] | null
  authors?: (PayloadAuthor | number | string)[] | null
  publishedAt?: string | null
  createdAt: string
  updatedAt?: string | null
}

export type BlogPost = BlogArticle & {
  content?: LexicalNode
  metaTitle?: string
  publishedAt: string
  updatedAt: string
  authors: BlogAuthor[]
  wordCount: number
}

/** A CMS response together with the base URL that served it (relative media URLs resolve against it). */
type PayloadResult<T> = { data: T; baseUrl: string }

async function payloadFetch<T>(path: string, params: Record<string, string>): Promise<PayloadResult<T>> {
  const query = new URLSearchParams(params)
  if (TENANT_ID) query.set('where[tenant][equals]', TENANT_ID)
  if (LOCALE) query.set('locale', LOCALE)
  if (FALLBACK_LOCALE) query.set('fallback-locale', FALLBACK_LOCALE)

  const failures: string[] = []
  for (const baseUrl of API_URLS) {
    const url = `${baseUrl}/api/${path}?${query}`
    try {
      const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
      if (response.ok) return { data: (await response.json()) as T, baseUrl }
      failures.push(`${url} responded with ${response.status}`)
    } catch (cause) {
      failures.push(`${baseUrl} is unreachable (${cause instanceof Error ? cause.message : String(cause)})`)
    }
  }
  throw new Error(`Payload CMS request failed: ${failures.join('; ')}`)
}

function mediaUrl(url: string, baseUrl: string) {
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

function plainText(node: LexicalNode | undefined): string {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(plainText).join(node.type === 'root' ? ' ' : '')
}

function truncate(text: string, length: number) {
  if (text.length <= length) return text
  return `${text.slice(0, text.lastIndexOf(' ', length)).replace(/[\s.,;:!?]+$/, '')}…`
}

function toAuthors(post: PayloadPost): BlogAuthor[] {
  const source = post.populatedAuthors?.length ? post.populatedAuthors : (post.authors ?? [])
  return source.flatMap((author) => {
    if (typeof author !== 'object' || !author?.name) return []
    const description = author.bio || author.description || undefined
    return [{ name: author.name, url: author.url || undefined, description }]
  })
}

function toBlogPost(post: PayloadPost, baseUrl: string): BlogPost | null {
  // Posts without a slug or without a title in the requested locale can't be shown.
  if (!post.slug || !post.title) return null

  const text = plainText(post.content?.root).replace(/\s+/g, ' ').trim()
  const words = text ? text.split(' ').length : 0
  const categories = (post.categories ?? []).filter((item): item is PayloadCategory => typeof item === 'object')
  const image = typeof post.mainImage === 'object' ? post.mainImage : null
  const publishedAt = post.publishedAt || post.createdAt

  return {
    id: post.slug,
    title: post.title,
    categoryId: categories[0]?.slug ?? '',
    summary: post.meta?.description || truncate(text, SUMMARY_LENGTH),
    tags: categories.map((category) => category.slug).filter((slug): slug is string => Boolean(slug)),
    readTime: `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`,
    date: new Date(publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }),
    image: image?.url ? mediaUrl(image.url, baseUrl) : FALLBACK_IMAGES[post.id % FALLBACK_IMAGES.length],
    imageAlt: (image?.url && image.alt) || post.title,
    content: post.content?.root,
    metaTitle: post.meta?.title || undefined,
    publishedAt: new Date(publishedAt).toISOString(),
    updatedAt: new Date(post.updatedAt || publishedAt).toISOString(),
    authors: toAuthors(post),
    wordCount: words,
  }
}

/** Readable label for a category that has no title in the requested locale. */
function titleFromSlug(slug: string) {
  const words = slug.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** All published posts, newest first. */
export async function getPosts(): Promise<BlogPost[]> {
  const { data, baseUrl } = await payloadFetch<PayloadList<PayloadPost>>('blog', {
    depth: '1',
    limit: '100',
    sort: '-createdAt',
  })
  return data.docs.map((post) => toBlogPost(post, baseUrl)).filter((post) => post !== null)
}

/** Most posts fetched per CMS request when listing every post. */
const PAGE_SIZE = 100
/** Upper bound on pages fetched by getAllPosts, so a misbehaving CMS can't loop forever. */
const MAX_PAGES = 50

/** Every published post, newest first, across as many CMS pages as needed (for sitemaps and feeds). */
export async function getAllPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = []
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data, baseUrl } = await payloadFetch<PayloadList<PayloadPost>>('blog', {
      depth: '1',
      limit: String(PAGE_SIZE),
      page: String(page),
      sort: '-createdAt',
    })
    posts.push(...data.docs.map((post) => toBlogPost(post, baseUrl)).filter((post) => post !== null))
    if (!data.hasNextPage) break
  }
  return posts
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, baseUrl } = await payloadFetch<PayloadList<PayloadPost>>('blog', {
    depth: '1',
    limit: '1',
    'where[slug][equals]': slug,
  })
  const post = data.docs[0]
  return post ? toBlogPost(post, baseUrl) : null
}

export async function getCategories(): Promise<BlogCategory[]> {
  const { data } = await payloadFetch<PayloadList<PayloadCategory>>('blog-categories', {
    depth: '0',
    limit: '100',
  })
  return data.docs.flatMap((category) =>
    category.slug
      ? [{ id: category.slug, label: category.title || titleFromSlug(category.slug), description: category.description || undefined }]
      : [],
  )
}
