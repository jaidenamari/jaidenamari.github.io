import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { BackgroundEffects } from './background-effects'
import { Analytics } from './analytics'

export function Layout() {
  return (
    <div className="font-sans min-h-screen bg-black">
      <BackgroundEffects />
      <div className="flex min-h-screen flex-col relative z-10">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Analytics />
    </div>
  )
}

