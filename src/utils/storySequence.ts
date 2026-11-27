export interface ToppingSpec {
  id: number;
  kind: 'berry' | 'pistachio' | 'caramel' | 'chocolate' | 'gold-flake' | 'almond';
  startXRatio: number; // -0.35 to 0.35 around cup center
  delayProgress: number; // 0..0.65
  durationProgress: number; // 0.25..0.5
  rotationSpeed: number;
  size: number;
  color: string;
  secondaryColor: string;
}

export const STORY_TOPPINGS: ToppingSpec[] = [
  { id: 1, kind: 'berry', startXRatio: -0.22, delayProgress: 0.02, durationProgress: 0.36, rotationSpeed: 2.1, size: 15, color: '#a81c42', secondaryColor: '#e85d82' },
  { id: 2, kind: 'pistachio', startXRatio: 0.18, delayProgress: 0.06, durationProgress: 0.34, rotationSpeed: -2.8, size: 13, color: '#8ab874', secondaryColor: '#5d8649' },
  { id: 3, kind: 'chocolate', startXRatio: -0.08, delayProgress: 0.1, durationProgress: 0.38, rotationSpeed: 3.2, size: 16, color: '#47251b', secondaryColor: '#7b4938' },
  { id: 4, kind: 'caramel', startXRatio: 0.06, delayProgress: 0.14, durationProgress: 0.36, rotationSpeed: 1.4, size: 14, color: '#e5993e', secondaryColor: '#f6c373' },
  { id: 5, kind: 'berry', startXRatio: 0.24, delayProgress: 0.19, durationProgress: 0.35, rotationSpeed: -2.2, size: 14, color: '#8f1638', secondaryColor: '#d9486f' },
  { id: 6, kind: 'gold-flake', startXRatio: -0.16, delayProgress: 0.23, durationProgress: 0.34, rotationSpeed: 4.1, size: 11, color: '#f2b544', secondaryColor: '#fce49c' },
  { id: 7, kind: 'almond', startXRatio: 0.12, delayProgress: 0.28, durationProgress: 0.36, rotationSpeed: -1.9, size: 14, color: '#e8d0ad', secondaryColor: '#b78952' },
  { id: 8, kind: 'pistachio', startXRatio: -0.25, delayProgress: 0.33, durationProgress: 0.35, rotationSpeed: 2.6, size: 12, color: '#99c484', secondaryColor: '#5d8649' },
  { id: 9, kind: 'chocolate', startXRatio: 0.02, delayProgress: 0.38, durationProgress: 0.35, rotationSpeed: -3.4, size: 15, color: '#3b1c14', secondaryColor: '#6b3b2c' },
  { id: 10, kind: 'berry', startXRatio: -0.11, delayProgress: 0.43, durationProgress: 0.34, rotationSpeed: 2.5, size: 13, color: '#b5224c', secondaryColor: '#f06b8e' },
  { id: 11, kind: 'caramel', startXRatio: 0.21, delayProgress: 0.48, durationProgress: 0.34, rotationSpeed: -1.6, size: 13, color: '#dc8a2c', secondaryColor: '#f8cb7e' },
  { id: 12, kind: 'gold-flake', startXRatio: -0.03, delayProgress: 0.54, durationProgress: 0.33, rotationSpeed: 3.7, size: 12, color: '#f2b544', secondaryColor: '#fff0bd' },
  { id: 13, kind: 'almond', startXRatio: -0.19, delayProgress: 0.58, durationProgress: 0.33, rotationSpeed: 2.2, size: 13, color: '#edd9ba', secondaryColor: '#b48249' },
  { id: 14, kind: 'pistachio', startXRatio: 0.09, delayProgress: 0.62, durationProgress: 0.34, rotationSpeed: -2.9, size: 13, color: '#7ea86e', secondaryColor: '#4c733d' },
];

export function getStoryWordLitCount(totalWords: number, progress: number): number {
  if (totalWords <= 0) return 0;
  const clamped = Math.max(0, Math.min(1, progress));
  return Math.round(clamped * totalWords);
}

export interface ToppingRenderState {
  visible: boolean;
  localProgress: number; // 0..1
  xOffsetRatio: number;
  yProgress: number; // 0 (top) .. 1 (resting in cup)
  opacity: number;
  scale: number;
  rotationRad: number;
}

export function getToppingParticleState(
  spec: ToppingSpec,
  scrollProgress: number
): ToppingRenderState {
  const clamped = Math.max(0, Math.min(1, scrollProgress));
  if (clamped < spec.delayProgress) {
    return {
      visible: false,
      localProgress: 0,
      xOffsetRatio: spec.startXRatio,
      yProgress: 0,
      opacity: 0,
      scale: 0.6,
      rotationRad: 0,
    };
  }
  const rawLocal = (clamped - spec.delayProgress) / spec.durationProgress;
  const local = Math.max(0, Math.min(1, rawLocal));
  // Ease in quad for gravity fall, settle slightly into the swirl mound
  const yProgress = local * local * 0.92 + local * 0.08;
  const xOffsetRatio = spec.startXRatio * (1 - local * 0.42);
  const fadeIn = Math.min(1, local * 4);
  const scale = 0.75 + 0.25 * Math.min(1, local * 2);
  return {
    visible: true,
    localProgress: local,
    xOffsetRatio,
    yProgress,
    opacity: fadeIn,
    scale,
    rotationRad: local * Math.PI * spec.rotationSpeed,
  };
}
