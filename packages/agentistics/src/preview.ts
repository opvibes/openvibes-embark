// Dashboard screenshot showcase — tabbed browser mockup

const TABS = [
  { key: "overview",  src: "/screenshots/section1.png" },
  { key: "activity",  src: "/screenshots/section2.png" },
  { key: "models",    src: "/screenshots/section3.png" },
  { key: "projects",  src: "/screenshots/section4.png" },
  { key: "agents",    src: "/screenshots/section5.png" },
  { key: "sessions",  src: "/screenshots/section6.png" },
];

let autoTimer: ReturnType<typeof setInterval> | null = null;
let userInteracted = false;

export function initPreview(): void {
  const section = document.getElementById("preview");
  if (!section) return;

  const tabBtns = section.querySelectorAll<HTMLButtonElement>(".preview-tab");
  const imgs    = section.querySelectorAll<HTMLImageElement>(".preview-img");
  const frame   = section.querySelector<HTMLElement>(".preview-frame");

  if (!tabBtns.length || !imgs.length) return;

  function activate(idx: number): void {
    tabBtns.forEach((b, i) => b.classList.toggle("active", i === idx));
    imgs.forEach((img, i) => img.classList.toggle("active", i === idx));
    // slide indicator
    const indicator = section!.querySelector<HTMLElement>(".preview-indicator");
    if (indicator) indicator.style.transform = `translateX(${idx * 100}%)`;
  }

  tabBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      userInteracted = true;
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      activate(i);
    });
  });

  // Fade-in the frame when it enters viewport
  if (frame) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            frame.classList.add("visible");
            // Start auto-cycle after 1.5s
            if (!userInteracted) {
              setTimeout(() => startAuto(activate, tabBtns.length), 1500);
            }
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    obs.observe(frame);
  }

  // Preload all images
  TABS.forEach(({ src }) => {
    const img = new Image();
    img.src = src;
  });
}

function startAuto(activate: (i: number) => void, total: number): void {
  let current = 0;
  autoTimer = setInterval(() => {
    if (userInteracted) { if (autoTimer) clearInterval(autoTimer); return; }
    current = (current + 1) % total;
    activate(current);
  }, 3200);
}
