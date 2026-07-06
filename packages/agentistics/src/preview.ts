// Dashboard preview — tab 0: demo GIF, tabs 1-6: screenshots

const SCREENSHOT_SRCS = [
  "/screenshots/section1.png?v=2",
  "/screenshots/section2.png?v=2",
  "/screenshots/section3.png?v=2",
  "/screenshots/section4.png?v=2",
  "/screenshots/section5.png?v=2",
  "/screenshots/section6.png?v=2",
];

export function initPreview(): void {
  const section = document.getElementById("preview");
  if (!section) return;

  const tabBtns    = section.querySelectorAll<HTMLButtonElement>(".preview-tab");
  const videoWrap  = section.querySelector<HTMLElement>(".preview-video-wrap");
  const demoGif    = section.querySelector<HTMLElement>(".preview-video");
  const imgs       = section.querySelectorAll<HTMLImageElement>(".preview-img");
  const frame      = section.querySelector<HTMLElement>(".preview-frame");

  if (!tabBtns.length) return;

  function activate(idx: number): void {
    tabBtns.forEach((b, i) => b.classList.toggle("active", i === idx));

    demoGif?.classList.toggle("active", idx === 0);
    if (videoWrap) videoWrap.style.display = idx === 0 ? "" : "none";

    imgs.forEach((img, i) => img.classList.toggle("active", i + 1 === idx));
  }

  tabBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => activate(i));
  });

  if (frame) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            frame.classList.add("visible");
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
