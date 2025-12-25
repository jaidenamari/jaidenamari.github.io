import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { AetherBackground, defaultSettings, type AetherBackgroundSettings } from './aether-background'
import { EffectsControls } from './aether-background/effects-controls'
import { Analytics } from './analytics'

export function Layout() {
  const [backgroundSettings, setBackgroundSettings] = useState<AetherBackgroundSettings>(defaultSettings)

  return (
    <div className="font-sans min-h-screen bg-black">
      <AetherBackground settings={backgroundSettings} />
      <div className="flex min-h-screen flex-col relative z-10">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <EffectsControls settings={backgroundSettings} onSettingsChange={setBackgroundSettings} />
      <Analytics />
    </div>
  )
}
