import { FeaturedPosts } from '@/components/featured-posts'
import { LatestProjects } from '@/components/latest-projects'
import { getAllPosts } from '@/lib/blog'
import { getProjects } from '@/lib/projects'
import { HeroSection } from '@/components/hero-section'

export function HomePage() {
  const allPosts = getAllPosts()
  const posts = allPosts.slice(0, 3)
  
  const allProjects = getProjects()
  const projects = allProjects.slice(0, 2)

  return (
    <div>
      <HeroSection />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <FeaturedPosts posts={posts} />
        <LatestProjects projects={projects} />
      </div>
    </div>
  )
}

