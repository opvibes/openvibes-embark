export function initReveal(): void {
  const els = document.querySelectorAll("[data-reveal]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const parent = entry.target.parentElement;
          let delay = 0;
          if (parent) {
            const siblings = parent.querySelectorAll("[data-reveal]");
            siblings.forEach((s, idx) => {
              if (s === entry.target) delay = idx * 80;
            });
          }
          setTimeout(() => {
            (entry.target as HTMLElement).classList.add("revealed");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );

  els.forEach((el) => observer.observe(el));
}
