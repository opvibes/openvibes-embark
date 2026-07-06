export function initRelease(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>(".release-tab");
  const panes = document.querySelectorAll<HTMLElement>(".release-pane");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.releaseTab;
      if (target === undefined) return;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      panes.forEach((pane) => {
        pane.classList.toggle("active", pane.dataset.releasePane === target);
      });
    });
  });
}
