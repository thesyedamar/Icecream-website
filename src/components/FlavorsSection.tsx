import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { FLAVORS, type Flavor } from '../data/flavors';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/cartLogic';
import { computeMarqueeCenterOffset } from '../utils/conveyorLogic';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';
import { CutoutImage } from './CutoutImage';
import { SectionHeading } from './SectionHeading';

interface FlavorsSectionProps {
  activeHeroFlavor: Flavor;
  caughtFlavorId: string | null;
  isCatching?: boolean;
  hideCaughtCupImage?: boolean;
  justLanded?: boolean;
}

const CARD_WIDTH = 264;
const CARD_GAP = 24;
const TRACK_STRIDE = CARD_WIDTH + CARD_GAP;
const BASE_LOOP_WIDTH = FLAVORS.length * TRACK_STRIDE;

export function FlavorsSection({
  activeHeroFlavor,
  caughtFlavorId,
  isCatching = false,
  hideCaughtCupImage = false,
  justLanded = false,
}: FlavorsSectionProps) {
  const { addItem } = useCart();
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const offsetRef = useRef<number>(0);
  const velocityRef = useRef<number>(-0.55);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isInViewRef = useRef(true);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastDragXRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const glideTargetRef = useRef<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isInView, setIsInView] = useState(true);

  const repeatedFlavors = useMemo(() => [...FLAVORS, ...FLAVORS, ...FLAVORS], []);

  // Track visibility to pause offscreen swirl animations & RAF loop
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        isInViewRef.current = visible;
        setIsInView(visible);
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isCatchingRef = useRef(isCatching);
  isCatchingRef.current = isCatching;

  // Center the caught flavor smoothly when hero tub flies down into the marquee
  useEffect(() => {
    if (!caughtFlavorId || reducedMotion) {
      glideTargetRef.current = null;
      return;
    }
    const viewportW = viewportRef.current?.clientWidth ?? window.innerWidth;
    const idx = FLAVORS.findIndex((f) => f.id === caughtFlavorId);
    if (idx === -1) return;

    // Target middle set of the 3x repeated track
    const middleIndex = FLAVORS.length + idx;
    const desiredOffset = computeMarqueeCenterOffset(
      middleIndex,
      repeatedFlavors.length,
      CARD_WIDTH,
      CARD_GAP,
      viewportW
    );
    glideTargetRef.current = desiredOffset;
  }, [caughtFlavorId, reducedMotion, repeatedFlavors.length]);

  // Smooth RAF loop supporting endless auto-drift, drag inertia, trackpad wheel, and center-catch glide
  useEffect(() => {
    if (reducedMotion) return;
    let rafId = 0;

    const tick = () => {
      if (isInViewRef.current || isCatchingRef.current) {
        if (glideTargetRef.current !== null && !isDraggingRef.current) {
          const diff = glideTargetRef.current - offsetRef.current;
          offsetRef.current += diff * 0.14;
          if (Math.abs(diff) < 0.8) {
            offsetRef.current = glideTargetRef.current;
            // Hold centered while tub is actively flying toward it; release once landed
            if (!isCatchingRef.current) {
              glideTargetRef.current = null;
            }
          }
        } else if (!isDraggingRef.current) {
          if (!isHoveredRef.current) {
            offsetRef.current += velocityRef.current;
            // Decay inertia smoothly back to gentle drift
            velocityRef.current += (-0.52 - velocityRef.current) * 0.04;
          } else {
            velocityRef.current *= 0.9;
          }
        }

        // Seamless wrap-around within middle loop band
        if (offsetRef.current <= -BASE_LOOP_WIDTH * 2) {
          offsetRef.current += BASE_LOOP_WIDTH;
          if (glideTargetRef.current !== null) glideTargetRef.current += BASE_LOOP_WIDTH;
        } else if (offsetRef.current >= 0) {
          offsetRef.current -= BASE_LOOP_WIDTH;
          if (glideTargetRef.current !== null) glideTargetRef.current -= BASE_LOOP_WIDTH;
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    // Start centered inside second loop so dragging either direction never clips
    offsetRef.current = -BASE_LOOP_WIDTH + 60;
    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore drags starting on buttons
    if ((e.target as HTMLElement).closest('button')) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    glideTargetRef.current = null;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    offsetRef.current = dragStartOffsetRef.current + dx;

    const now = performance.now();
    const dt = Math.max(8, now - lastDragTimeRef.current);
    const instantVel = ((e.clientX - lastDragXRef.current) / dt) * 16;
    velocityRef.current = Math.max(-18, Math.min(18, instantVel));
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = now;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
      glideTargetRef.current = null;
      offsetRef.current -= e.deltaX;
    }
  }, []);

  const handleAddFlavor = (flavor: Flavor) => {
    addItem({
      id: flavor.id,
      name: flavor.name,
      price: flavor.price,
      image: flavor.image,
      accentColor: flavor.swatchColor,
      subtitle: flavor.notes,
    });
  };

  return (
    <section
      id="flavors"
      ref={sectionRef}
      className="relative py-20 sm:py-28 bg-[#fcecf0] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 mb-12 flex flex-col items-center">
        <SectionHeading
          eyebrow="Nine Artisanal Scoops"
          outlinedLine="YOUR FAVORITE"
          solidLine="FLAVORS"
          align="center"
        />
        <p className="mt-4 text-center text-sm sm:text-base text-[#3d0f1f]/75 max-w-lg">
          Drag, flick, or scroll sideways to explore every small-batch cup—each spun over its own signature swirl.
        </p>
      </div>

      {/* Endless Marquee Track (or clean responsive grid if reduced-motion) */}
      {reducedMotion ? (
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLAVORS.map((flavor) => (
            <FlavorCard
              key={flavor.id}
              flavor={flavor}
              isHighlighted={flavor.id === activeHeroFlavor.id}
              isCaughtSlot={false}
              hideCupImage={false}
              justLanded={false}
              spinPaused={true}
              onAdd={() => handleAddFlavor(flavor)}
            />
          ))}
        </div>
      ) : (
        <div
          id="flavors-marquee"
          ref={viewportRef}
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className={`relative w-full overflow-hidden py-6 touch-pan-y select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          aria-label="Flavors marquee carousel"
        >
          <div
            ref={trackRef}
            className="flex items-stretch will-change-transform"
            style={{ gap: `${CARD_GAP}px` }}
          >
            {repeatedFlavors.map((flavor, idx) => {
              const isMiddleSet =
                idx >= FLAVORS.length && idx < FLAVORS.length * 2;
              const isCaughtTarget =
                isMiddleSet && caughtFlavorId === flavor.id;

              return (
                <div
                  key={`${flavor.id}-${idx}`}
                  style={{ width: `${CARD_WIDTH}px`, flexShrink: 0 }}
                >
                  <FlavorCard
                    flavor={flavor}
                    isHighlighted={
                      flavor.id === (caughtFlavorId ?? activeHeroFlavor.id)
                    }
                    isCaughtSlot={isCaughtTarget}
                    hideCupImage={isCaughtTarget && hideCaughtCupImage}
                    justLanded={isCaughtTarget && justLanded}
                    spinPaused={!isInView}
                    onAdd={() => handleAddFlavor(flavor)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

interface FlavorCardProps {
  flavor: Flavor;
  isHighlighted: boolean;
  isCaughtSlot: boolean;
  hideCupImage: boolean;
  justLanded: boolean;
  spinPaused: boolean;
  onAdd: () => void;
}

function FlavorCard({
  flavor,
  isHighlighted,
  isCaughtSlot,
  hideCupImage,
  justLanded,
  spinPaused,
  onAdd,
}: FlavorCardProps) {
  return (
    <article
      data-flavor-card={flavor.id}
      className={`group relative flex h-full flex-col justify-between rounded-[2rem] bg-[#f6d5df]/55 p-6 transition-all duration-300 shadow-burgundy hover:-translate-y-1.5 ${
        isHighlighted ? 'ring-2 ring-[#5a1a2e]/40 bg-[#f6d5df]/80' : ''
      } ${justLanded ? 'scale-[1.03]' : ''}`}
    >
      {/* Cup over spinning SVG spiral swirl */}
      <div
        data-caught-cup-slot={isCaughtSlot ? 'true' : undefined}
        className="relative mx-auto w-44 h-44 flex items-center justify-center mb-4"
      >
        <svg
          viewBox="0 0 200 200"
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full animate-spin-slow ${
            spinPaused ? 'pause-offscreen' : ''
          }`}
        >
          <circle cx="100" cy="100" r="84" fill={flavor.circleBg} opacity="0.7" />
          <path
            d="M100 100 C 115 92, 128 106, 122 122 C 114 142, 82 142, 70 120 C 56 94, 74 60, 106 56 C 142 52, 166 86, 156 124 C 146 160, 102 178, 66 160"
            fill="none"
            stroke={flavor.swirlColor}
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M100 100 C 88 108, 76 96, 82 82 C 89 66, 114 68, 124 86 C 134 106, 120 136, 94 142"
            fill="none"
            stroke={flavor.swatchColor}
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>

        <div
          className={`relative z-10 w-36 h-36 transition-transform duration-300 group-hover:scale-105 ${
            hideCupImage ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          } ${justLanded ? 'scale-110' : ''}`}
        >
          <CutoutImage
            src={flavor.image}
            alt={flavor.name}
            accentColor={flavor.swatchColor}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Info + Price + Add button */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#5a1a2e]/80 mb-1">
            {flavor.notes}
          </p>
          <h3 className="font-display text-xl font-bold text-[#3d0f1f] leading-snug">
            {flavor.name}
          </h3>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-[#3d0f1f]/10">
          <span className="font-display text-xl font-bold text-[#3d0f1f] tabular-nums">
            {formatCurrency(flavor.price)}
          </span>
          <button
            type="button"
            onClick={onAdd}
            aria-label={`Add ${flavor.name} to cart`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#3d0f1f] px-4 py-2 text-xs font-semibold text-[#fcecf0] hover:bg-[#5a1a2e] active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}
