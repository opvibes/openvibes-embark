// The agents PDD installs into, with the native command(s) for each. Kept in sync
// with the repo README's "Install in any agent" section.

export type AgentIcon =
  | { kind: "brand"; slug: string } // monochrome brand mark from brandPaths
  | { kind: "img"; src: string } // full-color image (e.g. the Claude mascot)
  | { kind: "monogram"; text: string }; // fallback for agents without a brand mark

export interface Agent {
  id: string;
  name: string;
  org: string | null; // the company behind the agent, if any
  icon: AgentIcon;
  commands: string[]; // one entry per command — each renders as its own code block
  note?: string;
}

export const AGENTS: Agent[] = [
  {
    id: "claude",
    name: "Claude Code",
    org: "Anthropic",
    icon: { kind: "img", src: "/media/agents/claude-code.png" },
    commands: [
      "claude plugin marketplace add blpsoares/parity-driven-development --scope project",
      "claude plugin install pdd@parity-driven-development --scope project",
    ],
    note: "Run these inside your target project — --scope project writes to that project, not your home. If you run them from your home directory, they install into your home config.",
  },
  {
    id: "codex",
    name: "Codex",
    org: "OpenAI",
    icon: { kind: "brand", slug: "openai" },
    commands: ["codex plugin marketplace add blpsoares/parity-driven-development"],
    note: "Then open /plugins and install PDD.",
  },
  {
    id: "cursor",
    name: "Cursor",
    org: "Anysphere",
    icon: { kind: "brand", slug: "cursor" },
    commands: ["npx skills add https://github.com/blpsoares/parity-driven-development"],
    note: "Or import the repo as a Team Marketplace in Cursor.",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    org: "GitHub",
    icon: { kind: "brand", slug: "github" },
    commands: [
      "copilot plugin marketplace add blpsoares/parity-driven-development",
      "copilot plugin install pdd@parity-driven-development",
    ],
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    org: "Google",
    icon: { kind: "brand", slug: "googlegemini" },
    commands: ["gemini extensions install https://github.com/blpsoares/parity-driven-development"],
  },
  {
    id: "antigravity",
    name: "Antigravity",
    org: "Google",
    icon: { kind: "brand", slug: "google" },
    commands: ["agy plugin install https://github.com/blpsoares/parity-driven-development"],
  },
  {
    id: "droid",
    name: "Factory Droid",
    org: "Factory",
    icon: { kind: "monogram", text: "F" },
    commands: [
      "droid plugin marketplace add https://github.com/blpsoares/parity-driven-development",
      "droid plugin install pdd@parity-driven-development",
    ],
  },
  {
    id: "kimi",
    name: "Kimi Code",
    org: "Moonshot AI",
    icon: { kind: "brand", slug: "moonshotai" },
    commands: ["/plugins install https://github.com/blpsoares/parity-driven-development"],
  },
  {
    id: "opencode",
    name: "OpenCode",
    org: null,
    icon: { kind: "brand", slug: "opencode" },
    commands: ['{ "plugin": ["pdd@git+https://github.com/blpsoares/parity-driven-development.git"] }'],
    note: "Add to your opencode.json, then restart OpenCode.",
  },
  {
    id: "pi",
    name: "Pi",
    org: "Earendil",
    icon: { kind: "monogram", text: "π" },
    commands: ["pi install git:github.com/blpsoares/parity-driven-development"],
  },
];
