import type { ReactNode } from "react";
import { useInView } from "../../../lib/useInView";
import { PIPELINE_STAGES } from "./stages";

interface StageSectionProps {
  stageId: string;
  tag: string;
  title: string;
  description: string;
  why: string;
  children: ReactNode;
}

export default function StageSection({ stageId, tag, title, description, why, children }: StageSectionProps) {
  const figNumber = tag.split(" ")[0] ?? "00";
  const index = PIPELINE_STAGES.findIndex((s) => s.id === stageId);
  const reversed = index % 2 === 1;
  const [ref, inView] = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`stage relative flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} lg:items-center gap-10 lg:gap-16 px-6 md:pl-14 lg:pl-20 md:pr-10 py-16 md:py-24 lg:py-28 max-w-[1240px] mx-auto`}
    >
      <span className="rail-dot hidden md:block absolute left-[21px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0a1b2e] border-2 border-[#4a7690] rotate-45 z-[2]" />
      <span
        className="rail-label hidden md:block absolute left-[27px] top-[calc(50%+18px)] text-[9.5px] font-mono uppercase tracking-wider text-[#4a7690] whitespace-nowrap origin-top-left"
        style={{ transform: "rotate(90deg)" }}
      >
        {stageId}
      </span>

      <div
        className={`stage-copy flex-1 min-w-0 transition-all duration-700 ease-out ${
          inView ? "opacity-100 translate-x-0" : `opacity-0 ${reversed ? "translate-x-8" : "-translate-x-8"}`
        }`}
      >
        <div className="text-[12px] uppercase tracking-[.25em] text-[#6fa5c7] font-mono mb-4">{tag}</div>
        <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold mb-5 text-[#f2f8fc] tracking-tight leading-[1.05]">
          {title}
        </h2>
        <p className="text-[#8fb3cc] text-[16px] md:text-[17px] leading-relaxed max-w-[440px] mb-6">{description}</p>
        <p className="text-[#6fa5c7] text-[14px] leading-relaxed max-w-[440px] border-l-2 border-accent-soft pl-4">
          {why}
        </p>
      </div>

      <div
        className={`sim flex-1 min-w-0 w-full lg:max-w-[560px] bg-[#0d2438] border border-accent-soft shadow-2xl relative overflow-visible p-5 sm:p-6 md:p-7 transition-all duration-700 ease-out delay-150 ${
          inView ? "opacity-100 translate-x-0" : `opacity-0 ${reversed ? "-translate-x-8" : "translate-x-8"}`
        }`}
      >
        <span className="absolute -top-[11px] left-5 bg-[#0a1b2e] px-2 font-mono text-[10px] tracking-[.1em] text-accent">
          FIG. {figNumber} · {stageId.toUpperCase()}
        </span>
        <div className="overflow-x-auto overflow-y-hidden">{children}</div>
      </div>
    </section>
  );
}
