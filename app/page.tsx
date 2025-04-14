import { FeaturedPosts } from "@/components/featured-posts"
import { LatestProjects } from "@/components/latest-projects"
import { getAllPosts } from "@/lib/blog"
import { getProjects } from "@/lib/projects"
import { HeroSection } from "@/components/hero-section"
import { HeroScene } from "@/components/hero-scene"

export default async function Home() {
  const allPosts = await getAllPosts()
  const posts = allPosts.slice(0, 3)
  
  const allProjects = await getProjects()
  const projects = allProjects.slice(0, 2)

  return (
    <div>
      {/* <HeroSection /> */}
      <HeroScene />

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <FeaturedPosts posts={posts} />
        <LatestProjects projects={projects} />
      </div>
    </div>
  )
}
