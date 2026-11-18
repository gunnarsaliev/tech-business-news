/** URL of a category's listing page. */
export function categoryPath(categoryId: string) {
  return `/${categoryId}`
}

/** Canonical URL of a post: under its main category, or at the root when it has none. */
export function postPath(post: { id: string; categoryId: string }) {
  return post.categoryId ? `/${post.categoryId}/${post.id}` : `/${post.id}`
}

/** Generated sharing card (app/og) for a post that has no image of its own. */
export function ogImagePath(post: { id: string; categoryId: string }) {
  return `/og${postPath(post)}`
}
