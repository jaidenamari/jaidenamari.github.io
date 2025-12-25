import { useEffect, useRef, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

export interface XTermHandle {
  write: (text: string) => void;
  writeLine: (text: string) => void;
  clear: () => void;
  focus: () => void;
}

interface XTermWrapperProps {
  onInput: (data: string) => void;
  onReady: (handle: XTermHandle) => void;
  prompt: string;
}

export function XTermWrapper({ onInput, onReady, prompt }: XTermWrapperProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBufferRef = useRef('');
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);

  const writePrompt = useCallback(() => {
    if (xtermRef.current) {
      xtermRef.current.write(prompt);
    }
  }, [prompt]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const terminal = new Terminal({
      theme: {
        background: 'rgba(10, 10, 15, 0.95)',
        foreground: '#e0e0e0',
        cursor: '#0fce9e',
        cursorAccent: '#0a0a0f',
        selectionBackground: 'rgba(15, 206, 158, 0.3)',
        black: '#0a0a0f',
        red: '#ff4444',
        green: '#0fce9e',
        yellow: '#ffaa00',
        blue: '#6699ff',
        magenta: '#ff00ff',
        cyan: '#0fce9e',
        white: '#e0e0e0',
        brightBlack: '#666666',
        brightRed: '#ff6666',
        brightGreen: '#41fd9b',
        brightYellow: '#ffcc00',
        brightBlue: '#88bbff',
        brightMagenta: '#ff66ff',
        brightCyan: '#41fd9b',
        brightWhite: '#ffffff',
      },
      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, Monaco, monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);

    terminal.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    const handle: XTermHandle = {
      write: (text: string) => terminal.write(text),
      writeLine: (text: string) => terminal.writeln(text),
      clear: () => {
        terminal.clear();
        terminal.write('\x1b[H');
      },
      focus: () => terminal.focus(),
    };

    onReady(handle);
    writePrompt();

    terminal.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) {
        terminal.writeln('');
        const input = inputBufferRef.current.trim();
        
        if (input) {
          historyRef.current.push(input);
          historyIndexRef.current = historyRef.current.length;
        }
        
        onInput(input);
        inputBufferRef.current = '';
        writePrompt();
      } else if (code === 127 || code === 8) {
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);
          terminal.write('\b \b');
        }
      } else if (code === 27) {
        if (data === '\x1b[A') {
          if (historyRef.current.length > 0 && historyIndexRef.current > 0) {
            historyIndexRef.current--;
            const historyItem = historyRef.current[historyIndexRef.current];
            clearCurrentLine(terminal, inputBufferRef.current.length);
            inputBufferRef.current = historyItem;
            terminal.write(historyItem);
          }
        } else if (data === '\x1b[B') {
          if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current++;
            const historyItem = historyRef.current[historyIndexRef.current];
            clearCurrentLine(terminal, inputBufferRef.current.length);
            inputBufferRef.current = historyItem;
            terminal.write(historyItem);
          } else if (historyIndexRef.current === historyRef.current.length - 1) {
            historyIndexRef.current = historyRef.current.length;
            clearCurrentLine(terminal, inputBufferRef.current.length);
            inputBufferRef.current = '';
          }
        }
      } else if (code === 3) {
        terminal.writeln('^C');
        inputBufferRef.current = '';
        writePrompt();
      } else if (code === 12) {
        terminal.clear();
        terminal.write('\x1b[H');
        writePrompt();
      } else if (code === 21) {
        clearCurrentLine(terminal, inputBufferRef.current.length);
        inputBufferRef.current = '';
      } else if (data === '\t') {
        //TODO: Tab completion would go here
      } else if (code >= 32) {
        inputBufferRef.current += data;
        terminal.write(data);
      }
    });

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      terminal.dispose();
    };
  }, [onInput, onReady, writePrompt, prompt]);

  return (
    <div
      ref={terminalRef}
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  );
}

function clearCurrentLine(terminal: Terminal, length: number) {
  for (let i = 0; i < length; i++) {
    terminal.write('\b \b');
  }
}


