import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { motion } from 'framer-motion'
import { GitHubIcon, LinkedInIcon, BlueskyIcon, YouTubeIcon } from '@/components/social-icons'

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24 relative">
      <div className="absolute top-0 left-0 w-full h-64 opacity-20 -z-10 bg-gradient-to-b from-purple-900/50 to-cyan-900/50"></div>

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="About Spriggan"
          description="Security engineer, coder, and wilderness explorer."
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
                src="/images/spriggan.jpg"
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
                <a href="https://github.com/jaidenamari" target="_blank" rel="noopener noreferrer">
                  <GitHubIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-primary/50 hover:border-primary hover:bg-primary/10"
              >
                <a href="https://bsky.app/profile/imspriggan.bsky.social" target="_blank" rel="noopener noreferrer">
                  <BlueskyIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-primary/50 hover:border-primary hover:bg-primary/10"
              >
                <a href="https://www.linkedin.com/in/jaidenamari/" target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-primary/50 hover:border-primary hover:bg-primary/10"
              >
                <a href="https://youtube.com/@oxspriggan" target="_blank" rel="noopener noreferrer">
                  <YouTubeIcon className="h-4 w-4" />
                </a>
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
            I'm Spriggan, a security engineer and web application developer.
            </p>

            <p>
            I enjoy coding, galanvanting through digital and natural environments. 
            I live a balanced life close to the dirt rhythms, gardening, 
            basking in the sun like a lizard, and wuffling around for foragables.
            </p>

            <p>
            My expertise spans across vulnerability assessment, secure coding practices, 
            and building full-stack web applications. When I'm not spelunking the digital world 
            I'm usually getting into faerie mischief, cooking delicious food, and composting.   
            </p>

            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-2 text-cyan-400">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Web App Security',
                  'Full-Stack Development',
                  'API Engineer',
                  'DevOps',
                  'Cybersecurity',
                  'Gardening',
                  'Cooking',
                  'Hiking',
                  'Foraging',
                  'Exploring'
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

