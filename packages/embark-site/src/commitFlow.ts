type TabId = "left" | "right" | "center";

const TERMINAL_IDS: Record<TabId, string> = {
  left: "terminal-left",
  right: "terminal-right",
  center: "terminal-center",
};

// Track pending timeouts per terminal so we can cancel them on tab switch
const pendingTimeouts: Record<TabId, ReturnType<typeof setTimeout>[]> = {
  left: [],
  right: [],
  center: [],
};

export function initCommitFlow() {
  const section = document.getElementById("commit-examples");
  if (!section) return;

  const tabs = section.querySelectorAll<HTMLButtonElement>(".terminal-tab");
  const wrappers = section.querySelectorAll<HTMLElement>("[data-terminal]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.dataset.tab as TabId;
      if (!tabId) return;

      // Update active tab style
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Show only the selected terminal wrapper
      wrappers.forEach((w) => {
        w.style.display = w.dataset.terminal === tabId ? "block" : "none";
      });

      // Restart animation for the selected terminal
      cancelAnimation(tabId);
      resetTerminal(tabId);
      animateTerminal(tabId);
    });
  });

  // Observe section to start default tab (center) when scrolled into view
  let started = false;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !started) {
          started = true;
          animateTerminal("center");
        }
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(section);
}

function cancelAnimation(tabId: TabId) {
  for (const t of pendingTimeouts[tabId]) {
    clearTimeout(t);
  }
  pendingTimeouts[tabId] = [];
}

function resetTerminal(tabId: TabId) {
  const terminalId = TERMINAL_IDS[tabId];
  const lines = document.querySelectorAll<HTMLElement>(
    `#${terminalId} .terminal-line`
  );
  for (const line of lines) {
    line.classList.remove("visible");
    const textEl = line.querySelector<HTMLElement>("[data-text]");
    if (textEl) {
      textEl.textContent = "";
    }
  }
}

function animateTerminal(tabId: TabId) {
  const terminalId = TERMINAL_IDS[tabId];
  const lines = document.querySelectorAll<HTMLElement>(
    `#${terminalId} .terminal-line`
  );

  for (const line of lines) {
    const delay = parseInt(line.dataset.delay ?? "0", 10);
    const textEl = line.querySelector<HTMLElement>("[data-text]");
    const text = textEl?.dataset.text ?? "";

    const t = setTimeout(() => {
      line.classList.add("visible");
      if (textEl && text) {
        typeText(textEl, text, tabId);
      }
    }, delay);

    pendingTimeouts[tabId].push(t);
  }
}

function typeText(element: HTMLElement, text: string, _tabId: TabId) {
  let i = 0;
  element.textContent = "";

  const interval = setInterval(() => {
    element.textContent += text[i] ?? "";
    i++;
    if (i >= text.length) {
      clearInterval(interval);
    }
  }, 50);
}
