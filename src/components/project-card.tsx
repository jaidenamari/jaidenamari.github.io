import type { Project } from '@/lib/projects'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { GitHubIcon } from '@/components/social-icons'
import { motion } from 'framer-motion'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden group border border-border/50 bg-background/50 backdrop-blur-sm hover:border-cyan-500/50 transition-colors duration-300">
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={project.image || '/placeholder.svg?height=400&width=600'}
            alt={project.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {project.technologies?.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
              >
                {tech}
              </Badge>
            ))}
          </div>
          <h3 className="text-xl font-semibold tracking-tight group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">{project.description}</p>
        </CardContent>

        <CardFooter className="flex gap-3 border-t border-border/40 pt-4">
          {project.demoUrl && (
            <Button
              variant="default"
              size="sm"
              asChild
              className="bg-gradient-to-r from-cyan-600 to-primary hover:from-cyan-700 hover:to-primary/90 border-none"
            >
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}

          {project.githubUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-950/30"
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <GitHubIcon className="mr-2 h-4 w-4" />
                Source Code
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

