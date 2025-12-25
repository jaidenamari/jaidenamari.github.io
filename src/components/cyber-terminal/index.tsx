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
          <div className="terminal-system-header">
            <div className="terminal-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="terminal-system-info">
              <div className="terminal-system-label">SYSTEM_ACCESS</div>
              <div className="terminal-system-name">SPORE OS V1.0</div>
            </div>
          </div>
          
          <div className="terminal-status-bar">
            <div className="terminal-status-group">
              <div className="terminal-status-item">
                <span className="status-icon secure"></span>
                <span>ACCESS_GRANTED</span>
              </div>
            </div>
            <div className="terminal-status-group">
              <div className="terminal-status-item active">
                <span className="status-icon secure"></span>
                <span>SECURE_CONNECTION</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="terminal-body">
          <XTermWrapper
            onInput={handleInput}
            onReady={handleReady}
            prompt={getPrompt()}
          />
        </div>

        <div className="terminal-footer">
          <div className="terminal-notification-area">
            <span className="terminal-notification-label">SYSTEM_LOG:</span>
            <span>Spore OS is currently in development. Aberrations may occur. Use at your own risk!</span>
          </div>
          
          <div className="terminal-actions">
            <a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }} className="terminal-action-btn primary">
              <span>→ INITIATE_BLOG</span>
            </a>
            <a href="/portfolio" onClick={(e) => { e.preventDefault(); navigate('/portfolio'); }} className="terminal-action-btn">
              <span>VIEW_PROJECTS</span>
            </a>
          </div>

          <div className="terminal-protocol-info">
            <div className="terminal-protocol-item">
              <span>PROTOCOL: OAUTH_SPORE_BROWSER</span>
            </div>
            <div className="terminal-protocol-item">
              <span>RESOLVER: MYCELIUM_5.15.0</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CyberTerminal;

