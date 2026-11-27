import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  STORY_CUP_IMAGE,
  STORY_PARAGRAPH,
  STORY_VALUES,
} from '../data/story';
import {
  getStoryWordLitCount,
  getToppingParticleState,
  STORY_TOPPINGS,
  type ToppingSpec,
} from '../utils/storySequence';
import { processStudioCutout } from '../utils/imageCutout';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';
import { SectionHeading } from './SectionHeading';

gsap.registerPlugin(ScrollTrigger);

function drawTopping(
  ctx: CanvasRenderingContext2D,
  spec: ToppingSpec,
  x: number,
  y: number,
  scale: number,
  rotation: number,
  opacity: number
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  const s = spec.size;
  if (spec.kind === 'berry') {
    ctx.fillStyle = spec.color;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = spec.secondaryColor;
    ctx.beginPath();
    ctx.arc(-s * 0.16, -s * 0.16, s * 0.18, 0, Math.PI * 2);
    ctx.fill();
  } else if (spec.kind === 'pistachio') {
    ctx.fillStyle = spec.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.6, s * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = spec.secondaryColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, 0);
    ctx.lineTo(s * 0.35, 0);
    ctx.stroke();
  } else if (spec.kind === 'chocolate') {
    ctx.fillStyle = spec.color;
    ctx.beginPath();
    ctx.roundRect(-s * 0.55, -s * 0.25, s * 1.1, s * 0.5, 4);
    ctx.fill();
    ctx.fillStyle = spec.secondaryColor;
    ctx.fillRect(-s * 0.35, -s * 0.12, s * 0.7, s * 0.1);
  } else if (spec.kind === 'caramel') {
    ctx.fillStyle = spec.color;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.6);
    ctx.bezierCurveTo(s * 0.5, -s * 0.1, s * 0.45, s * 0.55, 0, s * 0.55);
    ctx.bezierCurveTo(-s * 0.45, s * 0.55, -s * 0.5, -s * 0.1, 0, -s * 0.6);
    ctx.fill();
  } else if (spec.kind === 'gold-flake') {
    ctx.fillStyle = spec.color;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.6);
    ctx.lineTo(s * 0.45, 0);
    ctx.lineTo(0, s * 0.6);
    ctx.lineTo(-s * 0.45, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    // almond sliver
    ctx.fillStyle = spec.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.65, s * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = spec.secondaryColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}

export function OurStorySection() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cupBitmapRef = useRef<HTMLImageElement | null>(null);
  const progressRef = useRef<number>(reducedMotion ? 1 : 0.25);

  const [progress, setProgress] = useState<number>(reducedMotion ? 1 : 0.25);
  const [assetsRequested, setAssetsRequested] = useState<boolean>(false);
  const [cupReady, setCupReady] = useState<boolean>(false);

  const words = useMemo(() => STORY_PARAGRAPH.split(' '), []);
  const litWordCount = getStoryWordLitCount(words.length, reducedMotion ? 1 : progress);

  // Lazy-load the cup cutout frames only when Our Story is near the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setAssetsRequested(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setAssetsRequested(true);
          obs.disconnect();
        }
      },
      { rootMargin: '450px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!assetsRequested) return;
    let cancelled = false;
    processStudioCutout(STORY_CUP_IMAGE).then((cutoutUrl) => {
      if (cancelled) return;
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        cupBitmapRef.current = img;
        setCupReady(true);
      };
      img.src = cutoutUrl;
    });
    return () => {
      cancelled = true;
    };
  }, [assetsRequested]);

  // Draw scrubbed toppings-into-cup sequence onto transparent canvas
  const drawFrame = (seqProgress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || 440;
    const height = canvas.clientHeight || 520;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const cupTopY = height * 0.26;
    const cupDrawW = Math.min(width * 0.82, 360);
    const cupDrawH = cupDrawW * 1.18;

    // Soft halo behind cup
    const radial = ctx.createRadialGradient(
      centerX,
      height * 0.62,
      20,
      centerX,
      height * 0.62,
      cupDrawW * 0.68
    );
    radial.addColorStop(0, 'rgba(243, 201, 212, 0.72)');
    radial.addColorStop(1, 'rgba(252, 236, 240, 0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(centerX, height * 0.62, cupDrawW * 0.68, 0, Math.PI * 2);
    ctx.fill();

    // Draw falling toppings behind top rim before landing, and over scoop peak
    const spawnTopY = height * 0.05;
    const settleY = cupTopY + cupDrawH * 0.31;

    STORY_TOPPINGS.forEach((spec) => {
      const state = getToppingParticleState(spec, seqProgress);
      if (!state.visible) return;
      const x = centerX + state.xOffsetRatio * cupDrawW;
      const y = spawnTopY + (settleY - spawnTopY) * state.yProgress;
      if (state.yProgress < 0.78) {
        drawTopping(ctx, spec, x, y, state.scale, state.rotationRad, state.opacity);
      }
    });

    // Draw transparent Swirl Creamery cup
    const cupImg = cupBitmapRef.current;
    if (cupImg) {
      const gentleTilt = Math.sin(seqProgress * Math.PI * 2) * 0.025;
      ctx.save();
      ctx.translate(centerX, cupTopY + cupDrawH * 0.52);
      ctx.rotate(gentleTilt);
      ctx.drawImage(cupImg, -cupDrawW / 2, -cupDrawH / 2, cupDrawW, cupDrawH);
      ctx.restore();
    }

    // Draw landed & foreground toppings resting in/on the soft serve swirl
    STORY_TOPPINGS.forEach((spec) => {
      const state = getToppingParticleState(spec, seqProgress);
      if (!state.visible || state.yProgress < 0.78) return;
      const x = centerX + state.xOffsetRatio * cupDrawW;
      const y = spawnTopY + (settleY - spawnTopY) * state.yProgress;
      drawTopping(ctx, spec, x, y, state.scale, state.rotationRad, state.opacity);
    });

    ctx.restore();
  };

  useEffect(() => {
    drawFrame(reducedMotion ? 1 : progress);
  }, [progress, cupReady, reducedMotion]);

  // GSAP ScrollTrigger: pin section on desktop & scrub word lighting + canvas sequence
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) {
      setProgress(1);
      return;
    }

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.35,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          setProgress(p);
          drawFrame(p);
        },
      });
      return () => trigger.kill();
    });

    mm.add('(max-width: 1023px)', () => {
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        end: 'bottom 35%',
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          setProgress(p);
          drawFrame(p);
        },
      });
      return () => trigger.kill();
    });

    return () => {
      mm.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="our-story"
      ref={sectionRef}
      className="relative py-20 lg:py-24 bg-[#f6d5df]/50 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-10">
          {/* Left Column: Heading + Word-by-word lit paragraph + 3 Value Cards */}
          <div className="lg:col-span-6 flex flex-col">
            <SectionHeading
              eyebrow="Crafted In Small Kettles"
              outlinedLine="MADE TO"
              solidLine="SWIRL"
              align="left"
            />

            <p
              className="mt-7 font-display text-xl sm:text-2xl lg:text-[1.65rem] leading-[1.45] font-semibold"
              aria-label={STORY_PARAGRAPH}
            >
              {words.map((word, index) => {
                const isLit = index < litWordCount;
                return (
                  <span
                    key={`${word}-${index}`}
                    className={`inline-block mr-[0.3em] transition-colors duration-200 ${
                      isLit ? 'text-[#3d0f1f]' : 'text-[#3d0f1f]/38'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {STORY_VALUES.map((val) => (
                <div
                  key={val.id}
                  className="rounded-[1.75rem] bg-[#fcecf0] p-5 shadow-burgundy"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5a1a2e]">
                    {val.metric}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-[#3d0f1f]">
                    {val.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#3d0f1f]/75">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Scroll-scrubbed transparent toppings-into-cup canvas + rotating circular badge */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-[440px] h-[440px] sm:h-[520px] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                data-testid="story-sequence-canvas"
                data-progress={progress.toFixed(2)}
                aria-label="Scroll-animated sequence of gourmet toppings falling into a Swirl Creamery cup"
                className="w-full h-full block"
              />

              {/* Circular rotating text badge on top-right corner */}
              <div
                aria-hidden="true"
                className="absolute -top-2 right-0 sm:right-2 w-32 h-32 sm:w-36 sm:h-36 pointer-events-none select-none"
              >
                <svg
                  viewBox="0 0 148 148"
                  className="w-full h-full animate-spin-badge"
                >
                  <defs>
                    <path
                      id="story-badge-circle"
                      d="M 74, 74 m -54, 0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0"
                    />
                  </defs>
                  <text
                    fill="#3d0f1f"
                    fontSize="8.8"
                    fontWeight="700"
                    letterSpacing="1.85"
                    fontFamily="Poppins, sans-serif"
                  >
                    <textPath href="#story-badge-circle" startOffset="0%">
                      SMALL BATCH • REAL INGREDIENTS • MADE TO SWIRL •
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="h-11 w-11 rounded-full bg-[#3d0f1f] text-[#f2b544] font-display italic font-bold text-sm flex items-center justify-center shadow-burgundy">
                    S
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
