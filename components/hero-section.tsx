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

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw rays
      rays.forEach((ray) => {
        ctx.save()
        ctx.translate(ray.x, ray.y)
        ctx.rotate(ray.angle)

        const gradient = ctx.createLinearGradient(0, 0, 0, ray.length)
        gradient.addColorStop(0, `${ray.color}00`)
        gradient.addColorStop(
          0.5,
          `${ray.color}${Math.floor(ray.opacity * 255)
            .toString(16)
            .padStart(2, "0")}`,
        )
        gradient.addColorStop(1, `${ray.color}00`)

        ctx.fillStyle = gradient
        ctx.globalAlpha = ray.opacity
        ctx.fillRect(-ray.width / 2, 0, ray.width, ray.length)
        ctx.restore()

        // Move ray
        ray.y += ray.speed

        // Reset ray if it's off screen
        if (ray.y > canvas.height + 100) {
          ray.y = -100 - Math.random() * 200
          ray.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
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

      {/* Cyberpunk grid overlay */}
      <div className="absolute inset-0 z-20 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#8A2BE2_1px,transparent_1px),linear-gradient(to_bottom,#8A2BE2_1px,transparent_1px)] bg-[size:40px_40px]"></div>
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

        {/* Title */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold font-heading leading-none mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-primary">SPRI</span> <br className="md:hidden" />
          <span className="text-cyan-400">GGAN</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-cyan-400 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          WHERE CYBERSECURITY MEETS THE WILDERNESS
        </motion.p>

        {/* Terminal */}
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <CyberTerminal />
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 border-none text-lg px-8 py-6 transform transition-transform hover:translate-y-[-2px] hover:shadow-glow-purple"
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
            className="border-cyan-500 text-cyan-400 hover:bg-cyan-950/30 text-lg px-8 py-6 transform transition-transform hover:translate-y-[-2px] hover:shadow-glow-cyan"
          >
            <Link href="/portfolio">View Projects</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
