import type { Command } from './index';

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
};

const ROUTE_MAP: Record<string, string> = {
  'home': '/',
  '/': '/',
  'blog': '/blog',
  '/blog': '/blog',
  'projects': '/portfolio',
  'portfolio': '/portfolio',
  '/portfolio': '/portfolio',
  '/projects': '/portfolio',
  'about': '/about',
  '/about': '/about',
};

export const gotoCommand: Command = {
  name: 'goto',
  aliases: ['go', 'nav'],
  description: 'Navigate to a page',
  usage: 'goto <page>',
  execute(args, ctx) {
    if (args.length === 0) {
      ctx.printLine(`${COLORS.cyan}Available destinations:${COLORS.reset}`);
      ctx.printLine(`  ${COLORS.green}home${COLORS.reset}      - Home page`);
      ctx.printLine(`  ${COLORS.green}blog${COLORS.reset}      - Blog listing`);
      ctx.printLine(`  ${COLORS.green}projects${COLORS.reset}  - Project portfolio`);
      ctx.printLine(`  ${COLORS.green}about${COLORS.reset}     - About page`);
      return;
    }

    const target = args[0].toLowerCase();
    const route = ROUTE_MAP[target];

    if (route) {
      ctx.printLine(`${COLORS.dim}Navigating to ${target}...${COLORS.reset}`);
      setTimeout(() => ctx.navigate(route), 300);
    } else {
      ctx.printError(`Unknown destination: ${target}`);
      ctx.printLine(`${COLORS.dim}Type 'goto' to see available destinations.${COLORS.reset}`);
    }
  },
};

export const openCommand: Command = {
  name: 'open',
  aliases: ['read', 'view'],
  description: 'Open a blog post in the browser',
  usage: 'open <post-slug>',
  execute(args, ctx) {
    if (args.length === 0) {
      ctx.printError('open: missing post slug');
      ctx.printLine(`${COLORS.dim}Usage: open <post-slug>${COLORS.reset}`);
      ctx.printLine(`${COLORS.dim}Example: open hello-moon${COLORS.reset}`);
      ctx.printLine(`${COLORS.dim}Tip: Use 'ls /blog' to see available posts.${COLORS.reset}`);
      return;
    }

    const slug = args[0].replace(/\.md$/, '');
    const filePath = `/blog/${slug}.md`;

    if (ctx.fs.exists(filePath)) {
      const node = ctx.fs.resolve(filePath);
      const title = node?.metadata?.title ?? slug;
      ctx.printLine(`${COLORS.dim}Opening "${title}"...${COLORS.reset}`);
      setTimeout(() => ctx.navigate(`/blog/${slug}`), 300);
    } else {
      ctx.printError(`Post not found: ${slug}`);
      ctx.printLine(`${COLORS.dim}Use 'ls /blog' to see available posts.${COLORS.reset}`);
    }
  },
};

export const homeCommand: Command = {
  name: 'home',
  description: 'Navigate to the home page',
  usage: 'home',
  execute(_args, ctx) {
    ctx.printLine(`${COLORS.dim}Returning home...${COLORS.reset}`);
    setTimeout(() => ctx.navigate('/'), 300);
  },
};

export const navigationCommands: Command[] = [
  gotoCommand,
  openCommand,
  homeCommand,
];

