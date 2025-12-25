import { motion } from 'framer-motion'

interface PageHeaderProps {
  title: string
  description: string
  gradient: string
}

export function PageHeader({ title, description, gradient }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold tracking-tight font-heading mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h1>

      <motion.div
        className={`h-1 w-20 bg-gradient-to-r ${gradient} mb-6`}
        initial={{ width: 0 }}
        animate={{ width: '5rem' }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      <motion.p
        className="text-muted-foreground max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {description}
      </motion.p>
    </div>
  )
}


