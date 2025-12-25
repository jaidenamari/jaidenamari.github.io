export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  coverImage?: string
  tags?: string[]
  readingTime: number
  draft?: boolean
}

import postsData from '@/data/posts.json'

export function getAllPosts(): Post[] {
  return postsData.posts as Post[]
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find(post => post.slug === slug)
}


