import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/lib/projects'

interface LatestProjectsProps {
  projects: Project[]
}

export function LatestProjects({ projects }: LatestProjectsProps) {
  return (
    <section className="py-16 relative">
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">
            Featured <span className="text-cyan-400">Projects</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-primary mt-2"></div>
          <p className="text-muted-foreground mt-2">Showcasing my recent work</p>
        </div>
        <Button variant="ghost" asChild className="group">
          <Link to="/portfolio" className="flex items-center">
            View all
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}


