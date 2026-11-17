export type BlogHeroData = {
  eyebrow: string
  title: string
  accent: string
  description: string
}

export type BlogCategory = {
  id: string
  label: string
  description?: string
}

export type BlogArticle = {
  id: string
  title: string
  categoryId: string
  summary: string
  tags: string[]
  readTime: string
  date: string
  timeAgo?: string
  /** Absent when the post has no main image. */
  image?: string
  imageAlt: string
}

export type BlogHomeData = {
  hero: BlogHeroData
  categories: BlogCategory[]
  trustedBy: string[]
  spotlightArticleId: string
  articles: BlogArticle[]
}
