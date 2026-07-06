import { describe, it, expect } from "bun:test";
import { readStoredLocale } from "../locale";

describe("readStoredLocale", () => {
  it("returns the stored locale when it is a valid value", () => {
    const getItem = (key: string) => (key === "locale" ? "pt" : null);
    expect(readStoredLocale(getItem)).toBe("pt");
  });

  it("falls back to 'en' when nothing is stored", () => {
    const getItem = () => null;
    expect(readStoredLocale(getItem)).toBe("en");
  });

  it("falls back to 'en' when the stored value is invalid", () => {
    const getItem = () => "fr";
    expect(readStoredLocale(getItem)).toBe("en");
  });
});
