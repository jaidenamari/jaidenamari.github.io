import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield, Code, Terminal } from "lucide-react"

export function Hero() {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#8A2BE2_1px,transparent_1px),linear-gradient(to_bottom,#8A2BE2_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      {/* Glowing orb effect */}
      <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/20 blur-[100px]"></div>
      <div className="absolute bottom-1/3 left-1/3 h-64 w-64 rounded-full bg-cyan-500/20 blur-[100px]"></div>

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-border/40 bg-background/80 px-3 py-1 text-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span>Security Engineer & Cybersecurity Enthusiast</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Exploring the <span className="text-primary">Digital Frontier</span> & Beyond
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Insights on cybersecurity, code, and adventures both online and offline. From reverse engineering to forest
            exploration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/blog">
                Read the Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-background/50 backdrop-blur-sm border border-border/40 rounded-lg p-6 hover:border-primary/50 transition-colors">
            <Shield className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cybersecurity</h3>
            <p className="text-muted-foreground">
              Exploring vulnerabilities, threat hunting, and security research findings.
            </p>
          </div>

          <div className="bg-background/50 backdrop-blur-sm border border-border/40 rounded-lg p-6 hover:border-primary/50 transition-colors">
            <Code className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Development</h3>
            <p className="text-muted-foreground">
              Web application development, secure coding practices, and programming insights.
            </p>
          </div>

          <div className="bg-background/50 backdrop-blur-sm border border-border/40 rounded-lg p-6 hover:border-primary/50 transition-colors">
            <Terminal className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Homelab</h3>
            <p className="text-muted-foreground">
              Setting up environments for reverse engineering and security testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
