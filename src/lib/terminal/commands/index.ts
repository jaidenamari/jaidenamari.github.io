import type { VirtualFileSystem } from '../virtual-fs';

export interface CommandContext {
  fs: VirtualFileSystem;
  print: (text: string) => void;
  printLine: (text: string) => void;
  printError: (text: string) => void;
  clear: () => void;
  navigate: (path: string) => void;
}

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  execute(args: string[], ctx: CommandContext): void | Promise<void>;
}

export class CommandRegistry {
  private commands = new Map<string, Command>();
  private aliasMap = new Map<string, string>();

  register(cmd: Command): void {
    this.commands.set(cmd.name, cmd);
    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        this.aliasMap.set(alias, cmd.name);
      }
    }
  }

  get(name: string): Command | undefined {
    const resolved = this.aliasMap.get(name) ?? name;
    return this.commands.get(resolved);
  }

  getAll(): Command[] {
    return Array.from(this.commands.values());
  }

  async execute(input: string, ctx: CommandContext): Promise<void> {
    const trimmed = input.trim();
    if (!trimmed) return;

    const parts = parseCommandLine(trimmed);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const cmd = this.get(cmdName);
    if (!cmd) {
      ctx.printError(`Command not found: ${cmdName}`);
      ctx.printLine("Type 'help' for available commands.");
      return;
    }

    try {
      await cmd.execute(args, ctx);
    } catch (err) {
      ctx.printError(`Error executing ${cmdName}: ${err}`);
    }
  }

  getCompletions(partial: string, ctx: CommandContext): string[] {
    const parts = parseCommandLine(partial);
    
    if (parts.length <= 1) {
      const cmdPartial = parts[0]?.toLowerCase() ?? '';
      const cmdNames = Array.from(this.commands.keys());
      const aliases = Array.from(this.aliasMap.keys());
      const all = [...cmdNames, ...aliases];
      return all.filter(name => name.startsWith(cmdPartial));
    }

    const lastPart = parts[parts.length - 1];
    return getPathCompletions(lastPart, ctx.fs);
  }
}

function parseCommandLine(input: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';

  for (const char of input) {
    if (inQuote) {
      if (char === quoteChar) {
        inQuote = false;
      } else {
        current += char;
      }
    } else if (char === '"' || char === "'") {
      inQuote = true;
      quoteChar = char;
    } else if (char === ' ') {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

function getPathCompletions(partial: string, fs: VirtualFileSystem): string[] {
  let dirPath: string;
  let prefix: string;

  const lastSlash = partial.lastIndexOf('/');
  if (lastSlash === -1) {
    dirPath = fs.cwd;
    prefix = partial;
  } else {
    dirPath = partial.slice(0, lastSlash) || '/';
    prefix = partial.slice(lastSlash + 1);
  }

  const absDir = fs.absolutePath(dirPath);
  const items = fs.list(absDir);
  
  const matches = items
    .filter(item => !item.metadata?.hidden)
    .filter(item => item.name.startsWith(prefix))
    .map(item => {
      const base = lastSlash === -1 ? '' : partial.slice(0, lastSlash + 1);
      const suffix = item.type === 'directory' ? '/' : '';
      return base + item.name + suffix;
    });

  return matches;
}


