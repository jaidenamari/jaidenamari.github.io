import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { PostPageClient } from "./PostPageClient"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) {
    return notFound()
  }
  return <PostPageClient post={post} />
}