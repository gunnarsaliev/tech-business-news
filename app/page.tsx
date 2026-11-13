import { BlogHome } from '@/components/blog/blog-home'
import type { BlogHomeData } from '@/components/blog/blog-types'
import blogData from '@/lib/blog-data.json'
import { getCategories, getPosts } from '@/lib/payload'

export default async function Page() {
  const [articles, categories] = await Promise.all([getPosts(), getCategories()])

  // Hero copy and brand list stay local; stories and categories come from Payload CMS.
  const data: BlogHomeData = {
    hero: blogData.hero,
    trustedBy: blogData.trustedBy,
    categories: [{ id: 'all', label: 'All' }, ...categories],
    spotlightArticleId: articles[0]?.id ?? '',
    // The rich text body is only needed on the article page.
    articles: articles.map((article) => ({ ...article, content: undefined, metaTitle: undefined })),
  }

  return <BlogHome data={data} />
}

