import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader, defaultUniforms, type ShaderUniforms } from './shaders';

interface AetherShaderMeshProps {
  uniforms: Partial<ShaderUniforms>;
}

function AetherShaderMesh({ uniforms: userUniforms }: AetherShaderMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(() => {
    const merged = { ...defaultUniforms, ...userUniforms };
    return {
      uTime: { value: merged.uTime },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uSmokeIntensity: { value: merged.uSmokeIntensity },
      uSmokeSpeed: { value: merged.uSmokeSpeed },
      uDotMatrixIntensity: { value: merged.uDotMatrixIntensity },
      uDotMatrixScale: { value: merged.uDotMatrixScale },
      uVignetteIntensity: { value: merged.uVignetteIntensity },
      uParticleGlow: { value: merged.uParticleGlow },
      uBaseColor: { value: new THREE.Vector3(...merged.uBaseColor) },
      uAccentColor1: { value: new THREE.Vector3(...merged.uAccentColor1) },
      uAccentColor2: { value: new THREE.Vector3(...merged.uAccentColor2) },
    };
  }, [size.width, size.height]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.getElapsedTime();
      
      const merged = { ...defaultUniforms, ...userUniforms };
      material.uniforms.uSmokeIntensity.value = merged.uSmokeIntensity;
      material.uniforms.uSmokeSpeed.value = merged.uSmokeSpeed;
      material.uniforms.uDotMatrixIntensity.value = merged.uDotMatrixIntensity;
      material.uniforms.uDotMatrixScale.value = merged.uDotMatrixScale;
      material.uniforms.uVignetteIntensity.value = merged.uVignetteIntensity;
      material.uniforms.uParticleGlow.value = merged.uParticleGlow;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

interface FloatingParticle {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  size: number;
  color: string;
  opacity: number;
}

interface FloatingParticlesProps {
  count: number;
  speed: number;
  colors: string[];
}

function FloatingParticles({ count, speed, colors }: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const particles = useMemo((): FloatingParticle[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * viewport.width * 2,
        (Math.random() - 0.5) * viewport.height * 2,
        Math.random() * 0.5 - 0.25,
      ] as [number, number, number],
      velocity: [
        (Math.random() - 0.5) * 0.002 * speed,
        (Math.random() - 0.5) * 0.002 * speed,
        0,
      ] as [number, number, number],
      size: Math.random() * 1.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.4 + 0.2,
    }));
  }, [count, speed, colors, viewport.width, viewport.height]);

  const geometry = useMemo(() => {
    const positions = new Float32Array(particles.length * 3);
    const particleColors = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);
    const opacities = new Float32Array(particles.length);

    particles.forEach((p, i) => {
      positions[i * 3] = p.position[0];
      positions[i * 3 + 1] = p.position[1];
      positions[i * 3 + 2] = p.position[2];

      const color = new THREE.Color(p.color);
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;

      sizes[i] = p.size;
      opacities[i] = p.opacity;
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    return geom;
  }, [particles]);

  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const halfWidth = viewport.width;
      const halfHeight = viewport.height;

      for (let i = 0; i < particles.length; i++) {
        positions[i * 3] += particles[i].velocity[0];
        positions[i * 3 + 1] += particles[i].velocity[1];

        if (positions[i * 3] < -halfWidth) positions[i * 3] = halfWidth;
        if (positions[i * 3] > halfWidth) positions[i * 3] = -halfWidth;
        if (positions[i * 3 + 1] < -halfHeight) positions[i * 3 + 1] = halfHeight;
        if (positions[i * 3 + 1] > halfHeight) positions[i * 3 + 1] = -halfHeight;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particleMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          attribute float size;
          attribute float opacity;
          attribute vec3 color;
          varying float vOpacity;
          varying vec3 vColor;
          
          void main() {
            vOpacity = opacity;
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying float vOpacity;
          varying vec3 vColor;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
      }),
    []
  );

  return <points ref={pointsRef} geometry={geometry} material={particleMaterial} />;
}

export interface AetherBackgroundSettings {
  smokeIntensity: number;
  smokeSpeed: number;
  dotMatrixIntensity: number;
  dotMatrixScale: number;
  hexGridOpacity: number;
  vignetteIntensity: number;
  particleGlow: number;
  floatingParticleCount: number;
  floatingParticleSpeed: number;
  liteMode: boolean;
}

export const defaultSettings: AetherBackgroundSettings = {
  smokeIntensity: 1.0,
  smokeSpeed: 1.3,
  dotMatrixIntensity: 1.0,
  dotMatrixScale: 1.5,
  hexGridOpacity: 0.0,
  vignetteIntensity: 0.8,
  particleGlow: 0.3,
  floatingParticleCount: 40,
  floatingParticleSpeed: 0.15,
  liteMode: true,
};

const HEX_PATTERN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%238A2BE2' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

interface AetherBackgroundProps {
  settings?: Partial<AetherBackgroundSettings>;
  className?: string;
}

export function AetherBackground({ settings: userSettings, className = '' }: AetherBackgroundProps) {
  const settings = { ...defaultSettings, ...userSettings };
  const particleCount = settings.liteMode ? Math.min(settings.floatingParticleCount, 20) : settings.floatingParticleCount;

  const shaderUniforms: Partial<ShaderUniforms> = {
    uSmokeIntensity: settings.smokeIntensity,
    uSmokeSpeed: settings.smokeSpeed,
    uDotMatrixIntensity: settings.dotMatrixIntensity,
    uDotMatrixScale: settings.dotMatrixScale,
    uVignetteIntensity: settings.vignetteIntensity,
    uParticleGlow: settings.particleGlow,
  };

  const particleColors = ['#0fce9e', '#ff00ff', '#41fd9b', '#00ffff'];

  return (
    <>
      <div className={`fixed inset-0 z-0 ${className}`}>
        <Canvas
          camera={{ position: [0, 0, 1] }}
          gl={{ 
            antialias: !settings.liteMode, 
            alpha: false,
            powerPreference: settings.liteMode ? 'low-power' : 'high-performance'
          }}
          dpr={settings.liteMode ? 1 : [1, 2]}
        >
          <AetherShaderMesh uniforms={shaderUniforms} />
          {particleCount > 0 && (
            <FloatingParticles
              count={particleCount}
              speed={settings.floatingParticleSpeed}
              colors={particleColors}
            />
          )}
        </Canvas>
      </div>
      {settings.hexGridOpacity > 0 && (
        <div
          className="fixed inset-0 z-[1] pointer-events-none"
          style={{
            opacity: settings.hexGridOpacity,
            backgroundImage: HEX_PATTERN_SVG,
            backgroundSize: '28px 49px',
          }}
        />
      )}
    </>
  );
}

