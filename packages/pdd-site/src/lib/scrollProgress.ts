export interface ScrollProgressResult {
  inZone: boolean;
  activeIndex: number;
  progressPx: number;
}

const VIEWPORT_CENTER_FRACTION = 0.4;
const ZONE_EDGE_MARGIN_PX = 100;

export function computeScrollProgress(
  scrollY: number,
  viewportHeight: number,
  wrapTop: number,
  wrapHeight: number,
  sectionTops: number[],
): ScrollProgressResult {
  const viewportCenter = scrollY + viewportHeight * VIEWPORT_CENTER_FRACTION;

  const inZone =
    scrollY + ZONE_EDGE_MARGIN_PX >= wrapTop &&
    scrollY <= wrapTop + wrapHeight - ZONE_EDGE_MARGIN_PX;

  let activeIndex = -1;
  sectionTops.forEach((top, i) => {
    if (viewportCenter >= top) activeIndex = i;
  });

  const progressPx = Math.max(0, Math.min(wrapHeight, viewportCenter - wrapTop));

  return { inZone, activeIndex, progressPx };
}
