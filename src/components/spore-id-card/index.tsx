import { useState, useRef } from 'react'
import { GitHubIcon, LinkedInIcon, BlueskyIcon, YouTubeIcon } from '@/components/social-icons'
import { TerminalLogo } from '@/components/terminal-logo'
import { SkillsGraph } from './skills-graph'
import { ScanlineShader } from './scanline-shader'
import { QRCodeSVG } from 'qrcode.react'

interface SporeIDCardProps {
  name: string
  handle: string
  avatar: string
  did: string
  skills: string[]
  socialLinks: {
    github?: string
    linkedin?: string
    bluesky?: string
    youtube?: string
  }
}

export function SporeIDCard({ name, handle, avatar, did, skills, socialLinks }: SporeIDCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePosition({ x, y })
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="relative inline-flex flex-col items-center perspective-1000">
      <div className="relative p-4" style={{ background: 'radial-gradient(ellipse at center, #a855f708 0%, transparent 70%)' }}>
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2" style={{ borderColor: '#a855f760' }} />
        <div className="absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2" style={{ borderColor: '#a855f760' }} />
        <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2" style={{ borderColor: '#a855f760' }} />
        <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2" style={{ borderColor: '#a855f760' }} />

        {/* Flippable card container */}
        <div
          ref={cardRef}
          className="relative grid [grid-template-areas:'stack'] transition-transform duration-600 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Front of card */}
          <div
            className="[grid-area:stack] relative overflow-hidden backface-hidden z-2"
            style={{
              filter: 'brightness(1.18)',
              clipPath: 'polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)',
            }}
          >
            <div
              className="font-mono backface-hidden w-full max-w-[480px] mx-auto flex relative z-10 h-full"
              style={{
                backgroundColor: '#a855f7',
                padding: '2px',
                clipPath: 'polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)',
                filter: 'drop-shadow(8px 8px 0px rgba(0,0,0,0.5))',
              }}
            >
              <div
                className="relative size-full flex flex-col overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #1a0a2e 0%, #0f0518 100%)',
                  clipPath: 'polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px)',
                }}
              >
                {/* Header */}
                <div
                  className="relative flex items-center justify-center gap-3 px-6 py-3 border-b"
                  style={{ backgroundColor: '#a855f715', borderColor: '#a855f750' }}
                >
                  <TerminalLogo 
                    size={20}
                    className="stroke-[#a855f7] stroke-2"
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: '#a855f7' }}>
                    SPORE_ID
                  </span>
                  <button
                    className="absolute right-2 p-1 rounded hover:bg-white/10 transition-colors"
                    title="Flip card"
                    onClick={handleFlip}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="h-4 w-4 text-white/40 hover:text-white/60 transition-colors"
                    >
                      <path d="M228,48V96a12,12,0,0,1-12,12H168a12,12,0,0,1,0-24h19l-7.8-7.8a75.55,75.55,0,0,0-53.32-22.26h-.43A75.49,75.49,0,0,0,72.39,75.57,12,12,0,1,1,55.61,58.41a99.38,99.38,0,0,1,69.87-28.47H126A99.42,99.42,0,0,1,196.2,59.23L204,67V48a12,12,0,0,1,24,0ZM183.61,180.43a75.49,75.49,0,0,1-53.09,21.63h-.43A75.55,75.55,0,0,1,76.77,179.8L69,172H88a12,12,0,0,0,0-24H40a12,12,0,0,0-12,12v48a12,12,0,0,0,24,0V189l7.8,7.8A99.42,99.42,0,0,0,130,226.06h.56a99.38,99.38,0,0,0,69.87-28.47,12,12,0,0,0-16.78-17.16Z" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="relative px-8 py-8 pb-6 flex-1">
                  <div className="flex flex-col items-center text-center space-y-6 w-full">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-40 h-40 relative">
                        <img
                          src={avatar}
                          alt={name}
                          className="w-full h-full object-cover border-2"
                          style={{ borderColor: '#a855f7' }}
                        />
                      </div>
                    </div>

                    {/* Name and handle */}
                    <div className="w-full space-y-2">
                      <div className="text-xl font-bold tracking-wide" style={{ color: '#a855f7' }}>
                        {name}
                      </div>
                      <div className="text-base text-white/60">@{handle}</div>
                      <div className="text-[11px] font-mono text-white/40 break-all px-4 pt-1">{did}</div>
                    </div>

                    {/* Social links */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {socialLinks.github && (
                        <a
                          href={socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 text-xs border transition-all duration-200 ease-out hover:scale-105 cursor-pointer"
                          style={{
                            borderColor: '#a855f7',
                            backgroundColor: '#a855f715',
                            color: '#a855f7',
                          }}
                        >
                          <GitHubIcon className="h-3.5 w-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {socialLinks.bluesky && (
                        <a
                          href={socialLinks.bluesky}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 text-xs border transition-all duration-200 ease-out hover:scale-105 cursor-pointer"
                          style={{
                            borderColor: '#06b6d4',
                            backgroundColor: '#06b6d415',
                            color: '#06b6d4',
                          }}
                        >
                          <BlueskyIcon className="h-3.5 w-3.5" />
                          <span>Bluesky</span>
                        </a>
                      )}
                      {socialLinks.linkedin && (
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 text-xs border transition-all duration-200 ease-out hover:scale-105 cursor-pointer"
                          style={{
                            borderColor: '#a855f7',
                            backgroundColor: '#a855f715',
                            color: '#a855f7',
                          }}
                        >
                          <LinkedInIcon className="h-3.5 w-3.5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {socialLinks.youtube && (
                        <a
                          href={socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 text-xs border transition-all duration-200 ease-out hover:scale-105 cursor-pointer"
                          style={{
                            borderColor: '#ef4444',
                            backgroundColor: '#ef444415',
                            color: '#ef4444',
                          }}
                        >
                          <YouTubeIcon className="h-3.5 w-3.5" />
                          <span>YouTube</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills Graph */}
                <div className="relative px-6 py-6 border-t" style={{ borderColor: '#a855f730' }}>
                  <SkillsGraph skills={skills} />
                </div>

                {/* Footer */}
                <div
                  className="relative px-6 py-3 text-[10px] uppercase tracking-widest border-t text-center"
                  style={{ borderColor: '#a855f730', color: '#a855f780' }}
                >
                  SPORE NETWORK · NODE · EARTH
                  <br />
                  Inspiration: <a href={'https://www.aetheros.computer/id/montoulieu.dev'}>Pieter_Montoulieu</a>
                </div>
              </div>
            </div>

            {/* Mouse hover glow effect */}
            {isHovering && (
              <div
                className="absolute -inset-px pointer-events-none z-15 transition-opacity duration-300 ease-out mix-blend-overlay"
                style={{
                  background: `radial-gradient(ellipse 100% 80% at ${mousePosition.x}px ${mousePosition.y}px, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.12) 35%, transparent 65%)`,
                  opacity: 1,
                }}
              />
            )}

            {/* Scanline overlay */}
            <ScanlineShader />
          </div>

          {/* Back of card */}
          <div
            className="[grid-area:stack] relative overflow-hidden backface-hidden z-1"
            style={{
              transform: 'rotateY(180deg)',
              filter: 'brightness(1.18)',
              clipPath: 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 15px, 100% 100%, 15px 100%, 0% calc(100% - 15px))',
            }}
          >
            <div
              className="font-mono backface-hidden min-h-full flex flex-col w-full max-w-[480px] mx-auto relative z-10"
              style={{
                backgroundColor: '#a855f7',
                padding: '2px',
                clipPath: 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 15px, 100% 100%, 15px 100%, 0% calc(100% - 15px))',
                filter: 'drop-shadow(8px 8px 0px rgba(0,0,0,0.5))',
              }}
            >
              <div
                className="relative flex-grow w-full overflow-hidden flex flex-col"
                style={{
                  background: 'linear-gradient(180deg, #1a0a2e 0%, #0f0518 100%)',
                  clipPath: 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 15px, 100% 100%, 15px 100%, 0% calc(100% - 15px))',
                }}
              >
                {/* Header */}
                <div
                  className="relative flex items-center justify-center gap-3 px-6 py-3 border-b shrink-0"
                  style={{ backgroundColor: '#a855f715', borderColor: '#a855f750' }}
                >
                  <TerminalLogo 
                    size={20}
                    className="stroke-[#a855f7] stroke-2"
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: '#a855f7' }}>
                    SPORE_ID
                  </span>
                  <button
                    className="absolute right-2 p-1 rounded hover:bg-white/10 transition-colors"
                    title="Flip card"
                    onClick={handleFlip}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="h-4 w-4 text-white/40 hover:text-white/60 transition-colors"
                    >
                      <path d="M228,48V96a12,12,0,0,1-12,12H168a12,12,0,0,1,0-24h19l-7.8-7.8a75.55,75.55,0,0,0-53.32-22.26h-.43A75.49,75.49,0,0,0,72.39,75.57,12,12,0,1,1,55.61,58.41a99.38,99.38,0,0,1,69.87-28.47H126A99.42,99.42,0,0,1,196.2,59.23L204,67V48a12,12,0,0,1,24,0ZM183.61,180.43a75.49,75.49,0,0,1-53.09,21.63h-.43A75.55,75.55,0,0,1,76.77,179.8L69,172H88a12,12,0,0,0,0-24H40a12,12,0,0,0-12,12v48a12,12,0,0,0,24,0V189l7.8,7.8A99.42,99.42,0,0,0,130,226.06h.56a99.38,99.38,0,0,0,69.87-28.47,12,12,0,0,0-16.78-17.16Z" />
                    </svg>
                  </button>
                </div>

                {/* QR Code content */}
                <div className="relative px-8 py-8 flex-1 flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center text-center space-y-6 w-full">
                    <div className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: '#a855f7' }}>
                      Scan to Connect
                    </div>
                    <div className="shrink-0">
                      <div className="relative p-3" style={{ border: '2px solid #a855f760' }}>
                        <QRCodeSVG
                          value={`https://spore.network/id/${handle}`}
                          size={180}
                          bgColor="#0f0518"
                          fgColor="#a855f7"
                          level="H"
                        />
                        <div className="absolute -top-0.5 -left-0.5 h-4 w-4 border-t-2 border-l-2" style={{ borderColor: '#a855f7' }} />
                        <div className="absolute -top-0.5 -right-0.5 h-4 w-4 border-t-2 border-r-2" style={{ borderColor: '#a855f7' }} />
                        <div className="absolute -bottom-0.5 -left-0.5 h-4 w-4 border-b-2 border-l-2" style={{ borderColor: '#a855f7' }} />
                        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 border-b-2 border-r-2" style={{ borderColor: '#a855f7' }} />
                      </div>
                    </div>
                    <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, #a855f750 50%, transparent 100%)' }} />
                    <div className="w-full space-y-2">
                      <div>
                        <div className="text-xl font-bold tracking-wide" style={{ color: '#a855f7' }}>
                          @{handle}
                        </div>
                        <div className="text-base text-white/60 mt-1">{name}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="relative px-6 py-3 text-[10px] uppercase tracking-widest border-t text-center shrink-0"
                  style={{ borderColor: '#a855f730', color: '#a855f780' }}
                >
                  SPORE OS
                </div>
              </div>
            </div>

            {/* Scanline overlay for back */}
            <ScanlineShader />
          </div>
        </div>
      </div>
    </div>
  )
}


