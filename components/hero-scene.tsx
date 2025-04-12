"use client"

import { useState, useRef, useEffect } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree, ThreeElements } from "@react-three/fiber"
import { Text, Environment, Float, PerspectiveCamera, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface CyberTreeProps {
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}

function CyberTree({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: CyberTreeProps) {
  const treeRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (treeRef.current) {
      treeRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={treeRef} position={position} scale={scale} rotation={rotation}>
      {/* Tree trunk */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.5, 4, 8]} />
        <meshStandardMaterial color="#3a1f5d" roughness={0.8} />
      </mesh>

      {/* Tree foliage */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[2, 3, 8]} />
        <meshStandardMaterial color="#0fce9e" emissive="#0fce9e" emissiveIntensity={0.2} roughness={0.7} />
      </mesh>

      {/* Glowing rings */}
      {[0.8, 1.6, 2.4, 3.2].map((height, i) => (
        <mesh key={i} position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6 - i * 0.1, 0.05, 16, 32]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}

      {/* Digital particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const radius = 1.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.random() * 5

        return (
          <mesh key={i} position={[x, y, z]} scale={0.05}>
            <sphereGeometry />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} toneMapped={false} />
          </mesh>
        )
      })}
    </group>
  )
}

interface FloatingIslandProps {
  position?: [number, number, number]
}

function FloatingIsland({ position = [0, 0, 0] }: FloatingIslandProps) {
  const islandRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={islandRef} position={position}>
      {/* Island base */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[3, 4, 1, 32, 1, false, 0, Math.PI * 2]} />
        <meshStandardMaterial color="#1a0d2c" roughness={0.8} />
      </mesh>

      {/* Island top */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[4, 3, 1, 32]} />
        <meshStandardMaterial color="#2a1b3d" roughness={0.7} />
      </mesh>

      {/* Grass */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3, 0.1, 32]} />
        <meshStandardMaterial color="#0d2c1a" roughness={0.9} />
      </mesh>

      {/* Circuit patterns */}
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2.9, 32]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function CityBackground() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      "/placeholder.svg?height=1200&width=2000",
      (loadedTexture) => {
        setTexture(loadedTexture)
      },
      undefined,
      (err) => {
        console.error("Error loading texture:", err)
        setError(true)
      },
    )

    return () => {
      if (texture) texture.dispose()
    }
  }, [])

  if (error || !texture) {
    // Return a colored plane as fallback
    return (
      <mesh position={[0, 0, -15]}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial color="#0a0a1a" />
      </mesh>
    )
  }

  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[40, 20]} />
      <meshBasicMaterial map={texture} transparent opacity={0.6} />
    </mesh>
  )
}

function HeroContent() {
  const { camera } = useThree()
  const isMobile = useMobile()

  useEffect(() => {
    if (isMobile) {
      camera.position.set(0, 2, 10)
    } else {
      camera.position.set(0, 2, 8)
    }
  }, [camera, isMobile])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ff00ff" />
      <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} penumbra={1} castShadow />

      <Environment preset="night" />

      <CityBackground />

      <FloatingIsland position={[0, -2, 0]} />
      <CyberTree position={[-2.5, -1.5, -1]} scale={0.7} />
      <CyberTree position={[2, -1.5, -2]} scale={0.8} rotation={[0, Math.PI / 3, 0]} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          font="/fonts/Geist_Bold.json"
          position={[0, 3, 0]}
          fontSize={isMobile ? 0.8 : 1.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={10}
          textAlign="center"
          outlineWidth={0.02}
          outlineColor="#ff00ff"
        >
          SPRIGGAN
        </Text>

        <Text
          font="/fonts/Geist_Regular.json"
          position={[0, 2, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#0fce9e"
          anchorX="center"
          anchorY="middle"
          maxWidth={10}
          textAlign="center"
        >
          WHERE CYBERSECURITY MEETS THE DIGITAL WILDERNESS
        </Text>
      </Float>

      <group position={[0, 0.5, 2]}>
        <Html transform position={[0, 0, 0]} center>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 border-none"
            >
              <Link href="/blog">
                Explore Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-cyan-500 text-cyan-400 hover:bg-cyan-950/30">
              <Link href="/portfolio">View Projects</Link>
            </Button>
          </div>
        </Html>
      </group>
    </>
  )
}

export function HeroScene() {
  return (
    <div className="h-screen w-full">
      <Canvas shadows>
        <HeroContent />
      </Canvas>
    </div>
  )
}
