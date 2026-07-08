import { useState } from "react";
import { useI18n } from "../../../i18n";
import { AGENTS } from "./agents";
import AgentIcon from "./AgentIcon";

function CopyButton({ command }: { command: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable in this context
    }
  }
  return (
    <button
      onClick={handleCopy}
      className="absolute top-2.5 right-2.5 font-mono text-[10px] uppercase tracking-wide text-[#8fb3cc] border border-accent-soft rounded-md px-2 py-1 bg-[var(--surface-0-80)] hover:text-accent hover:border-accent transition-colors"
    >
      {copied ? t.coverageClose.copied : t.coverageClose.copy}
    </button>
  );
}

export default function InstallList() {
  const [open, setOpen] = useState<string>(AGENTS[0]?.id ?? "");

  return (
    <div className="text-left border border-accent-soft rounded-2xl overflow-hidden bg-[var(--surface-0-80)]">
      {AGENTS.map((agent, i) => {
        const isOpen = open === agent.id;
        return (
          <div key={agent.id} className={i > 0 ? "border-t border-accent-soft" : ""}>
            <button
              onClick={() => setOpen(isOpen ? "" : agent.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-none hover:bg-[var(--surface-1)] transition-colors"
            >
              <AgentIcon icon={agent.icon} name={agent.name} />
              <span className="font-mono text-[14px] text-[#eaf3fb]">{agent.name}</span>
              {agent.org && (
                <span className="font-mono text-[11px] uppercase tracking-wide text-[#6fa5c7]">
                  {agent.org}
                </span>
              )}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className={`ml-auto h-4 w-4 shrink-0 fill-none stroke-[#6fa5c7] transition-transform ${isOpen ? "rotate-180" : ""}`}
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div
              className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 pt-1 space-y-2">
                  {agent.commands.map((cmd, ci) => (
                    <div key={ci} className="relative">
                      <pre className="bg-[var(--surface-1)] border border-accent-soft rounded-xl p-4 pr-16 font-mono text-[12px] leading-relaxed text-[#dbeaf5] overflow-x-auto">
                        {cmd}
                      </pre>
                      <CopyButton command={cmd} />
                    </div>
                  ))}
                  {agent.note && (
                    <p className="font-mono text-[11px] text-[#7f9bb3]">{agent.note}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
