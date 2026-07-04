export type Locale = "en" | "pt";

export function readStoredLocale(getItem: (key: string) => string | null): Locale {
  const stored = getItem("locale");
  return stored === "en" || stored === "pt" ? stored : "en";
}
