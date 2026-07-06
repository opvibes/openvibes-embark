import { describe, it, expect } from "bun:test";
import { computeScrollProgress } from "../scrollProgress";

describe("computeScrollProgress", () => {
  const sectionTops = [1000, 1800, 2600]; // 3 sections, 800px apart
  const wrapTop = 1000;
  const wrapHeight = 2400; // sections span 1000..3400

  it("is out of zone before the wrap starts", () => {
    const r = computeScrollProgress(0, 800, wrapTop, wrapHeight, sectionTops);
    expect(r.inZone).toBe(false);
    expect(r.activeIndex).toBe(-1);
  });

  it("is in zone and activates the first section once its top passes the viewport-center line", () => {
    // inZone requires scrollY + 100 >= wrapTop => scrollY >= 900
    // viewportCenter = scrollY + viewportHeight * 0.4 = 900 + 320 = 1220 >= 1000 (first section top)
    const r = computeScrollProgress(900, 800, wrapTop, wrapHeight, sectionTops);
    expect(r.inZone).toBe(true);
    expect(r.activeIndex).toBe(0);
  });

  it("advances to the second section once its top passes the viewport-center line", () => {
    // want viewportCenter >= 1800 => scrollY >= 1800 - 320 = 1480
    const r = computeScrollProgress(1500, 800, wrapTop, wrapHeight, sectionTops);
    expect(r.activeIndex).toBe(1);
  });

  it("clamps progressPx between 0 and wrapHeight", () => {
    const before = computeScrollProgress(0, 800, wrapTop, wrapHeight, sectionTops);
    expect(before.progressPx).toBe(0);

    const after = computeScrollProgress(10000, 800, wrapTop, wrapHeight, sectionTops);
    expect(after.progressPx).toBe(wrapHeight);
  });

  it("leaves the zone after scrolling past the wrap's end", () => {
    const r = computeScrollProgress(4000, 800, wrapTop, wrapHeight, sectionTops);
    expect(r.inZone).toBe(false);
  });
});
