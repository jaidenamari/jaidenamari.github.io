export function ScanlineShader() {
  return (
    <>
      {/* Scanline effect - subtle CRT lines */}
      <div
        className="absolute -inset-px pointer-events-none z-20 mix-blend-multiply"
        style={{
          backgroundImage: 'repeating-linear-gradient(180deg, #000 0, #000 1px, transparent 1px, transparent 3px)',
          opacity: 0.2,
        }}
      />
      {/* Animated shimmer effect */}
      <div
        className="absolute -inset-px pointer-events-none z-20 mix-blend-overlay opacity-50 overflow-hidden rounded-[inherit] animate-scanline-shimmer"
      />
    </>
  )
}


