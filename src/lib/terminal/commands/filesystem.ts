import type { Command, CommandContext } from './index';
import { getDisplayPath } from '../virtual-fs';

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

export const pwdCommand: Command = {
  name: 'pwd',
  description: 'Print the current working directory',
  usage: 'pwd',
  execute(_args, ctx) {
    ctx.printLine(ctx.fs.cwd);
  },
};

export const cdCommand: Command = {
  name: 'cd',
  description: 'Change the current directory',
  usage: 'cd [directory]',
  execute(args, ctx) {
    const target = args[0] ?? '~';
    
    if (!ctx.fs.setCwd(target)) {
      const absPath = ctx.fs.absolutePath(target);
      if (!ctx.fs.exists(absPath)) {
        ctx.printError(`cd: no such directory: ${target}`);
      } else {
        ctx.printError(`cd: not a directory: ${target}`);
      }
    }
  },
};

export const lsCommand: Command = {
  name: 'ls',
  aliases: ['dir'],
  description: 'List directory contents',
  usage: 'ls [-a] [-l] [path]',
  execute(args, ctx) {
    let showHidden = false;
    let longFormat = false;
    let targetPath = ctx.fs.cwd;

    for (const arg of args) {
      if (arg === '-a' || arg === '--all') {
        showHidden = true;
      } else if (arg === '-l' || arg === '--long') {
        longFormat = true;
      } else if (arg === '-la' || arg === '-al') {
        showHidden = true;
        longFormat = true;
      } else if (!arg.startsWith('-')) {
        targetPath = arg;
      }
    }

    const absPath = ctx.fs.absolutePath(targetPath);
    
    if (!ctx.fs.exists(absPath)) {
      ctx.printError(`ls: cannot access '${targetPath}': No such file or directory`);
      return;
    }

    if (!ctx.fs.isDirectory(absPath)) {
      const node = ctx.fs.resolve(absPath);
      if (node) {
        ctx.printLine(formatEntry(node, longFormat));
      }
      return;
    }

    const items = ctx.fs.list(absPath);
    const filtered = showHidden 
      ? items 
      : items.filter(item => !item.name.startsWith('.'));

    if (filtered.length === 0) {
      return;
    }

    if (longFormat) {
      ctx.printLine(`${COLORS.dim}total ${filtered.length}${COLORS.reset}`);
      for (const item of filtered) {
        ctx.printLine(formatEntry(item, true));
      }
    } else {
      const formatted = filtered.map(item => {
        if (item.type === 'directory') {
          return `${COLORS.blue}${COLORS.bold}${item.name}/${COLORS.reset}`;
        }
        if (item.name.endsWith('.md')) {
          return `${COLORS.green}${item.name}${COLORS.reset}`;
        }
        return item.name;
      });
      ctx.printLine(formatted.join('  '));
    }
  },
};

function formatEntry(item: { name: string; type: string; metadata?: { date?: string } }, long: boolean): string {
  if (!long) {
    return item.name;
  }

  const typeChar = item.type === 'directory' ? 'd' : '-';
  const perms = item.type === 'directory' ? 'rwxr-xr-x' : 'rw-r--r--';
  const date = item.metadata?.date ?? 'Dec 24 2024';
  const name = item.type === 'directory' 
    ? `${COLORS.blue}${COLORS.bold}${item.name}/${COLORS.reset}`
    : item.name.endsWith('.md')
      ? `${COLORS.green}${item.name}${COLORS.reset}`
      : item.name;

  return `${typeChar}${perms}  visitor  ${COLORS.dim}${date}${COLORS.reset}  ${name}`;
}

export const catCommand: Command = {
  name: 'cat',
  description: 'Display file contents',
  usage: 'cat <file>',
  execute(args, ctx) {
    if (args.length === 0) {
      ctx.printError('cat: missing file operand');
      return;
    }

    const filePath = args[0];
    const absPath = ctx.fs.absolutePath(filePath);

    if (!ctx.fs.exists(absPath)) {
      ctx.printError(`cat: ${filePath}: No such file or directory`);
      return;
    }

    if (ctx.fs.isDirectory(absPath)) {
      ctx.printError(`cat: ${filePath}: Is a directory`);
      return;
    }

    const content = ctx.fs.read(absPath);
    if (content !== null) {
      const node = ctx.fs.resolve(absPath);
      
      if (node?.metadata?.title) {
        ctx.printLine(`${COLORS.cyan}${COLORS.bold}# ${node.metadata.title}${COLORS.reset}`);
        if (node.metadata.date) {
          ctx.printLine(`${COLORS.dim}Date: ${node.metadata.date}${COLORS.reset}`);
        }
        if (node.metadata.description) {
          ctx.printLine(`${COLORS.dim}${node.metadata.description}${COLORS.reset}`);
        }
        ctx.printLine('');
        ctx.printLine(`${COLORS.yellow}Use 'open ${node.metadata.slug}' to read the full post in the browser.${COLORS.reset}`);
      } else {
        ctx.printLine(content);
      }
    }
  },
};

export const treeCommand: Command = {
  name: 'tree',
  description: 'Display directory tree',
  usage: 'tree [path]',
  execute(args, ctx) {
    const targetPath = args[0] ?? ctx.fs.cwd;
    const absPath = ctx.fs.absolutePath(targetPath);

    if (!ctx.fs.exists(absPath)) {
      ctx.printError(`tree: ${targetPath}: No such file or directory`);
      return;
    }

    if (!ctx.fs.isDirectory(absPath)) {
      ctx.printLine(targetPath);
      return;
    }

    ctx.printLine(`${COLORS.blue}${COLORS.bold}${getDisplayPath(absPath)}${COLORS.reset}`);
    printTree(ctx, absPath, '');
  },
};

function printTree(ctx: CommandContext, path: string, prefix: string): void {
  const items = ctx.fs.list(path).filter(item => !item.name.startsWith('.'));
  
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const name = item.type === 'directory'
      ? `${COLORS.blue}${COLORS.bold}${item.name}/${COLORS.reset}`
      : `${COLORS.green}${item.name}${COLORS.reset}`;
    
    ctx.printLine(`${prefix}${connector}${name}`);

    if (item.type === 'directory') {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      printTree(ctx, `${path}/${item.name}`, newPrefix);
    }
  });
}

export const filesystemCommands: Command[] = [
  pwdCommand,
  cdCommand,
  lsCommand,
  catCommand,
  treeCommand,
];

