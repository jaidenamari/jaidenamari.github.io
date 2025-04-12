"use client"

import { Post } from "@/lib/blog"
import { Markdown } from "@/components/markdown"
import { formatDate } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function PostPageClient({ post }: { post: Post }) {
  return (
    <div className="container mx-auto px-4 py-24 relative">
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>

      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="h-full w-full bg-[linear-gradient(to_right,#8A2BE2_1px,transparent_1px),linear-gradient(to_bottom,#8A2BE2_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <Link href="/blog" className="flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all posts
      </Link>

      <article className="max-w-3xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-4 font-heading">{post.title}</h1>
          <div className="flex items-center text-muted-foreground mb-6">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="mx-2">•</span>
            <span>{post.readingTime} min read</span>
          </div>
          {post.coverImage && (
            <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden border border-border/50 group">
              <img
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            </div>
          )}
        </motion.div>

        <motion.div
          className="prose prose-invert prose-cyan max-w-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Markdown content={post.content} />
        </motion.div>
      </article>
    </div>
  )
}
