import { useEffect, useRef, useState, Children } from "react";
import type { ReactNode } from "react";
import { computeScrollProgress, type ScrollProgressResult } from "../../../lib/scrollProgress";
import { PIPELINE_STAGES } from "./stages";
import StageBar from "./StageBar";
import VerticalRail from "./VerticalRail";

interface PipelineSectionProps {
  children: ReactNode[];
}

const INITIAL_PROGRESS: ScrollProgressResult = { inZone: false, activeIndex: -1, progressPx: 0 };

export default function PipelineSection({ children }: PipelineSectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [progress, setProgress] = useState<ScrollProgressResult>(INITIAL_PROGRESS);

  useEffect(() => {
    function onScroll() {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
      const wrapHeight = wrap.offsetHeight;
      const sectionTops = stageRefs.current.map((el) =>
        el ? el.getBoundingClientRect().top + window.scrollY : 0,
      );
      setProgress(
        computeScrollProgress(window.scrollY, window.innerHeight, wrapTop, wrapHeight, sectionTops),
      );
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrapRef} className="relative pipeline-wrap">
      <StageBar activeIndex={progress.activeIndex} visible={progress.inZone} />
      <div className="relative">
        <VerticalRail progressPx={progress.progressPx} />
        {Children.map(children, (child, i) => (
          <div
            id={`stage-${PIPELINE_STAGES[i]?.id ?? i}`}
            ref={(el) => {
              stageRefs.current[i] = el;
            }}
            className={`scroll-mt-24 ${i % 2 === 0 ? "stage-even" : "stage-odd"} ${
              i === progress.activeIndex ? "stage-active" : i < progress.activeIndex ? "stage-done" : ""
            }`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
