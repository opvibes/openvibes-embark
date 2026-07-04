import { useEffect, useRef, useState } from "react";
import StageSection from "../StageSection";
import { useI18n } from "../../../../i18n";

interface BootstrapAnswer {
  pick: number;
  key: string;
  value: string;
}

const ANSWERS: BootstrapAnswer[] = [
  { pick: 2, key: "reference_system_type", value: "another running system" },
  { pick: 2, key: "confidence_min", value: "tier-2" },
  { pick: 1, key: "qa_environments", value: "[local, staging, prod]" },
];

const QUESTION_DISPLAY_MS = 900;
const PICK_DELAY_MS = 900;
const ABSORB_PAUSE_MS = 900;

export default function BootstrapStage() {
  const { t } = useI18n();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [pickedIndex, setPickedIndex] = useState(-1);
  const [fileLines, setFileLines] = useState<Array<{ key: string; value: string }>>([]);
  const hasPlayed = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true;
          play();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();

    function play() {
      let cancelled = false;
      const timers: ReturnType<typeof setTimeout>[] = [];
      const wait = (ms: number) => new Promise<void>((resolve) => timers.push(setTimeout(resolve, ms)));

      (async () => {
        for (let i = 0; i < ANSWERS.length; i++) {
          if (cancelled) return;
          setQuestionIndex(i);
          setPickedIndex(-1);
          await wait(QUESTION_DISPLAY_MS);
          if (cancelled) return;
          const current = ANSWERS[i];
          if (!current) continue;
          setPickedIndex(current.pick);
          await wait(PICK_DELAY_MS);
          if (cancelled) return;
          setFileLines((lines) => [...lines, { key: current.key, value: current.value }]);
          await wait(ABSORB_PAUSE_MS);
        }
      })();

      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }
  }, []);

  const questions = t.bootstrapSim.questions;
  const question = questions[questionIndex] ?? questions[0]!;

  return (
    <StageSection
      stageId="bootstrap"
      tag={t.pipeline.bootstrap.tag}
      title="/audit-bootstrap"
      description={t.pipeline.bootstrap.description}
      why={t.pipeline.bootstrap.why}
    >
      <div ref={containerRef} className="flex gap-5 text-xs font-mono">
        <div className="flex-1">
          <div className="text-zinc-600 uppercase text-[10px] mb-3">{t.bootstrapSim.interviewLabel}</div>
          <div className="text-zinc-100 text-[13px] font-sans font-semibold mb-1">{question.title}</div>
          <div className="text-zinc-600 text-[11px] mb-3">{question.sub}</div>
          {question.options.map((opt, i) => (
            <div
              key={opt}
              className={`border rounded-md px-3 py-2 mb-1.5 text-[12px] transition-colors ${
                i === pickedIndex
                  ? "border-accent bg-accent-soft text-zinc-100"
                  : "border-zinc-800 text-zinc-500"
              }`}
            >
              {opt} {i === pickedIndex && <span className="text-accent">✓</span>}
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="text-zinc-600 uppercase text-[10px] mb-3">{t.bootstrapSim.fileLabel}</div>
          <div className="space-y-2 text-[12px]">
            {fileLines.map((line) => (
              <div key={line.key}>
                <span className="text-zinc-500">{line.key}:</span>{" "}
                <span className="text-accent">{line.value}</span>
              </div>
            ))}
            <span className="text-accent animate-pulse">▍</span>
          </div>
        </div>
      </div>
    </StageSection>
  );
}
