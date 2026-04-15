// Features accordion — click to expand, one open at a time

export function initFeatures(): void {
  const items = document.querySelectorAll<HTMLElement>(".feat-acc-item");
  if (!items.length) return;

  function openItem(target: HTMLElement | null): void {
    items.forEach((item) => {
      const body = item.querySelector<HTMLElement>(".feat-acc-body");
      const isTarget = target !== null && item === target;
      item.setAttribute("data-open", isTarget ? "true" : "false");
      if (body) {
        body.style.maxHeight = isTarget ? body.scrollHeight + "px" : "0";
      }
    });
  }

  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>(".feat-acc-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      const already = item.getAttribute("data-open") === "true";
      openItem(already ? null : item);
    });
  });

  // Open first by default
  const first = items[0];
  if (first) openItem(first);
}
