import { motion } from 'framer-motion'
import { SporeIDCard } from '@/components/spore-id-card'

export function AboutPage() {
  const skills = [
    'Security',
    'Full-Stack',
    'API',
    'DevOps',
    'Cyber',
    'Garden',
    'Cook',
    'Hike',
    'Forage',
    'Explore'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-b from-purple-900/30 to-cyan-900/30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Centered Spore ID Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <SporeIDCard
          name="Spriggan"
          handle="spriggan"
          avatar="/images/spriggan.jpg"
          did="did:spore:n3tw0rk.g3n3s1s.n0d3.34rth.5pr1gg4n"
          skills={skills}
          socialLinks={{
            github: 'https://github.com/jaidenamari',
            bluesky: 'https://bsky.app/profile/imspriggan.bsky.social',
            linkedin: 'https://www.linkedin.com/in/jaidenamari/',
            youtube: 'https://youtube.com/@oxspriggan'
          }}
        />
      </motion.div>
    </div>
  )
}


