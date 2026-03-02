import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface AgentConfig {
  name: string;
  aliases: string[];
  skill: { project: string; global: string };
  command?: { project: string; global: string; format: "frontmatter" | "plain" };
}

const AGENTS: AgentConfig[] = [
  {
    name: "Claude Code",
    aliases: ["claude"],
    skill: {
      project: ".claude/skills/flowbook",
      global: ".claude/skills/flowbook",
    },
    command: {
      project: ".claude/commands",
      global: ".claude/commands",
      format: "frontmatter",
    },
  },
  {
    name: "OpenAI Codex",
    aliases: ["codex"],
    skill: {
      project: ".agents/skills/flowbook",
      global: ".codex/skills/flowbook",
    },
  },
  {
    name: "VS Code / GitHub Copilot",
    aliases: ["copilot", "vscode"],
    skill: {
      project: ".github/skills/flowbook",
      global: ".copilot/skills/flowbook",
    },
  },
  {
    name: "Google Antigravity",
    aliases: ["antigravity"],
    skill: {
      project: ".agent/skills/flowbook",
      global: ".gemini/antigravity/skills/flowbook",
    },
  },
  {
    name: "Gemini CLI",
    aliases: ["gemini"],
    skill: {
      project: ".gemini/skills/flowbook",
      global: ".gemini/skills/flowbook",
    },
  },
  {
    name: "Cursor",
    aliases: ["cursor"],
    skill: {
      project: ".cursor/skills/flowbook",
      global: ".cursor/skills/flowbook",
    },
    command: {
      project: ".cursor/commands",
      global: ".cursor/commands",
      format: "plain",
    },
  },
  {
    name: "Windsurf",
    aliases: ["windsurf"],
    skill: {
      project: ".windsurf/skills/flowbook",
      global: ".codeium/windsurf/skills/flowbook",
    },
    command: {
      project: ".windsurf/workflows",
      global: ".codeium/windsurf/workflows",
      format: "plain",
    },
  },
  {
    name: "AmpCode",
    aliases: ["amp"],
    skill: {
      project: ".amp/skills/flowbook",
      global: ".config/agents/skills/flowbook",
    },
  },
  {
    name: "OpenCode",
    aliases: ["opencode"],
    skill: {
      project: ".opencode/skills/flowbook",
      global: ".config/opencode/skills/flowbook",
    },
    command: {
      project: ".opencode/command",
      global: ".config/opencode/command",
      format: "frontmatter",
    },
  },
];

function getSkillSrc(): string {
  return resolve(__dirname, "..", "src", "skills", "flowbook", "SKILL.md");
}

function getCommandSrc(format: "frontmatter" | "plain"): string {
  const file = format === "frontmatter" ? "flowbook.md" : "flowbook.plain.md";
  return resolve(__dirname, "..", "src", "commands", file);
}

function resolveAgents(agentArg: string): AgentConfig[] {
  if (agentArg === "all") return AGENTS;

  const lower = agentArg.toLowerCase();
  const found = AGENTS.filter(
    (a) =>
      a.aliases.includes(lower) ||
      a.name.toLowerCase().includes(lower),
  );

  if (found.length === 0) {
    console.error(`  Unknown agent: "${agentArg}"`);
    console.error(`  Available: all, ${AGENTS.flatMap((a) => a.aliases).join(", ")}`);
    process.exit(1);
  }

  return found;
}

function installFile(src: string, destDir: string, destFilename: string): boolean {
  const dest = resolve(destDir, destFilename);
  if (existsSync(dest)) return false;
  mkdirSync(destDir, { recursive: true });
  copyFileSync(src, dest);
  return true;
}

export function installSkills(agentArg: string, global: boolean): void {
  const agents = resolveAgents(agentArg);
  const base = global ? homedir() : process.cwd();
  const skillSrc = getSkillSrc();

  if (!existsSync(skillSrc)) {
    console.error("  ✗ Skill source file not found. Reinstall flowbook.");
    process.exit(1);
  }

  let skillCount = 0;
  let cmdCount = 0;

  for (const agent of agents) {
    const skillDir = resolve(base, global ? agent.skill.global : agent.skill.project);
    if (installFile(skillSrc, skillDir, "SKILL.md")) {
      skillCount++;
    }

    if (agent.command) {
      const cmdSrc = getCommandSrc(agent.command.format);
      if (existsSync(cmdSrc)) {
        const cmdDir = resolve(base, global ? agent.command.global : agent.command.project);
        if (installFile(cmdSrc, cmdDir, "flowbook.md")) {
          cmdCount++;
        }
      }
    }
  }

  const scope = global ? "global" : "project";
  const agentNames = agents.map((a) => a.name).join(", ");

  if (skillCount > 0 || cmdCount > 0) {
    if (skillCount > 0) console.log(`  ✓ Installed skill to ${skillCount} ${scope} director${skillCount > 1 ? "ies" : "y"}`);
    if (cmdCount > 0) console.log(`  ✓ Installed /flowbook command to ${cmdCount} ${scope} director${cmdCount > 1 ? "ies" : "y"}`);
    console.log(`  Agents: ${agentNames}`);
  } else {
    console.log(`  ✓ Already installed for: ${agentNames}`);
  }
}

/** Used by init.ts — installs skills only (no commands) to all agents at project level */
export function installAllProjectSkills(): number {
  const cwd = process.cwd();
  const skillSrc = getSkillSrc();
  if (!existsSync(skillSrc)) return 0;

  let installed = 0;
  for (const agent of AGENTS) {
    const dir = resolve(cwd, agent.skill.project);
    if (installFile(skillSrc, dir, "SKILL.md")) {
      installed++;
    }
  }
  return installed;
}

export function printSkillUsage(): void {
  console.log(`
  flowbook skill — Install AI agent skill & /flowbook command

  Usage:
    flowbook skill <agent>           Install to project
    flowbook skill <agent> --global  Install globally
    flowbook skill <agent> -g        Install globally (short)

  Agents:
    all          All supported agents
    claude       Claude Code
    codex        OpenAI Codex
    copilot      VS Code / GitHub Copilot
    antigravity  Google Antigravity
    gemini       Gemini CLI
    cursor       Cursor
    windsurf     Windsurf (Codeium)
    amp          AmpCode
    opencode     OpenCode / oh-my-opencode

  Examples:
    flowbook skill all              Install to all agents (project)
    flowbook skill opencode -g      Install globally for OpenCode
    flowbook skill claude --global  Install globally for Claude Code
`);
}
