import { PIPELINE_STAGES } from "./stages";

interface StageBarProps {
  activeIndex: number;
  visible: boolean;
}

export default function StageBar({ activeIndex, visible }: StageBarProps) {
  return (
    <div
      className={`hidden md:flex fixed top-[70px] left-1/2 -translate-x-1/2 z-30 max-w-[92vw] items-center gap-1 rounded-full border border-zinc-800 bg-[#0a1b2e]/80 backdrop-blur-xl px-2 py-2 shadow-lg shadow-black/30 overflow-x-auto overflow-y-hidden transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      {PIPELINE_STAGES.map((stage, i) => {
        const isBootstrap = stage.id === "bootstrap";
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;
        return (
          <a
            key={stage.id}
            href={`#stage-${stage.id}`}
            className={`flex items-center gap-1.5 whitespace-nowrap text-[11.5px] font-mono px-3 py-1.5 rounded-full transition-colors ${
              isActive
                ? isBootstrap
                  ? "bg-amber-400 text-black font-semibold"
                  : "bg-accent text-black font-semibold"
                : isDone
                  ? "text-zinc-300 hover:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                isActive
                  ? "bg-[#0a1b2e]"
                  : isDone
                    ? isBootstrap
                      ? "bg-amber-400"
                      : "bg-accent"
                    : "bg-transparent ring-1 ring-zinc-700"
              }`}
            />
            {stage.id}
          </a>
        );
      })}
    </div>
  );
}
