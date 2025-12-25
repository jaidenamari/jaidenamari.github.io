import { useState } from 'react'
import { motion } from 'framer-motion'

interface SkillsGraphProps {
  skills: string[]
}

export function SkillsGraph({ skills }: SkillsGraphProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const positions = [
    { x: 15, y: 15 },
    { x: 50, y: 10 },
    { x: 85, y: 15 },
    { x: 30, y: 35 },
    { x: 70, y: 35 },
    { x: 15, y: 55 },
    { x: 50, y: 50 },
    { x: 85, y: 55 },
    { x: 30, y: 75 },
    { x: 70, y: 75 },
  ]

  const connections = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 5],
    [3, 6],
    [4, 6],
    [4, 7],
    [5, 8],
    [6, 8],
    [6, 9],
    [7, 9],
  ]

  return (
    <div className="relative w-full h-48 overflow-visible">
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        {connections.map(([start, end], idx) => {
          const startPos = positions[start]
          const endPos = positions[end]
          const isConnected = hoveredIndex === start || hoveredIndex === end
          return (
            <line
              key={`connection-${idx}`}
              x1={`${startPos.x}%`}
              y1={`${startPos.y}%`}
              x2={`${endPos.x}%`}
              y2={`${endPos.y}%`}
              stroke={isConnected ? '#a855f7' : '#a855f740'}
              strokeWidth={isConnected ? '2' : '1'}
              className="transition-all duration-300"
            />
          )
        })}
      </svg>

      {skills.slice(0, 10).map((skill, index) => {
        const pos = positions[index]
        const isHovered = hoveredIndex === index
        return (
          <motion.div
            key={skill}
            className="absolute px-2.5 py-1.5 text-[9px] uppercase tracking-wider font-semibold cursor-default whitespace-nowrap"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              borderColor: '#a855f7',
              backgroundColor: isHovered ? '#a855f730' : '#a855f715',
              color: '#a855f7',
              border: '1px solid',
              zIndex: isHovered ? 10 : 1,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.15, z: 10 }}
            transition={{ duration: 0.2 }}
          >
            {skill}
          </motion.div>
        )
      })}
    </div>
  )
}


