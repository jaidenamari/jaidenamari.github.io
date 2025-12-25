import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XTermWrapper, XTermHandle } from './xterm-wrapper';
import {
  createFileSystem,
  getDisplayPath,
  CommandRegistry,
  filesystemCommands,
  systemCommands,
  createHelpCommand,
  navigationCommands,
  type VirtualFileSystem,
} from '@/lib/terminal';
import postsData from '@/data/posts.json';
import './terminal.css';

const posts = postsData.posts.map(p => ({
  slug: p.slug,
  title: p.title,
  date: new Date(p.date).toLocaleDateString(),
  description: p.excerpt.slice(0, 100) + '...',
  content: p.excerpt,
}));

export function CyberTerminal() {
  const navigate = useNavigate();
  const [fs] = useState<VirtualFileSystem>(() => createFileSystem(posts));
  const [registry] = useState<CommandRegistry>(() => {
    const reg = new CommandRegistry();
    
    filesystemCommands.forEach(cmd => reg.register(cmd));
    systemCommands.forEach(cmd => reg.register(cmd));
    navigationCommands.forEach(cmd => reg.register(cmd));
    reg.register(createHelpCommand(reg));
    
    return reg;
  });
  
  const terminalRef = useRef<XTermHandle | null>(null);
  const [isReady, setIsReady] = useState(false);

  const getPrompt = useCallback(() => {
    const path = getDisplayPath(fs.cwd);
    return `\x1b[35mvisitor\x1b[0m@\x1b[36mgrove\x1b[0m:\x1b[32m${path}\x1b[0m$ `;
  }, [fs]);

  const handleInput = useCallback(async (input: string) => {
    if (!terminalRef.current) return;
    
    const ctx = {
      fs,
      print: (text: string) => terminalRef.current?.write(text),
      printLine: (text: string) => terminalRef.current?.writeLine(text),
      printError: (text: string) => terminalRef.current?.writeLine(`\x1b[31m${text}\x1b[0m`),
      clear: () => terminalRef.current?.clear(),
      navigate,
    };

    await registry.execute(input, ctx);
  }, [fs, registry, navigate]);

  const handleReady = useCallback((handle: XTermHandle) => {
    terminalRef.current = handle;
    setIsReady(true);
    
    handle.writeLine('\x1b[36m\x1b[1m');
    handle.writeLine('╔══════════════════════════════════════════════════════════╗');
    handle.writeLine('║                     SPORE OS v1.0.0                      ║');
    handle.writeLine('║                                                          ║');
    handle.writeLine('╚══════════════════════════════════════════════════════════╝');
    handle.writeLine('\x1b[0m');
    handle.writeLine('');
    handle.writeLine("\x1b[32mSystem online. Type 'help' for available commands.\x1b[0m");
    handle.writeLine("\x1b[2mTip: Use 'ls /blog' to see posts, 'open <slug>' to read them.\x1b[0m");
    handle.writeLine('');
  }, []);

  useEffect(() => {
    if (isReady && terminalRef.current) {
      terminalRef.current.focus();
    }
  }, [isReady]);

  return (
    <motion.div
      className="terminal-container w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="terminal-chrome">
        <div className="terminal-header">
          <div className="terminal-controls">
            <span className="control control-close" />
            <span className="control control-minimize" />
            <span className="control control-maximize" />
          </div>
          <div className="terminal-title">
            <span className="terminal-title-text">spore-terminal</span>
          </div>
          <div className="terminal-status">
            <span className="status-indicator" />
            <span className="status-text">SECURE</span>
          </div>
        </div>
        
        <div className="terminal-body">
          <XTermWrapper
            onInput={handleInput}
            onReady={handleReady}
            prompt={getPrompt()}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default CyberTerminal;

