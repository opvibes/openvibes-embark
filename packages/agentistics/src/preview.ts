// Dashboard preview — tab 0: demo video, tabs 1-6: screenshots

const SCREENSHOT_SRCS = [
  "/screenshots/section1.png",
  "/screenshots/section2.png",
  "/screenshots/section3.png",
  "/screenshots/section4.png",
  "/screenshots/section5.png",
  "/screenshots/section6.png",
];

let autoTimer: ReturnType<typeof setInterval> | null = null;
let userInteracted = false;

export function initPreview(): void {
  const section = document.getElementById("preview");
  if (!section) return;

  const tabBtns  = section.querySelectorAll<HTMLButtonElement>(".preview-tab");
  const video    = section.querySelector<HTMLVideoElement>(".preview-video");
  const videoWrap = section.querySelector<HTMLElement>(".preview-video-wrap");
  const playBtn  = section.querySelector<HTMLButtonElement>(".preview-video-play");
  const imgs     = section.querySelectorAll<HTMLImageElement>(".preview-img");
  const frame    = section.querySelector<HTMLElement>(".preview-frame");

  if (!tabBtns.length) return;

  const total = tabBtns.length; // 7: 1 video + 6 screenshots

  // Show/hide play overlay based on video state
  function setPaused(paused: boolean): void {
    videoWrap?.classList.toggle("paused", paused);
  }

  if (video) {
    video.addEventListener("playing", () => setPaused(false));
    video.addEventListener("pause",   () => setPaused(true));
    video.addEventListener("waiting", () => setPaused(false)); // buffering, not paused
    // If autoplay blocked, show play button immediately
    video.addEventListener("loadedmetadata", () => {
      if (video.paused) setPaused(true);
    });
  }

  // Click on overlay plays the video
  playBtn?.addEventListener("click", () => {
    video?.play().catch(() => {});
  });

  function activate(idx: number): void {
    tabBtns.forEach((b, i) => b.classList.toggle("active", i === idx));

    if (video) {
      video.classList.toggle("active", idx === 0);
      if (videoWrap) videoWrap.style.display = idx === 0 ? "" : "none";
      if (idx === 0) {
        video.currentTime = 0;
        video.play().catch(() => setPaused(true));
      } else {
        video.pause();
        setPaused(false); // hide overlay when not on video tab
      }
    }

    imgs.forEach((img, i) => img.classList.toggle("active", i + 1 === idx));
  }

  tabBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      userInteracted = true;
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      activate(i);
    });
  });

  // After video ends, advance to first screenshot and start auto-cycle
  if (video) {
    video.addEventListener("ended", () => {
      activate(1);
      if (!userInteracted) startAuto(activate, total);
    });
  }

  if (frame) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            frame.classList.add("visible");
            if (video && !userInteracted) {
              video.play().catch(() => setPaused(true));
            }
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    obs.observe(frame);
  }

  // Preload screenshots
  SCREENSHOT_SRCS.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function startAuto(activate: (i: number) => void, total: number): void {
  let current = 1;
  autoTimer = setInterval(() => {
    if (userInteracted) { if (autoTimer) clearInterval(autoTimer); return; }
    current = current >= total - 1 ? 1 : current + 1;
    activate(current);
  }, 3200);
}
