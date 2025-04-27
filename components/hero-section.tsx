"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { CyberTerminal } from "@/components/cyber-terminal"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Light rays effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Light ray parameters
    const rays: {
      x: number
      y: number
      length: number
      angle: number
      width: number
      speed: number
      color: string
      opacity: number
    }[] = []

    // Create rays
    const rayCount = Math.min(15, Math.floor(window.innerWidth / 100))

    for (let i = 0; i < rayCount; i++) {
      rays.push({
        x: Math.random() * canvas.width,
        y: -100 - Math.random() * 200,
        length: 300 + Math.random() * 700,
        angle: ((Math.random() * 30 - 15) * Math.PI) / 180,
        width: 20 + Math.random() * 80,
        speed: 0.2 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? "#0fce9e" : "#ff00ff",
        opacity: 0.03 + Math.random() * 0.06,
      })
    }

    // Animation
    let animationFrameId: number
    let lastTime = 0

    const animate = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw rays
      for (const ray of rays) {
        ray.y += ray.speed * deltaTime * 0.1

        // Reset ray position when it goes out of screen
        if (ray.y > canvas.height + ray.length) {
          ray.y = -100 - Math.random() * 200
          ray.x = Math.random() * canvas.width
        }

        // Draw ray
        const startX = ray.x
        const startY = ray.y
        const endX = startX + Math.sin(ray.angle) * ray.length
        const endY = startY + Math.cos(ray.angle) * ray.length

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
        gradient.addColorStop(0, `${ray.color}00`)
        gradient.addColorStop(0.5, `${ray.color}${Math.floor(ray.opacity * 255).toString(16).padStart(2, "0")}`)
        gradient.addColorStop(1, `${ray.color}00`)

        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.lineWidth = ray.width
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-16 md:pt-0 pb-8 md:pb-0">
      {/* Background image with overlay */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/images/cyberpunk-forest-1.png')",
          filter: "brightness(0.2) contrast(1.2)",
        }}
      /> */}

      {/* Light rays canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Cyberpunk grid overlay - Hexagonal pattern */}
      <div className="absolute inset-0 z-20 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%238A2BE2' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '28px 49px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-30 container mx-auto px-4 text-center">
        {/* 3D triangles */}
        <motion.div
          className="absolute left-1/4 -translate-x-1/2 top-1/2 -translate-y-1/2 w-64 h-64 opacity-20 z-0"
          initial={{ opacity: 0, scale: 0.8, rotateZ: -10 }}
          animate={{ opacity: 0.2, scale: 1, rotateZ: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="w-full h-full bg-cyan-400 clip-triangle transform rotate-45 shadow-glow-cyan"></div>
        </motion.div>

        <motion.div
          className="absolute right-1/4 translate-x-1/2 top-1/2 -translate-y-1/2 w-48 h-48 opacity-20 z-0"
          initial={{ opacity: 0, scale: 0.8, rotateZ: 10 }}
          animate={{ opacity: 0.2, scale: 1, rotateZ: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        >
          <div className="w-full h-full bg-cyan-400 clip-triangle transform -rotate-12 shadow-glow-cyan"></div>
        </motion.div>

        {/* Title - Added top padding for mobile */}
        <motion.h1
          className="text-5xl md:text-8xl font-bold font-heading leading-none mb-4 mt-12 md:mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-primary">SPRI</span> <br className="md:hidden" />
          <span className="text-cyan-400">GGAN</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-cyan-400 max-w-3xl mx-auto mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          WHERE CYBERSECURITY MEETS THE WILDERNESS
        </motion.p>

        {/* Terminal - Reduced height on mobile */}
        <motion.div
          className="max-w-2xl mx-auto mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CyberTerminal />
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center pb-4 md:pb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 border-none text-base md:text-lg px-6 md:px-8 py-5 md:py-6 transform transition-transform hover:translate-y-[-2px] hover:shadow-glow-purple"
          >
            <Link href="/blog" className="flex items-center">
              Explore Blog
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="border-cyan-500 text-cyan-400 hover:bg-cyan-950/30 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 transform transition-transform hover:translate-y-[-2px] hover:shadow-glow-cyan"
          >
            <Link href="/portfolio">View Projects</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
