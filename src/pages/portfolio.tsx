import { ProjectCard } from '@/components/project-card'
import { getProjects } from '@/lib/projects'
import { PageHeader } from '@/components/page-header'

export function PortfolioPage() {
  const projects = getProjects()

  return (
    <div className="container mx-auto px-4 py-24 relative">
      <div className="absolute top-0 left-0 w-full h-64 opacity-20 -z-10 bg-gradient-to-b from-cyan-900/50 to-purple-900/50"></div>

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>

      <PageHeader
        title="Portfolio"
        description="A showcase of my projects in cybersecurity, web development, and more."
        gradient="from-cyan-500 to-primary"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className="text-muted-foreground">No projects available at the moment.</p>
        )}
      </div>
    </div>
  )
}

