export interface Project {
  id: string
  title: string
  description: string
  image?: string
  technologies?: string[]
  demoUrl?: string
  githubUrl?: string
}


export async function getProjects(): Promise<Project[]> {
  return [
    {
      id: "mikro-multi-tenant",
      title: "Mikro ORM Multi-Tenant",
      description:
        "A multi-tenant application framework for building scalable and secure applications.",
      image: "/images/blog-covers/cyberpunk-forest-blog-setup.png",
      technologies: ["MikroORM", "PostgreSQL", "Express", "Typescript", "Docker"],
      githubUrl: "https://github.com/jaidenamari/mikro-multi-tenant",
    },
    {
      id: "artifact-container-deployment",
      title: "Artifact Container Deployment Pipeline",
      description:
          "A immutable artifact container deployment pipeline using GitHub Actions.",
      image: "/images/blog-covers/cheng-feng-red-wet.jpg",
      technologies: ["Docker", "GitHub", "Workflows", "Typescript", "Angular", "Caddy"],
      githubUrl: "https://github.com/jaidenamari/artifact-container-deployment",
    },
    // {
    //   id: "webapp-security-scanner",
    //   title: "Web Application Security Scanner",
    //   description:
    //     "An automated tool for detecting common security vulnerabilities in web applications, including XSS, CSRF, and SQL injection.",
    //   image: "/placeholder.svg?height=600&width=800",
    //   technologies: ["Python", "JavaScript", "Docker"],
    //   demoUrl: "https://example.com/demo",
    //   githubUrl: "https://github.com/yourusername/webapp-security-scanner",
    // },
    // {
    //   id: "network-traffic-analyzer",
    //   title: "Network Traffic Analyzer",
    //   description:
    //     "A real-time network traffic analysis tool that helps identify suspicious patterns and potential security threats.",
    //   image: "/placeholder.svg?height=600&width=800",
    //   technologies: ["Rust", "React", "WebAssembly"],
    //   demoUrl: "https://example.com/demo",
    //   githubUrl: "https://github.com/yourusername/network-traffic-analyzer",
    // },
    // {
    //   id: "secure-chat-app",
    //   title: "End-to-End Encrypted Chat Application",
    //   description:
    //     "A secure messaging application with end-to-end encryption, perfect forward secrecy, and self-destructing messages.",
    //   image: "/placeholder.svg?height=600&width=800",
    //   technologies: ["TypeScript", "Node.js", "Signal Protocol"],
    //   githubUrl: "https://github.com/yourusername/secure-chat-app",
    // },
    // {
    //   id: "iot-security-framework",
    //   title: "IoT Security Testing Framework",
    //   description:
    //     "A comprehensive framework for testing the security of IoT devices, including firmware analysis and communication protocol testing.",
    //   image: "/placeholder.svg?height=600&width=800",
    //   technologies: ["C++", "Python", "Embedded Systems"],
    //   githubUrl: "https://github.com/yourusername/iot-security-framework",
    // },
  ]
}
