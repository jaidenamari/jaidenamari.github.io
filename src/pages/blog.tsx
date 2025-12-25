import { PostCard } from '@/components/post-card'
import { getAllPosts } from '@/lib/blog'
import { PageHeader } from '@/components/page-header'

export function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="container mx-auto px-4 py-24 relative">
      <div className="absolute top-0 right-0 w-full h-64 opacity-20 -z-10 bg-gradient-to-b from-purple-900/50 to-cyan-900/50"></div>

      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>

      <PageHeader
        title="Blog"
        description="Explorations in cybersecurity, code, and adventures both online and offline."
        gradient="from-primary to-cyan-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}

