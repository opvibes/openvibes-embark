interface VerticalRailProps {
  progressPx: number;
}

export default function VerticalRail({ progressPx }: VerticalRailProps) {
  return (
    <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-zinc-900">
      <div
        className="absolute left-0 top-0 w-0.5 bg-accent shadow-[0_0_12px_1px_rgba(94,184,255,.5)]"
        style={{ height: `${progressPx}px` }}
      />
    </div>
  );
}
