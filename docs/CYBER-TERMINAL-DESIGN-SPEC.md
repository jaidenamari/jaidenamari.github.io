# Spriggan Cyber Terminal - Interactive OS Experience Design Specification

## Overview

This document outlines the design and implementation plan for transforming the Spriggan blog's hero section into an immersive, interactive terminal experience. The goal is to create a unique "CyberOS" aesthetic—**modern, clean, and futuristic**—not a nostalgic retro throwback.

**Key Philosophy:** We're building a *new* fictional operating system, not emulating old ones. Think sci-fi interfaces from *Blade Runner 2049* or *Ex Machina*—sleek, minimal, purposeful.

---

## Project Scope: Two Distinct Workstreams

### Workstream A: Interactive Terminal (This Phase)
Building a functional terminal emulator with:
- Real command input/output
- Virtual file system containing blog posts
- Command history and tab completion
- Navigation integration with react-router

### Workstream B: Visual Aesthetic (Future Phase)  
Enhancing the hero background and overall aesthetic:
- WebGL shader-based atmospheric background
- Layered visual effects (smoke, particles, dithering)
- Terminal chrome and glow effects
- Boot sequence animation

**Current Focus: Workstream A**

---

## Research & Inspiration

### Aether OS (aetheros.computer)

**Overall Aesthetic:**
The site reads as a retro-futuristic, terminal-inspired interface over a dark, atmospheric "OS boot" background. The System Access box is styled like a stylized login prompt from a sci‑fi operating system—a branded, cinematic gateway into an OS, not just a generic form.

**Design Principles to Adopt:**
- Dark, **void-like** background evoking a system console during boot/diagnostics
- Sparse composition: mostly black or near-black with few high-contrast elements
- Clean, minimal UI elements with subtle but deliberate styling touches:
  - Underscores in text labels (e.g., `Identity_String`)
  - Subtle drop shadows that make neon borders pop
  - Strong typography, centered layouts
- "Diegetic UI" / sci‑fi HUD influences, but restrained rather than overloaded

**Technical Implementation (Background Shader):**

The page renders a full-screen `<canvas>` using WebGL with a custom fragment shader composing multiple layers:

| Layer | Description |
|-------|-------------|
| **Base** | Solid near-black with slight green/teal bias |
| **Smoke** | Fractal noise (fBM from simplex/Perlin), slowly translated over time, low contrast, large scale—reads as drifting fog |
| **Triangular Lattice** | UV remapped to triangular grid, noise quantized to produce repeating triangular pixel pattern ("digital fabric") |
| **Dot Matrix Dither** | Screen-space 8×8 or 16×16 Bayer-style pattern applied as threshold, producing evenly spaced pixel-locked dots |
| **Parallax Motion** | Each layer uses different time scales/directions for depth without 3D geometry |
| **Post-processing** | Subtle vignette, minor contrast compression |

The entire effect is computed per-pixel in a single fragment shader. Motion driven solely by a `time` uniform. No DOM layering or particle systems.

### PostHog (posthog.com)

**Design Elements (For Future Reference):**
- Desktop/OS metaphor with filesystem-style navigation
- Draggable windows paradigm
- Custom windowing system via React context providers

*Note: We're not pursuing the PostHog window-management approach in this phase. Keeping it simple and focused.*

---

## Current State Analysis

### Existing Cyber Terminal (`src/components/cyber-terminal.tsx`)

**What It Does:**
- Static terminal with auto-typing animation
- Pre-defined hardcoded messages
- ASCII art logo
- No user interactivity

**Limitations:**
- Not a real terminal—just a passive animation
- No input capability
- Animation plays once then stops

### Current Color Palette

```
Primary: hsl(273, 100%, 50%) - Purple/Magenta
Cyan: #0fce9e (mint-teal)
Aether Green: #41fd9b (bright accent)
Background: #0a0a0f (near-black)
Accents: Magenta (#ff00ff), Cyan (#00ffff)
```

---

# WORKSTREAM A: Interactive Terminal Implementation

## Architecture Overview

### Technology Stack
- **xterm.js** - Industry-standard terminal emulator for web
- **@xterm/addon-fit** - Automatic terminal sizing
- **@xterm/addon-web-links** - Clickable URLs
- Custom React wrapper component

### Core Components

```
src/
├── components/
│   └── cyber-terminal/
│       ├── index.tsx                 # Main export, orchestrates everything
│       ├── xterm-wrapper.tsx         # xterm.js React integration
│       ├── command-handler.ts        # Parses and executes commands
│       └── terminal.css              # Terminal-specific styles
├── lib/
│   └── terminal/
│       ├── virtual-fs.ts             # Virtual file system
│       ├── commands/
│       │   ├── index.ts              # Command registry
│       │   ├── filesystem.ts         # ls, cd, cat, pwd, tree
│       │   ├── navigation.ts         # goto, open, back
│       │   └── system.ts             # help, clear, whoami, date
│       └── completions.ts            # Tab completion logic
└── hooks/
    └── use-terminal.ts               # Terminal state management
```

## Virtual File System (VFS)

### Directory Structure

```
/
├── home/
│   └── visitor/
│       └── .profile
├── blog/
│   ├── artifact-based-docker-deployments.md
│   ├── blog-post-about-setting-up-blogs.md
│   ├── building-multi-tenant-apps-with-mikroorm.md
│   ├── github-pages-revamp-plan.md
│   ├── hello-moon.md
│   ├── how-to-update-subnet-routes-in-tailscale.md
│   ├── in-the-woods.md
│   └── tailscale-pulumi-implementation-guide.md
├── projects/
│   └── README.md
├── about/
│   └── README.md
└── secrets/
    └── .hidden/
        └── easter-eggs.txt
```

### TypeScript Interfaces

```typescript
interface VirtualNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Map<string, VirtualNode>;
  metadata?: {
    title?: string;
    slug?: string;
    date?: string;
    hidden?: boolean;
  };
}

interface VirtualFileSystem {
  root: VirtualNode;
  cwd: string;
  resolve(path: string): VirtualNode | null;
  list(path: string): VirtualNode[];
  read(path: string): string | null;
  exists(path: string): boolean;
  isDirectory(path: string): boolean;
  absolutePath(relativePath: string): string;
}
```

## Command Registry

### Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `help` | Display available commands | `help` or `help ls` |
| `ls` | List directory contents | `ls`, `ls -a`, `ls /blog` |
| `cd` | Change directory | `cd /blog`, `cd ..`, `cd ~` |
| `cat` | Display file contents | `cat hello-moon.md` |
| `pwd` | Print working directory | `pwd` |
| `clear` | Clear terminal screen | `clear` |
| `whoami` | Display current user | `whoami` → `visitor` |

### Navigation Commands

| Command | Description | Example |
|---------|-------------|---------|
| `goto` | Navigate to a page | `goto blog`, `goto about` |
| `open` | Open a blog post | `open hello-moon` |

### Easter Egg Commands (Phase 2)

| Command | Description |
|---------|-------------|
| `neofetch` | System info with ASCII art |
| `matrix` | Matrix rain animation |
| `fortune` | Random cyberpunk quote |

### Command Implementation Pattern

```typescript
interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  execute(args: string[], ctx: CommandContext): string | void;
}

interface CommandContext {
  fs: VirtualFileSystem;
  terminal: XTermInstance;
  navigate: (path: string) => void;
  print: (text: string) => void;
  printError: (text: string) => void;
}

class CommandRegistry {
  private commands = new Map<string, Command>();
  
  register(cmd: Command): void;
  get(name: string): Command | undefined;
  execute(input: string, ctx: CommandContext): void;
  getCompletions(partial: string): string[];
}
```

## Terminal Features

### Input Handling
- **Command History**: Up/Down arrows navigate history (localStorage persisted)
- **Tab Completion**: Commands and file paths
- **Ctrl+C**: Cancel current input
- **Ctrl+L**: Clear screen (alias for `clear`)

### Visual Styling (Minimal for Now)
- Clean dark background with cyan/green text
- Simple prompt: `visitor@spriggan:~$ `
- Error messages in red/magenta
- Directory listings with color coding (dirs vs files)

### ANSI Color Codes

```typescript
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};
```

## Integration with React Router

The terminal's `goto` and `open` commands integrate with the existing routing:

```typescript
// In command execution context
const navigate = useNavigate();

// goto command
const gotoCommand: Command = {
  name: 'goto',
  execute(args, ctx) {
    const target = args[0];
    const routes: Record<string, string> = {
      'home': '/',
      'blog': '/blog',
      'projects': '/portfolio',
      'portfolio': '/portfolio',
      'about': '/about',
    };
    const route = routes[target];
    if (route) {
      ctx.navigate(route);
    } else {
      ctx.printError(`Unknown destination: ${target}`);
    }
  }
};

// open command (for blog posts)
const openCommand: Command = {
  name: 'open',
  execute(args, ctx) {
    const slug = args[0]?.replace('.md', '');
    if (ctx.fs.exists(`/blog/${slug}.md`)) {
      ctx.navigate(`/blog/${slug}`);
    } else {
      ctx.printError(`Post not found: ${slug}`);
    }
  }
};
```

---

# WORKSTREAM B: Visual Aesthetic (Future Phase)

*Documented here for reference, but not implemented in current phase.*

## Background Shader Approach

Using Three.js (already in deps) with a fullscreen quad and custom fragment shader:

### Shader Layers

1. **Base Color**: Near-black with subtle teal bias (`#0a0f0f`)
2. **Smoke Layer**: fBM noise, slowly drifting, very low contrast
3. **Triangular Lattice**: Skewed UV grid with quantized noise
4. **Dot Matrix**: Bayer dithering pattern, pixel-locked
5. **Vignette**: Subtle edge darkening

### Implementation Notes

```glsl
// Pseudocode for fragment shader structure
uniform float uTime;
uniform vec2 uResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  // Base color
  vec3 color = vec3(0.04, 0.06, 0.06);
  
  // Add smoke layer (fBM noise)
  float smoke = fbm(uv * 3.0 + uTime * 0.1);
  color += vec3(0.0, smoke * 0.05, smoke * 0.04);
  
  // Triangular lattice pattern
  // ... skewed grid sampling ...
  
  // Dot matrix dithering
  // ... Bayer matrix threshold ...
  
  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.5;
  color *= vignette;
  
  gl_FragColor = vec4(color, 1.0);
}
```

## Terminal Chrome (Future)

Clean, modern status bar—not retro. Think:
- Minimal indicators: connection status, current path
- Subtle glow effects on borders
- No chunky window controls or excessive decoration

---

## Dependencies to Add

```bash
pnpm add @xterm/xterm @xterm/addon-fit @xterm/addon-web-links
```

---

## Implementation Checklist

### Phase 1: Terminal Foundation ← **CURRENT**
- [ ] Install xterm.js dependencies
- [ ] Create xterm React wrapper component
- [ ] Implement VFS with hardcoded structure
- [ ] Build command registry with core commands
- [ ] Add command history (up/down arrows)
- [ ] Basic tab completion
- [ ] Integrate with existing hero section
- [ ] Style terminal to match site aesthetic

### Phase 2: Content & Navigation
- [ ] Load blog post metadata into VFS
- [ ] Implement `goto` and `open` commands
- [ ] Add `neofetch` command with ASCII art
- [ ] Easter egg commands

### Phase 3: Visual Enhancement (Workstream B)
- [ ] WebGL background shader
- [ ] Enhanced terminal chrome
- [ ] Boot sequence animation
- [ ] Refined glow/shadow effects

---

## References

- [xterm.js Documentation](https://xtermjs.org/docs/)
- [The Book of Shaders](https://thebookofshaders.com/)
- [Simplex Noise](https://github.com/jwagner/simplex-noise.js)

---

*Document Version: 1.1*  
*Updated: December 2025*  
*Branch: feature/interactive-cyber-terminal*
