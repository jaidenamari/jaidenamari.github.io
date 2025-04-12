import { FeaturedPosts } from "@/components/featured-posts"
import { LatestProjects } from "@/components/latest-projects"
import { getAllPosts } from "@/lib/blog"
import { getProjects } from "@/lib/projects"
import { HeroSection } from "@/components/hero-section"

export default async function Home() {
  const posts = getAllPosts().slice(0, 3)
  const projects = getProjects().slice(0, 2)

  return (
    <div>
      <HeroSection />

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <FeaturedPosts posts={posts} />
        <LatestProjects projects={projects} />
      </div>
    </div>
  )
}
