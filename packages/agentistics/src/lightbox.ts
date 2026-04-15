// PDF lightbox — fullscreen carousel with keyboard navigation

export function initLightbox(): void {
  const pdfItems = document.querySelectorAll<HTMLElement>(".preview-pdf-item");
  if (!pdfItems.length) return;

  const images = Array.from(pdfItems).map((item) => {
    const img = item.querySelector<HTMLImageElement>("img")!;
    return { src: img.src, alt: img.alt };
  });

  let current = 0;
  let overlay: HTMLElement | null = null;

  function buildOverlay(): HTMLElement {
    const el = document.createElement("div");
    el.className = "lightbox";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.innerHTML = `
      <button class="lb-close" aria-label="Close">✕</button>
      <button class="lb-prev" aria-label="Previous">‹</button>
      <button class="lb-next" aria-label="Next">›</button>
      <div class="lb-img-wrap">
        <img class="lb-img" src="" alt="" />
      </div>
      <div class="lb-counter"></div>
    `;
    document.body.appendChild(el);

    el.querySelector(".lb-close")!.addEventListener("click", close);
    el.querySelector(".lb-prev")!.addEventListener("click", () => navigate(-1));
    el.querySelector(".lb-next")!.addEventListener("click", () => navigate(1));

    // Click backdrop to close
    el.addEventListener("click", (e) => {
      if (e.target === el) close();
    });

    return el;
  }

  function updateImage(): void {
    if (!overlay) return;
    const img = overlay.querySelector<HTMLImageElement>(".lb-img")!;
    const counter = overlay.querySelector<HTMLElement>(".lb-counter")!;
    const entry = images[current];
    if (!entry) return;

    // Animate swap
    img.style.opacity = "0";
    img.style.transform = "scale(0.95)";

    requestAnimationFrame(() => {
      img.src = entry.src;
      img.alt = entry.alt;
      img.onload = () => {
        img.style.opacity = "1";
        img.style.transform = "scale(1)";
      };
    });

    counter.textContent = `${current + 1} / ${images.length}`;
  }

  function open(index: number): void {
    current = ((index % images.length) + images.length) % images.length;
    if (!overlay) overlay = buildOverlay();
    updateImage();
    overlay.classList.add("lb-open");
    document.body.style.overflow = "hidden";
  }

  function close(): void {
    if (!overlay) return;
    overlay.classList.remove("lb-open");
    document.body.style.overflow = "";
  }

  function navigate(dir: -1 | 1): void {
    current = ((current + dir + images.length) % images.length);
    updateImage();
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!overlay?.classList.contains("lb-open")) return;
    if (e.key === "ArrowLeft") navigate(-1);
    else if (e.key === "ArrowRight") navigate(1);
    else if (e.key === "Escape") close();
  });

  // Wire click on each PDF item
  pdfItems.forEach((item, i) => {
    item.style.cursor = "zoom-in";
    item.addEventListener("click", () => open(i));
  });
}
