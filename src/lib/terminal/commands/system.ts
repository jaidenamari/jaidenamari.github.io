import type { Command, CommandContext, CommandRegistry } from './index';

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

export function createHelpCommand(registry: CommandRegistry): Command {
  return {
    name: 'help',
    aliases: ['?'],
    description: 'Display available commands',
    usage: 'help [command]',
    execute(args, ctx) {
      if (args.length > 0) {
        const cmd = registry.get(args[0]);
        if (cmd) {
          ctx.printLine(`${COLORS.cyan}${COLORS.bold}${cmd.name}${COLORS.reset}`);
          ctx.printLine(`  ${cmd.description}`);
          ctx.printLine(`  ${COLORS.dim}Usage: ${cmd.usage}${COLORS.reset}`);
          if (cmd.aliases?.length) {
            ctx.printLine(`  ${COLORS.dim}Aliases: ${cmd.aliases.join(', ')}${COLORS.reset}`);
          }
        } else {
          ctx.printError(`help: no such command: ${args[0]}`);
        }
        return;
      }

      ctx.printLine(`${COLORS.cyan}${COLORS.bold}Available Commands${COLORS.reset}`);
      ctx.printLine('');

      const commands = registry.getAll();
      const maxLen = Math.max(...commands.map(c => c.name.length));

      for (const cmd of commands) {
        const padding = ' '.repeat(maxLen - cmd.name.length);
        ctx.printLine(`  ${COLORS.green}${cmd.name}${COLORS.reset}${padding}  ${COLORS.dim}${cmd.description}${COLORS.reset}`);
      }

      ctx.printLine('');
      ctx.printLine(`${COLORS.dim}Type 'help <command>' for more info on a specific command.${COLORS.reset}`);
    },
  };
}

export const clearCommand: Command = {
  name: 'clear',
  aliases: ['cls'],
  description: 'Clear the terminal screen',
  usage: 'clear',
  execute(_args, ctx) {
    ctx.clear();
  },
};

export const whoamiCommand: Command = {
  name: 'whoami',
  description: 'Display current user',
  usage: 'whoami',
  execute(_args, ctx) {
    ctx.printLine('visitor');
  },
};

export const dateCommand: Command = {
  name: 'date',
  description: 'Display current date and time',
  usage: 'date',
  execute(_args, ctx) {
    const now = new Date();
    ctx.printLine(now.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }));
  },
};

export const echoCommand: Command = {
  name: 'echo',
  description: 'Display a line of text',
  usage: 'echo [text...]',
  execute(args, ctx) {
    ctx.printLine(args.join(' '));
  },
};

export const neofetchCommand: Command = {
  name: 'neofetch',
  description: 'Display system information',
  usage: 'neofetch',
  execute(_args, ctx) {
    const ascii = `
${COLORS.green}    ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣤⣶⣶⣶⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀
    ⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀
    ⠀⠀⠀⣿⣿⣿⣿⣿⣿⡟⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀
    ⠀⠀⢀⣿⣿⣿⣿⠿⠋⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀
    ⠀⠀⢸⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⡇⠀⠀
    ⠀⠀⠀⣿⡟⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⠀⠀⠀
    ⠀⠀⠀⢿⡇⠀⠀⢀⣴⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⢸⣿⣿⣿⡿⠀⠀⠀
    ⠀⠀⠀⢸⣧⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⣼⣿⣿⣿⡇⠀⠀⠀
    ⠀⠀⠀⠀⣿⡀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⢀⣿⣿⣿⣿⠀⠀⠀⠀
    ⠀⠀⠀⠀⢸⣇⠘⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⣸⣿⣿⣿⡇⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⢻⣆⠘⢿⣿⣿⣿⣿⡿⠃⠀⠀⣰⣿⣿⣿⡟⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠻⣧⡀⠙⠿⠿⠟⠁⠀⢀⣼⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠈⠻⣷⣤⣤⣤⣤⣾⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠛⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${COLORS.reset}`;

    const info = [
      '',
      `${COLORS.cyan}${COLORS.bold}visitor${COLORS.reset}@${COLORS.magenta}${COLORS.bold}grove${COLORS.reset}`,
      `${COLORS.dim}─────────────────${COLORS.reset}`,
      `${COLORS.cyan}OS${COLORS.reset}: Spore OS 1.0.0`,
      `${COLORS.cyan}Host${COLORS.reset}: Digital Wilderness`,
      `${COLORS.cyan}Kernel${COLORS.reset}: mycelium-5.15.0`,
      `${COLORS.cyan}Shell${COLORS.reset}: spsh 1.0.0`,
      `${COLORS.cyan}Terminal${COLORS.reset}: xterm-256color`,
      `${COLORS.cyan}CPU${COLORS.reset}: Quantum Pathfinder @ ∞ GHz`,
      `${COLORS.cyan}Memory${COLORS.reset}: 128TB silicon-organic hybrid`,
      '',
      `${COLORS.dim}Where digital meets wilderness${COLORS.reset}`,
      '',
    ];

    const asciiLines = ascii.split('\n');
    const maxLines = Math.max(asciiLines.length, info.length);

    for (let i = 0; i < maxLines; i++) {
      const artLine = asciiLines[i] ?? '';
      const infoLine = info[i] ?? '';
      ctx.printLine(`${artLine}  ${infoLine}`);
    }
  },
};

export const fortuneCommand: Command = {
  name: 'fortune',
  description: 'Display a random cyberpunk quote',
  usage: 'fortune',
  execute(_args, ctx) {
    const fortunes = [
      '"The future is already here — it\'s just not evenly distributed." — William Gibson',
      '"We are all cyborgs now." — Donna Haraway',
      '"The street finds its own uses for things." — William Gibson',
      '"Information wants to be free." — Stewart Brand',
      '"Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke',
      '"In the digital realm, we are all architects of our own reality."',
      '"The network is the computer." — John Gage',
      '"Behind every great fortune lies a great crime." — Balzac (Cyberpunk remix)',
      '"Cyberspace: A consensual hallucination." — William Gibson',
      '"The body is obsolete." — Stelarc',
      '"Access to the root is the new class struggle."',
      '"In the forest of the night, the data streams flow eternal."',
    ];

    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    ctx.printLine('');
    ctx.printLine(`${COLORS.cyan}${fortune}${COLORS.reset}`);
    ctx.printLine('');
  },
};

export const systemCommands: Command[] = [
  clearCommand,
  whoamiCommand,
  dateCommand,
  echoCommand,
  neofetchCommand,
  fortuneCommand,
];

