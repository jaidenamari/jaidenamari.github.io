import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-8xl font-bold font-heading text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Lost in the Digital Forest</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you're looking for has wandered off into the cyber wilderness. 
          Let's get you back on track.
        </p>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-cyan-500">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}

