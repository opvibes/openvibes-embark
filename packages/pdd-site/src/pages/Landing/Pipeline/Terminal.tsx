import type { ReactNode } from "react";

interface TerminalProps {
  command: string;
  /** "$" for a real shell command, ">" for a Claude Code slash command typed in chat */
  prompt?: "$" | ">";
  children: ReactNode;
}

export default function Terminal({ command, prompt = "$", children }: TerminalProps) {
  return (
    <div className="font-mono text-[13px] leading-[1.9]">
      <div className="flex gap-1.5 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
      </div>
      <div className="text-zinc-100 mb-1">
        <span className="text-accent">{prompt}</span> {command}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
