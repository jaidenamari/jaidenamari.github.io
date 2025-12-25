export interface VirtualNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Map<string, VirtualNode>;
  metadata?: {
    title?: string;
    slug?: string;
    date?: string;
    description?: string;
    hidden?: boolean;
  };
}

export interface VirtualFileSystem {
  root: VirtualNode;
  cwd: string;
  resolve(path: string): VirtualNode | null;
  list(path: string): VirtualNode[];
  read(path: string): string | null;
  exists(path: string): boolean;
  isDirectory(path: string): boolean;
  absolutePath(relativePath: string): string;
  setCwd(path: string): boolean;
}

function createDirectory(name: string, children?: Map<string, VirtualNode>): VirtualNode {
  return {
    name,
    type: 'directory',
    children: children ?? new Map(),
  };
}

function createFile(name: string, content: string, metadata?: VirtualNode['metadata']): VirtualNode {
  return {
    name,
    type: 'file',
    content,
    metadata,
  };
}

export function createFileSystem(posts: Array<{ slug: string; title: string; date: string; description: string; content: string }>): VirtualFileSystem {
  const blogDir = createDirectory('blog');
  
  for (const post of posts) {
    const fileName = `${post.slug}.md`;
    blogDir.children!.set(fileName, createFile(fileName, post.content, {
      title: post.title,
      slug: post.slug,
      date: post.date,
      description: post.description,
    }));
  }

  const root = createDirectory('', new Map([
    ['home', createDirectory('home', new Map([
      ['visitor', createDirectory('visitor', new Map([
        ['.profile', createFile('.profile', `# Spriggan OS User Profile
export USER="visitor"
export HOME="/home/visitor"
export SHELL="/bin/spsh"
export TERM="xterm-256color"

echo "Welcome to the digital wilderness."
`, { hidden: true })],
      ]))],
    ]))],
    ['blog', blogDir],
    ['projects', createDirectory('projects', new Map([
      ['README.md', createFile('README.md', `# Projects

A collection of digital artifacts and code experiments.

Navigate to /portfolio for the full project showcase.
`)],
    ]))],
    ['about', createDirectory('about', new Map([
      ['README.md', createFile('README.md', `# About

Welcome to Spriggan - where digital meets wilderness.

This terminal provides an alternative way to explore the site.
Type 'help' for available commands.

Navigate to /about for the full about page.
`)],
    ]))],
    ['secrets', createDirectory('secrets', new Map([
      ['.hidden', createDirectory('.hidden', new Map([
        ['easter-eggs.txt', createFile('easter-eggs.txt', `🥚 You found the secret stash!

Try these commands:
- neofetch
- matrix  
- fortune

More secrets await those who explore...
`, { hidden: true })],
      ]))],
    ]))],
  ]));

  let currentWorkingDirectory = '/home/visitor';

  const fs: VirtualFileSystem = {
    root,
    get cwd() {
      return currentWorkingDirectory;
    },
    set cwd(path: string) {
      currentWorkingDirectory = path;
    },

    resolve(path: string): VirtualNode | null {
      const absPath = this.absolutePath(path);
      if (absPath === '/') return root;

      const parts = absPath.split('/').filter(Boolean);
      let current: VirtualNode = root;

      for (const part of parts) {
        if (current.type !== 'directory' || !current.children) {
          return null;
        }
        const next = current.children.get(part);
        if (!next) return null;
        current = next;
      }

      return current;
    },

    list(path: string): VirtualNode[] {
      const node = this.resolve(path);
      if (!node || node.type !== 'directory' || !node.children) {
        return [];
      }
      return Array.from(node.children.values());
    },

    read(path: string): string | null {
      const node = this.resolve(path);
      if (!node || node.type !== 'file') {
        return null;
      }
      return node.content ?? null;
    },

    exists(path: string): boolean {
      return this.resolve(path) !== null;
    },

    isDirectory(path: string): boolean {
      const node = this.resolve(path);
      return node?.type === 'directory';
    },

    absolutePath(relativePath: string): string {
      if (relativePath.startsWith('/')) {
        return normalizePath(relativePath);
      }

      if (relativePath === '~' || relativePath.startsWith('~/')) {
        const homeRelative = relativePath.slice(1) || '';
        return normalizePath('/home/visitor' + homeRelative);
      }

      const combined = currentWorkingDirectory + '/' + relativePath;
      return normalizePath(combined);
    },

    setCwd(path: string): boolean {
      const absPath = this.absolutePath(path);
      if (this.isDirectory(absPath)) {
        currentWorkingDirectory = absPath;
        return true;
      }
      return false;
    },
  };

  return fs;
}

function normalizePath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  const result: string[] = [];

  for (const part of parts) {
    if (part === '..') {
      result.pop();
    } else if (part !== '.') {
      result.push(part);
    }
  }

  return '/' + result.join('/');
}

export function getDisplayPath(cwd: string): string {
  if (cwd === '/home/visitor') return '~';
  if (cwd.startsWith('/home/visitor/')) return '~' + cwd.slice('/home/visitor'.length);
  return cwd;
}

