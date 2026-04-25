import {
  createIcons,
  Zap,
  DollarSign,
  Bot,
  CalendarDays,
  BarChart3,
  ShieldCheck,
  Telescope,
  FileText,
  Flame,
} from "lucide";

export function initIcons(): void {
  createIcons({
    icons: {
      Zap,
      DollarSign,
      Bot,
      CalendarDays,
      BarChart3,
      ShieldCheck,
      Telescope,
      FileText,
      Flame,
    },
    attrs: {
      "stroke-width": "1.75",
      class: "lucide-icon",
    },
  });
}
