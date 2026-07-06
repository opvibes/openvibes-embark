import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);

    function scrollToTarget() {
      const el = document.getElementById(id);
      // "auto" would defer to the page's global `scroll-behavior: smooth`;
      // "instant" bypasses it so the jump lands immediately after a cross-page navigation.
      el?.scrollIntoView({ behavior: "instant", block: "start" });
    }

    const raf = requestAnimationFrame(() => requestAnimationFrame(scrollToTarget));
    const timer = setTimeout(scrollToTarget, 300);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [location.pathname, location.hash]);

  return null;
}
