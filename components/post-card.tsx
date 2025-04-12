"use client"

import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/lib/blog"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden group border border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300">
        {post.coverImage && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                {tag}
              </Badge>
            ))}
          </div>
          <Link href={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors">
            <h3 className="text-xl font-semibold tracking-tight">{post.title}</h3>
          </Link>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground border-t border-border/40 pt-4">
          <div className="flex justify-between w-full">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readingTime} min read</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
