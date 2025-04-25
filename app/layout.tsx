import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import { GeistSans } from 'geist/font/sans'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"
import { Analytics } from "@/components/analytics"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })

export const metadata: Metadata = {
  title: "Spriggan | Cybersecurity & Digital Wilderness",
  description: "Where technology meets nature - cybersecurity insights, code, and forest adventures",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.className}>
      <body className={`${inter.variable} ${orbitron.variable} font-sans min-h-screen bg-black`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <BackgroundEffects />
          <div className="flex min-h-screen flex-col relative z-10">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'