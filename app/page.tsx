import InfraTrendsHome, { type Story } from '@/components/infra-trends-home'
import { getCategories, getPosts } from '@/lib/payload'
import { postPath } from '@/lib/routes'

export default async function Page() {
  let stories: Story[] = []

  try {
    const [posts, allCategories] = await Promise.all([getPosts(), getCategories()])
    const labels = new Map(allCategories.map((category) => [category.id, category.label]))

    // Only the fields the home page shows are sent to the browser, not the article bodies.
    stories = posts.map((post) => ({
      slug: post.id,
      href: postPath(post),
      category: labels.get(post.categoryId) ?? '',
      title: post.title,
      summary: post.summary,
      date: post.date,
      readTime: post.readTime,
      image: post.image ?? '',
      imageAlt: post.imageAlt,
    }))
  } catch (error) {
    // The home page still renders (with an empty state) while the CMS is unreachable.
    console.error(error)
  }

  return <InfraTrendsHome stories={stories} />
}
