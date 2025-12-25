export interface Project {
  id: string
  title: string
  description: string
  image?: string
  technologies?: string[]
  demoUrl?: string
  githubUrl?: string
}

export function getProjects(): Project[] {
  return [
    {
      id: 'mikro-multi-tenant',
      title: 'Mikro ORM Multi-Tenant',
      description:
        'A multi-tenant application framework for building scalable and secure applications.',
      image: '/images/blog-covers/cyberpunk-forest-blog-setup.png',
      technologies: ['MikroORM', 'PostgreSQL', 'Express', 'Typescript', 'Docker'],
      githubUrl: 'https://github.com/jaidenamari/mikro-multi-tenant',
    },
    {
      id: 'artifact-container-deployment',
      title: 'Artifact Container Deployment Pipeline',
      description:
        'A immutable artifact container deployment pipeline using GitHub Actions.',
      image: '/images/blog-covers/cheng-feng-red-wet.jpg',
      technologies: ['Docker', 'GitHub', 'Workflows', 'Typescript', 'Angular', 'Caddy'],
      githubUrl: 'https://github.com/jaidenamari/artifact-container-deployment',
    },
  ]
}


