function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function initHeroCounters(): void {
  const el = document.getElementById("hs-tokens");
  if (!el) return;

  const stats = document.getElementById("hero-stats") ?? el.closest("section");
  if (!stats) { run(); return; }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(); observer.disconnect(); } });
    },
    { threshold: 0.5 },
  );
  observer.observe(stats);
}

function run() {
  const counters: Array<{ id: string; target: number; prefix: string; suffix: string; decimals: number }> = [
    { id: "hs-tokens",   target: 2_847_391, prefix: "",  suffix: "",    decimals: 0 },
    { id: "hs-cost",     target: 48.27,     prefix: "$", suffix: "",    decimals: 2 },
    { id: "hs-sessions", target: 127,       prefix: "",  suffix: "",    decimals: 0 },
    { id: "hs-streak",   target: 42,        prefix: "",  suffix: "d",    decimals: 0 },
  ];

  for (const c of counters) {
    const el = document.getElementById(c.id);
    if (!el) continue;

    const duration = 2000;
    const start = performance.now();

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const val = lerp(0, c.target, easeOut(t));
      const fmt = c.decimals > 0
        ? val.toFixed(c.decimals)
        : Math.floor(val).toLocaleString();
      el!.textContent = c.prefix + fmt + c.suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
}
