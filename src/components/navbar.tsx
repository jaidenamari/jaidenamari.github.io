import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu, X, Leaf, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
]

export function Navbar() {
  const location = useLocation()
  const pathname = location.pathname
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/40' : 'bg-transparent',
      )}
    >
      <div className="container flex h-16 items-center justify-center">
        {/*<div className="flex items-center gap-2">*/}
        {/*  /!*<Link to="/" className="flex items-center">*!/*/}
        {/*  /!*  <div className="mr-2 relative w-8 h-8">*!/*/}
        {/*  /!*    <Shield className="absolute text-primary w-8 h-8" />*!/*/}
        {/*  /!*    <Leaf className="absolute text-cyan-400 w-5 h-5 left-1.5 top-1.5" />*!/*/}
        {/*  /!*  </div>*!/*/}
        {/*  /!*  <span className="text-xl font-bold font-heading">*!/*/}
        {/*  /!*    <span className="text-primary">Spriggan</span>*!/*/}
        {/*  /!*  </span>*!/*/}
        {/*  /!*</Link>*!/*/}
        {/*</div>*/}

        <nav className="hidden flex md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-cyan-400 relative group',
                pathname === item.href ? 'text-cyan-400' : 'text-muted-foreground',
              )}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-cyan-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/*<div className="flex items-center gap-2">*/}
        {/*  <ThemeToggle />*/}
        {/*  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>*/}
        {/*    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
          <div className="container py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'block py-2 text-sm font-medium transition-colors hover:text-cyan-400',
                  pathname === item.href ? 'text-cyan-400' : 'text-muted-foreground',
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

