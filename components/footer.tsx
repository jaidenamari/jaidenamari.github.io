import Link from "next/link"
import { Github, Linkedin, Twitter, Leaf, Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-md relative z-10">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <div className="mr-2 relative w-8 h-8">
                <Shield className="absolute text-primary w-8 h-8" />
                <Leaf className="absolute text-cyan-400 w-5 h-5 left-1.5 top-1.5" />
              </div>
              <span className="text-xl font-bold font-heading">
                <span className="text-primary">Spriggan</span>
                <span className="text-cyan-400">'s Realm</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Exploring the intersection of cybersecurity, code, and adventure. Where digital wilderness meets
              technological frontiers.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-cyan-400">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-cyan-400">Connect</h3>
            <div className="flex space-x-3">
              <Link
                href="https://github.com/spriggan"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/spriggan"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com/in/spriggan"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Spriggan. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            <span className="text-cyan-400">{"</"}</span>
            <span className="text-primary">code</span>
            <span className="text-cyan-400">{">"}</span>
            {" with "}
            <span className="text-primary">♥</span>
            {" in the digital wilderness"}
          </p>
        </div>
      </div>
    </footer>
  )
}
