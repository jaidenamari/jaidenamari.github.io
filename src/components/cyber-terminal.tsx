import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

const terminalLines = [
  { text: '> Injecting chlorophyll payload...', delay: 500 },
  { text: '> Tracing photon trails through the digital canopy...', delay: 1500 },
  { text: '> Rooting into the Elder Tree mainframe...', delay: 2500 },
  { text: '> Deciphering whispers of the silicon mycelium...', delay: 3500 },
  { text: '> Decrypting ancient forest knowledge...', delay: 4500 },
  { text: '> The grove accepts. Welcome to the undergrowth...', delay: 5500 },
]

export function CyberTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  const [currentLineText, setCurrentLineText] = useState<string>('')
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visibleLines >= terminalLines.length) return

    const currentLine = terminalLines[visibleLines]
    if (!currentLine) return

    if (cursorPosition < currentLine.text.length) {
      const timer = setTimeout(
        () => {
          setCurrentLineText(currentLine.text.substring(0, cursorPosition + 1))
          setCursorPosition(cursorPosition + 1)
        },
        30 + Math.random() * 50,
      )

      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setVisibleLines(visibleLines + 1)
        setCursorPosition(0)
        setCurrentLineText('')
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [visibleLines, cursorPosition])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [visibleLines, currentLineText])

  return (
    <motion.div
      className="w-full rounded-lg overflow-hidden border border-cyan-500/50 bg-black/70 backdrop-blur-sm shadow-glow-cyan"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-primary/30 to-cyan-500/30 border-b border-cyan-500/50">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs font-mono text-cyan-400">spore-terminal@spriggan:~</div>
        <div className="text-xs font-mono text-cyan-400">SECURE</div>
      </div>

      <div
        ref={terminalRef}
        className="p-4 h-[180px] md:h-[300px] lg:h-[400px] font-mono text-sm text-left overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent"
      >
        <pre className="text-cyan-400 mb-4 text-xs leading-tight hidden md:block">
          {`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠒⡄⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⠂⢿⠇⣨⠆⠀⣠⠋⢰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠒⠣⢤⣇⠀⠀⠐⠤⢼⡿⡅⡠⠀⢀⠀⢡⣾⡅⠀⠀⠀⠀⢀⠀⣆⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠀⡤⢀⠀⠀⡀⠀⠀⠀⣇⣠⠄⠀⠀⣿⠀⠀⠀⠤⠴⢀⠼⠀⠀⠈⢉⠉⣹⡀⠀⠀⠀⠀⠀⠉⣹⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢲⣿⢾⣀⠀⡧⣶⠊⠀⠸⢿⠓⢤⣄⣹⣆⣠⠀⠀⠀⠀⡀⠀⡄⠀⠈⣽⠇⠀⠀⠀⡀⠀⣸⠋⠉⠒⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠰⣀⣔⠀⢀⣭⣅⣠⣷⠃⠈⢹⠏⠱⡴⠧⣶⣤⠔⠈⣟⣿⣿⡇⠀⠀⠀⠙⢼⣷⣠⣾⡟⠁⢠⣴⣏⠀⣸⣧⠀⢠⣤⠊⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠤⠤⠽⢻⠉⢳⠀⠀⠀⠀⠑⠲⠓⠄⡠⠃⠀⡸⠛⠳⣆⠈⠻⠮⠿⣦⡀⠓⠒⣩⣿⠟⠵⣋⡒⠉⢩⠃⠘⣏⠀⡟⠙⡟⢀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠠⠀⠞⠒⠈⠀⠀⠀⠀⠀⠀⠀⢠⡀⠀⢰⣃⣀⠀⠿⣦⠀⠀⠐⢿⣷⣠⣞⣿⣿⠛⠛⠋⠉⠒⠊⠁⠈⠁⢀⠈⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠉⠒⠸⣵⡷⡄⠀⢘⡶⠘⣄⣖⡁⢈⠃⠩⠉⠋⠐⠑⠄⠀⠀⠀⠀⠀⢚⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣄⣦⡔⠁⠀⠰⣄⢀⣠⠋⠀⠰⡚⠉⣧⡄⠘⢻⠀⠙⡄⠀⠀⠀⠸⡀⣠⡄⠀⠀⡠⠄⡀⠈⠉⠀⠀⠀⡄⢀⠀⠀⠀⢠⣀⣤⡄⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠠⠤⣞⣑⠎⠀⠀⠀⠀⠈⠣⢤⠜⠀⠀⠹⢿⡤⡞⠉⡏⡇⠀⠀⠀⢀⣀⡝⠻⡤⠂⠱⣾⡄⠀⠀⠀⠓⠢⢯⡷⣀⠀⢀⡴⢆⣼⣃⡆
⠀⢢⣧⠀⠀⠀⠀⣜⡑⠲⣿⢅⡠⠀⠀⠙⢷⣤⡀⠀⠰⢀⣦⡬⠂⠀⠀⠀⢯⣷⣀⠀⣷⣧⠄⠀⢀⠀⠈⠱⣎⠀⠈⠩⢠⡗⠂⠀⠀⠘⢤⣾⠀⣜⡴⠟⠁⠀⠀⠀⠀
⠀⢨⠏⢰⠒⠖⣲⠙⣿⣾⠧⣼⣄⠀⠘⢆⣰⣟⣷⣖⠢⢤⠋⠡⠂⠀⠀⠀⢈⡾⣿⠷⣿⣿⣿⠁⠀⠀⠀⡰⢻⣶⣧⢠⡟⠀⡀⠀⠀⣠⣟⣿⡞⣋⡄⠀⠀⠀⠀⠀⠀
⠈⣻⠿⣈⣯⠒⢿⠯⢉⡟⡟⠛⠻⢟⣦⣤⣛⢣⠀⣻⣧⠀⠙⣷⡄⠀⠀⢈⠓⠀⢈⣷⢻⢿⣦⠂⠀⠀⠀⠣⠼⣟⣿⣟⡎⠀⢳⣻⢄⣠⣋⠿⢷⠘⠤⣶⠀⠀⠀⠀⠀
⠀⠑⠴⠃⠸⠓⠣⠤⠋⠉⠀⠀⠀⠘⠈⠙⠿⡏⠈⡻⠋⠁⣄⣈⣻⠟⠢⢼⣹⣏⠀⠉⢿⠸⣿⣷⠀⠀⡀⠀⢰⣿⠟⠁⣀⡏⠉⣹⡀⣹⠣⣀⠜⢩⠿⣡⡊⠀⠀⠀⠀
⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢶⣳⡖⠺⡞⠯⢵⣀⣀⡔⠉⠈⡦⣴⠻⣷⣿⣷⣀⢸⣥⠄⠾⢇⣠⢞⣫⢿⣮⣭⣍⣀⣀⣠⣴⣯⡶⣏⡇⠀⠀⠀⠀
⠠⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠀⠀⠒⠴⠊⠁⢀⣠⣶⣶⠿⠿⠷⠷⢤⣤⣷⡟⢧⠹⣿⡃⠈⡹⠋⢃⣀⣼⠕⠋⠉⠉⠀⠀⠀⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢤⡀⢸⢤⡄⠀⠀⠀⣠⣵⡶⠛⠋⠀⠀⠀⠀⠀⠀⠀⢫⣄⣷⣖⢓⢿⣿⣫⣧⣤⢼⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⡟⠙⣄⡠⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠤⢎⣨⡏⠘⣿⣿⡟⡵⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠒⠺⣄⣀⡼⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡄⣷⠀⣿⡿⡜⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⣿⠀⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠀⡯⢀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⡸⠀⣼⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣧⠃⣼⡟⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  `}
        </pre>

        <pre className="text-cyan-400 mb-2 text-xs leading-tight md:hidden">
          {`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠒⡄⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⠂⢿⠇⣨⠆⠀⣠⠋⢰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠒⠣⢤⣇⠀⠀⠐⠤⢼⡿⡅⡠⠀⢀⠀⢡⣾⡅⠀⠀⠀⠀⢀⠀⣆⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠀⡤⢀⠀⠀⡀⠀⠀⠀⣇⣠⠄⠀⠀⣿⠀⠀⠀⠤⠴⢀⠼⠀⠀⠈⢉⠉⣹⡀⠀⠀⠀⠀⠀⠉⣹⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢲⣿⢾⣀⠀⡧⣶⠊⠀⠸⢿⠓⢤⣄⣹⣆⣠⠀⠀⠀⠀⡀⠀⡄⠀⠈⣽⠇⠀⠀⠀⡀⠀⣸⠋⠉⠒⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠰⣀⣔⠀⢀⣭⣅⣠⣷⠃⠈⢹⠏⠱⡴⠧⣶⣤⠔⠈⣟⣿⣿⡇⠀⠀⠀⠙⢼⣷⣠⣾⡟⠁⢠⣴⣏⠀⣸⣧⠀⢠⣤⠊⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠤⠤⠽⢻⠉⢳⠀⠀⠀⠀⠑⠲⠓⠄⡠⠃⠀⡸⠛⠳⣆⠈⠻⠮⠿⣦⡀⠓⠒⣩⣿⠟⠵⣋⡒⠉⢩⠃⠘⣏⠀⡟⠙⡟⢀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠠⠀⠞⠒⠈⠀⠀⠀⠀⠀⠀⠀⢠⡀⠀⢰⣃⣀⠀⠿⣦⠀⠀⠐⢿⣷⣠⣞⣿⣿⠛⠛⠋⠉⠒⠊⠁⠈⠁⢀⠈⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠉⠒⠸⣵⡷⡄⠀⢘⡶⠘⣄⣖⡁⢈⠃⠩⠉⠋⠐⠑⠄⠀⠀⠀⠀⠀⢚⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣄⣦⡔⠁⠀⠰⣄⢀⣠⠋⠀⠰⡚⠉⣧⡄⠘⢻⠀⠙⡄⠀⠀⠀⠸⡀⣠⡄⠀⠀⡠⠄⡀⠈⠉⠀⠀⠀⡄⢀⠀⠀⠀⢠⣀⣤⡄⠀⠀⠀⠀
  `}
        </pre>

        <div className="space-y-1">
          {terminalLines.slice(0, visibleLines).map((line, index) => (
            <div key={index} className="text-green-400">
              {line.text}
            </div>
          ))}
          {visibleLines < terminalLines.length && (
            <div className="text-green-400">
              {currentLineText}
              <span className="inline-block w-2 h-4 bg-green-400 ml-0.5 animate-pulse"></span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

