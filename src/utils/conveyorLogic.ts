export interface ConveyorSlotGeometry {
  xPercent: number;
  yPercent: number;
  scale: number;
  opacity: number;
  zIndex: number;
  blurPx: number;
}

/**
 * Slots 0..4 go from top-back (small) to bottom-front (large) along a diagonal conveyor.
 * Slot 4 is the active front tub!
 */
export const CONVEYOR_SLOTS: ConveyorSlotGeometry[] = [
  { xPercent: 14, yPercent: 10, scale: 0.42, opacity: 0.62, zIndex: 10, blurPx: 0.4 },
  { xPercent: 25, yPercent: 24, scale: 0.56, opacity: 0.78, zIndex: 20, blurPx: 0.2 },
  { xPercent: 37, yPercent: 40, scale: 0.71, opacity: 0.9, zIndex: 30, blurPx: 0 },
  { xPercent: 49, yPercent: 57, scale: 0.86, opacity: 0.97, zIndex: 40, blurPx: 0 },
  { xPercent: 60, yPercent: 74, scale: 1.05, opacity: 1, zIndex: 50, blurPx: 0 },
];

/**
 * Advances conveyor by one stop forward:
 * Front element (index 4) exits at the bottom and enters as a twin at the top-back (index 0).
 */
export function stepConveyorOrder(order: string[]): string[] {
  if (order.length <= 1) return [...order];
  const last = order[order.length - 1];
  return [last, ...order.slice(0, order.length - 1)];
}

/**
 * Computes how many single-step advances are needed to bring targetFlavorId to the front slot (last index).
 */
export function stepsToFront(order: string[], targetFlavorId: string): number {
  const len = order.length;
  if (len === 0) return 0;
  const currentIdx = order.indexOf(targetFlavorId);
  if (currentIdx === -1) return 0;
  const frontIdx = len - 1;
  return (frontIdx - currentIdx + len) % len;
}

/**
 * Computes rounded average rating across customer reviews.
 */
export function computeAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 5.0;
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

/**
 * Computes horizontal marquee offset to center a target flavor card inside a viewport width.
 */
export function computeMarqueeCenterOffset(
  flavorIndex: number,
  totalFlavors: number,
  cardWidth: number,
  cardGap: number,
  viewportWidth: number
): number {
  if (totalFlavors <= 0) return 0;
  const stride = cardWidth + cardGap;
  const cardCenter = flavorIndex * stride + cardWidth / 2;
  return viewportWidth / 2 - cardCenter;
}
