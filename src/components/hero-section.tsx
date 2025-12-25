import { motion } from 'framer-motion'
import { CyberTerminal } from '@/components/cyber-terminal/index'

export function HeroSection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-16 md:pt-0 pb-8 md:pb-0">
      <div className="relative z-30 container mx-auto px-4">
        <motion.h1
          className="text-5xl md:text-8xl font-bold font-heading leading-none mb-4 mt-12 md:mt-0 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-primary">SPRIGGAN</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-cyan-400 max-w-3xl mx-auto mb-8 md:mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          WHERE DIGITAL MEETS WILDERNESS
        </motion.p>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CyberTerminal />
        </motion.div>
      </div>
    </div>
  )
}
