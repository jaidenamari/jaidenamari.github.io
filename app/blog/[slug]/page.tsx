import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { PostPageClient } from "./PostPageClient"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return notFound()
  }

  return <PostPageClient post={post} />
}
