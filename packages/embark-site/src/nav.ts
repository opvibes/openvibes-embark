/**
 * Initialize main navigation menu with:
 * - Mobile hamburger toggle
 * - Dropdown group toggle on mobile (click to expand)
 * - Active section highlighting on scroll
 * - Scroll effect styling
 */

export function initNav(): void {
  const nav = document.getElementById("main-nav") as HTMLElement | null;
  const navToggle = document.getElementById("nav-toggle") as HTMLButtonElement | null;
  const navLinks = document.getElementById("nav-links") as HTMLElement | null;
  const navItems = document.querySelectorAll(".nav-links > li > a, .nav-submenu a");

  // Mobile hamburger toggle
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navLinks?.classList.toggle("active");
    });
  }

  // Mobile dropdown group toggle (click on .nav-group-label)
  const dropdownItems = document.querySelectorAll<HTMLElement>(".nav-has-dropdown");
  dropdownItems.forEach((item) => {
    const label = item.querySelector<HTMLElement>(".nav-group-label");
    if (label) {
      label.addEventListener("click", () => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          item.classList.toggle("open");
          // Close other open dropdowns
          dropdownItems.forEach((other) => {
            if (other !== item) other.classList.remove("open");
          });
        }
      });
    }
  });

  // Close menu when any nav link is clicked
  document.querySelectorAll(".nav-links a, .nav-submenu a").forEach((item) => {
    item.addEventListener("click", () => {
      navToggle?.classList.remove("active");
      navLinks?.classList.remove("active");
      dropdownItems.forEach((d) => d.classList.remove("open"));
    });
  });

  // Close dropdowns on outside click (desktop)
  document.addEventListener("click", (e) => {
    const target = e.target as Node;
    dropdownItems.forEach((item) => {
      if (!item.contains(target)) {
        item.classList.remove("open");
      }
    });
  });

  // Update active link and nav styling on scroll
  function updateActiveLink(): void {
    let current = "";
    const sections = document.querySelectorAll("section[id]");

    if (nav) {
      if (window.scrollY > 10) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i] as HTMLElement;
      const sectionTop = section.offsetTop;

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id") || "";
        break;
      }
    }

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });

    // Highlight parent group if a submenu link is active
    dropdownItems.forEach((item) => {
      const activeChild = item.querySelector(".nav-submenu a.active");
      const label = item.querySelector(".nav-group-label");
      if (activeChild) {
        label?.classList.add("active");
      } else {
        label?.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
}
