import type { AgentIcon as AgentIconType } from "./agents";
import { BRAND_PATHS } from "./brandPaths";

/** Renders an agent's icon: a monochrome brand mark, a full-color image, or a monogram fallback. */
export default function AgentIcon({ icon, name }: { icon: AgentIconType; name: string }) {
  if (icon.kind === "img") {
    return <img src={icon.src} alt="" aria-hidden="true" className="h-6 w-6 object-contain shrink-0" />;
  }

  if (icon.kind === "monogram") {
    return (
      <span
        aria-hidden="true"
        className="grid place-items-center h-6 w-6 shrink-0 rounded-md border border-accent-soft bg-[var(--surface-1)] font-mono text-[13px] text-[#8fb3cc]"
      >
        {icon.text}
      </span>
    );
  }

  const d = BRAND_PATHS[icon.slug];
  if (!d) return <span aria-hidden="true" className="h-6 w-6 shrink-0" />;
  return (
    <svg
      role="img"
      aria-label={name}
      viewBox="0 0 24 24"
      className="h-[22px] w-[22px] shrink-0 fill-current text-[#cfe3f2]"
    >
      <path d={d} />
    </svg>
  );
}
