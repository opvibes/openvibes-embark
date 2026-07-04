import { useState } from "react";
import { useI18n } from "../../i18n";

interface CodeBlockProps {
  children: string;
}

export default function CodeBlock({ children }: CodeBlockProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable in this context, the button simply won't confirm
    }
  }

  return (
    <div className="relative group">
      <pre className="bg-[#0d2438] border border-accent-soft p-4 pr-16 font-mono text-[12.5px] text-[#dbeaf5] overflow-x-auto overflow-y-hidden">
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 font-mono text-[10px] uppercase tracking-wide text-[#8fb3cc] border border-accent-soft px-2 py-1 bg-[#0a1b2e]/80 hover:text-accent hover:border-accent transition-colors"
      >
        {copied ? t.docs.codeBlock.copied : t.docs.codeBlock.copy}
      </button>
    </div>
  );
}
