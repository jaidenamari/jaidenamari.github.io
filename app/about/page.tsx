"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24 relative">
      {/* Cyberpunk forest background */}
      <div className="absolute top-0 left-0 w-full h-64 opacity-20 -z-10 bg-gradient-to-b from-purple-900/50 to-cyan-900/50"></div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="About Spriggan"
          description="Security engineer, coder, and digital wilderness explorer."
          gradient="from-primary to-cyan-500"
        />

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-64 w-full rounded-lg overflow-hidden border border-border/50 mb-4 group">
              <img
                src="/placeholder.svg?height=400&width=300"
                alt="Profile"
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="flex space-x-2 mb-6">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-primary/50 hover:border-primary hover:bg-primary/10"
              >
                <Link href="https://github.com/spriggan" target="_blank">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-500/10"
              >
                <Link href="https://twitter.com/spriggan" target="_blank">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-primary/50 hover:border-primary hover:bg-primary/10"
              >
                <Link href="https://linkedin.com/in/spriggan" target="_blank">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>
              I'm Spriggan, a security engineer and web application developer with a passion for cybersecurity, coding,
              and exploring both digital and natural environments.
            </p>

            <p>
              My expertise spans across vulnerability assessment, penetration testing, secure coding practices, and
              building robust web applications. When I'm not hunting for security flaws or writing code, you might find
              me setting up homelabs for reverse engineering or exploring forests.
            </p>

            <p>
              This blog serves as a platform to share my findings, projects, and adventures. From technical deep-dives
              into cybersecurity concepts to my experiences with gardening and outdoor exploration, I aim to document my
              journey and share knowledge with the community.
            </p>

            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-2 text-cyan-400">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Web Security",
                  "Penetration Testing",
                  "Reverse Engineering",
                  "Full-Stack Development",
                  "Network Security",
                  "Malware Analysis",
                  "Threat Hunting",
                ].map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="px-3 py-1 bg-background/50 backdrop-blur-sm border border-border/50 rounded-full text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
