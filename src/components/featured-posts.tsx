import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Post } from '@/lib/blog'

interface FeaturedPostsProps {
  posts: Post[]
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <section className="py-16 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">
            Latest <span className="text-primary">Articles</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-cyan-500 mt-2"></div>
          <p className="text-muted-foreground mt-2">Recent explorations and findings</p>
        </div>
        <Button variant="ghost" asChild className="group">
          <Link to="/blog" className="flex items-center">
            View all
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}


