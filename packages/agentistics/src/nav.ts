export function initNav(): void {
  const nav = document.getElementById("nav");
  if (!nav) return;

  let lastY = 0;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    if (y > 60) {
      nav.style.background = "rgba(6,6,15,0.92)";
      nav.style.boxShadow = "0 4px 40px rgba(0,0,0,0.4)";
    } else {
      nav.style.background = "rgba(6,6,15,0.7)";
      nav.style.boxShadow = "none";
    }

    // Hide on scroll down, show on scroll up
    if (y > lastY && y > 200) {
      nav.style.transform = "translateY(-100%)";
    } else {
      nav.style.transform = "translateY(0)";
    }
    lastY = y;
  }, { passive: true });

  // Smooth transition for nav
  nav.style.transition = "background 0.3s, box-shadow 0.3s, transform 0.4s cubic-bezier(0.4,0,0.2,1)";
}
