import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CONVEYOR_FLAVORS, FLAVOR_BY_ID, type Flavor } from '../data/flavors';
import {
  CONVEYOR_SLOTS,
  stepConveyorOrder,
  stepsToFront,
} from '../utils/conveyorLogic';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';
import { CutoutImage } from './CutoutImage';
import { Navbar } from './Navbar';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  onActiveFlavorChange: (flavor: Flavor) => void;
  frontTubRef: React.RefObject<HTMLDivElement | null>;
  hideFrontTub?: boolean;
  pauseConveyor?: boolean;
}

export function HeroSection({
  onNavigate,
  onActiveFlavorChange,
  frontTubRef,
  hideFrontTub = false,
  pauseConveyor = false,
}: HeroSectionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [order, setOrder] = useState<string[]>(() =>
    CONVEYOR_FLAVORS.map((f) => f.id)
  );
  const [isVisible, setIsVisible] = useState(true);
  const [fastTargetId, setFastTargetId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const frontFlavorId = order[order.length - 1];
  const activeFlavor = FLAVOR_BY_ID[frontFlavorId] ?? CONVEYOR_FLAVORS[0];

  useEffect(() => {
    onActiveFlavorChange(activeFlavor);
  }, [activeFlavor, onActiveFlavorChange]);

  // Pause conveyor when Hero is offscreen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0]?.isIntersecting ?? true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Normal ~1.4s conveyor step vs fast ~140ms swatch catch-up
  useEffect(() => {
    if (reducedMotion && !fastTargetId) return;
    if ((!isVisible || pauseConveyor) && !fastTargetId) return;

    if (fastTargetId) {
      if (frontFlavorId === fastTargetId) {
        setFastTargetId(null);
        return;
      }
      const fastTimer = window.setTimeout(() => {
        setOrder((prev) => stepConveyorOrder(prev));
      }, 150);
      return () => window.clearTimeout(fastTimer);
    }

    const interval = window.setInterval(() => {
      setOrder((prev) => stepConveyorOrder(prev));
    }, 1450);

    return () => window.clearInterval(interval);
  }, [reducedMotion, isVisible, pauseConveyor, fastTargetId, frontFlavorId]);

  const handleSwatchClick = useCallback(
    (flavorId: string) => {
      if (reducedMotion) {
        // Jump directly in reduced motion mode
        setOrder((prev) => {
          let next = [...prev];
          const count = stepsToFront(next, flavorId);
          for (let i = 0; i < count; i++) {
            next = stepConveyorOrder(next);
          }
          return next;
        });
        return;
      }
      if (frontFlavorId === flavorId) return;
      setFastTargetId(flavorId);
    },
    [frontFlavorId, reducedMotion]
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-active-flavor={activeFlavor.id}
      className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between overflow-hidden transition-colors duration-700 ease-out"
      style={{ backgroundColor: activeFlavor.heroTint }}
    >
      {/* Subtle radial depth behind conveyor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-[540px] w-[540px] rounded-full opacity-55 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: activeFlavor.swirlColor }}
      />

      <Navbar onNavigate={onNavigate} />

      {/* Main Hero Grid */}
      <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 px-5 pt-4 pb-8 sm:px-8 lg:px-10">
        {/* Left: Diagonal 5-Tub Conveyor */}
        <div className="order-2 lg:order-1 lg:col-span-6 relative h-[360px] sm:h-[440px] lg:h-[540px] flex items-center justify-center">
          {/* Diagonal conveyor track guide */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 420 420"
              className="w-full h-full max-w-[460px] opacity-25"
              fill="none"
            >
              <path
                d="M55 45 C 145 135, 225 225, 290 365"
                stroke="#3d0f1f"
                strokeWidth="2"
                strokeDasharray="8 10"
              />
            </svg>
          </div>

          <div
            className="relative w-full max-w-[480px] h-full"
            aria-label="Ice cream flavor conveyor showcase"
          >
            {order.map((flavorId, slotIdx) => {
              const flavor = FLAVOR_BY_ID[flavorId];
              if (!flavor) return null;
              const slot = CONVEYOR_SLOTS[slotIdx] ?? CONVEYOR_SLOTS[4];
              const isFront = slotIdx === order.length - 1;

              return (
                <div
                  key={flavor.id}
                  ref={isFront ? frontTubRef : undefined}
                  data-conveyor-slot={slotIdx}
                  onClick={() => handleSwatchClick(flavor.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSwatchClick(flavor.id);
                    }
                  }}
                  aria-label={`Select ${flavor.name}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e] rounded-full"
                  style={{
                    left: `${slot.xPercent}%`,
                    top: `${slot.yPercent}%`,
                    zIndex: slot.zIndex,
                    opacity: isFront && hideFrontTub ? 0 : slot.opacity,
                    transform: `translate(-50%, -50%) scale(${slot.scale})`,
                    filter: slot.blurPx ? `blur(${slot.blurPx}px)` : 'none',
                  }}
                >
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                    {/* Soft shadow beneath each tub */}
                    <div
                      aria-hidden="true"
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full blur-md transition-opacity duration-500"
                      style={{
                        backgroundColor: 'rgba(61, 15, 31, 0.22)',
                        opacity: isFront ? 0.9 : 0.45,
                      }}
                    />
                    <CutoutImage
                      src={flavor.image}
                      alt={flavor.name}
                      accentColor={flavor.swatchColor}
                      className="w-full h-full drop-shadow-xl"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Hero Display Headline */}
        <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-start lg:items-end text-left lg:text-right">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-[#5a1a2e] mb-4">
            Now Churning · {activeFlavor.name}
          </span>
          <h1 className="font-display font-extrabold uppercase leading-[0.92] tracking-tight text-5xl sm:text-6xl md:text-7xl xl:text-[5.25rem] text-balance">
            <span className="block text-stroke-burgundy">ICE CREAM</span>
            <span className="block mt-2 text-[#3d0f1f]">
              JUST THE WAY
              <br />
              YOU LIKE IT
            </span>
          </h1>
          <p className="mt-6 max-w-md text-sm sm:text-base text-[#3d0f1f]/80 leading-relaxed lg:text-right">
            Small-batch creamery cups spun with orchard berries, toasted pistachios,
            and copper-kettle caramel swirls.
          </p>
        </div>
      </div>

      {/* Hero Bottom Bar: Tagline + Shop Now (Left) & Color Swatches (Right) */}
      <div className="relative z-10 mx-auto w-full max-w-7xl flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 px-5 pb-8 sm:px-8 lg:px-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <p className="text-sm sm:text-base font-medium text-[#3d0f1f] max-w-xs">
            Premium ice cream. Playful flavors. Made to swirl.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('flavors')}
            className="inline-flex items-center gap-2.5 rounded-full bg-[#3d0f1f] px-7 py-3.5 text-sm font-semibold text-[#fcecf0] shadow-burgundy hover:bg-[#5a1a2e] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e] focus-visible:ring-offset-2"
          >
            <span>Shop Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Swatches */}
        <div className="flex flex-col items-start sm:items-end gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#5a1a2e]">
            Pick a swirl
          </span>
          <div
            className="flex items-center gap-3 rounded-full bg-[#fcecf0]/75 backdrop-blur-sm px-3.5 py-2 border border-[#3d0f1f]/10"
            role="group"
            aria-label="Flavor color swatches"
          >
            {CONVEYOR_FLAVORS.map((flavor) => {
              const isActive = flavor.id === activeFlavor.id;
              return (
                <button
                  key={flavor.id}
                  type="button"
                  onClick={() => handleSwatchClick(flavor.id)}
                  aria-label={`Bring ${flavor.name} to front`}
                  aria-pressed={isActive}
                  title={flavor.name}
                  className={`relative h-8 w-8 rounded-full transition-transform duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d0f1f] focus-visible:ring-offset-2 ${
                    isActive
                      ? 'scale-115 ring-2 ring-[#3d0f1f] ring-offset-2 ring-offset-[#fcecf0]'
                      : 'hover:scale-110 opacity-85 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: flavor.swatchColor }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
