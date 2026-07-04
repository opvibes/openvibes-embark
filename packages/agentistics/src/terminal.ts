// Terminal tab switching — panes now hold real VHS-recorded GIFs (see index.html)

export function initTerminalTabs(): void {
  const tabs   = document.querySelectorAll<HTMLButtonElement>(".term-tab");
  const panes  = document.querySelectorAll<HTMLElement>(".term-pane");
  const argEl  = document.getElementById("term-active-arg");
  const args   = [" tui", " watch", " server"];

  if (!tabs.length || !panes.length) return;

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      panes[i]?.classList.add("active");
      if (argEl) argEl.textContent = args[i] ?? "";
    });
  });
}
