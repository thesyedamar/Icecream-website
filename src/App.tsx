import React, { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONVEYOR_FLAVORS, type Flavor } from './data/flavors';
import { CartProvider } from './context/CartContext';
import { usePrefersReducedMotion } from './hooks/useReducedMotion';
import { Preloader } from './components/Preloader';
import { HeroSection } from './components/HeroSection';
import { FlavorsSection } from './components/FlavorsSection';
import { OurStorySection } from './components/OurStorySection';
import { BestSellersSection } from './components/BestSellersSection';
import { DiwaliOffersSection } from './components/DiwaliOffersSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactFooter } from './components/ContactFooter';
import { FloatingCartButton } from './components/FloatingCartButton';
import { CartDrawer } from './components/CartDrawer';
import { ToastBanner } from './components/ToastBanner';
import { CutoutImage } from './components/CutoutImage';

gsap.registerPlugin(ScrollTrigger);

function SwirlCreameryPage() {
  const reducedMotion = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const frontTubRef = useRef<HTMLDivElement | null>(null);
  const flyingTubRef = useRef<HTMLDivElement | null>(null);

  const [preloaderDone, setPreloaderDone] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('autostart') === '1';
    }
    return false;
  });
  const [activeHeroFlavor, setActiveHeroFlavor] = useState<Flavor>(
    CONVEYOR_FLAVORS[CONVEYOR_FLAVORS.length - 1]
  );
  const activeHeroFlavorRef = useRef<Flavor>(activeHeroFlavor);
  activeHeroFlavorRef.current = activeHeroFlavor;

  const [caughtFlavor, setCaughtFlavor] = useState<Flavor | null>(null);
  const [flyPhase, setFlyPhase] = useState<'idle' | 'flying' | 'landed'>('idle');
  const [justLanded, setJustLanded] = useState(false);
  const flyPhaseRef = useRef<'idle' | 'flying' | 'landed'>('idle');
  const landedTimerRef = useRef<number | null>(null);

  // Initialize Lenis smooth scroll synced with GSAP ScrollTrigger
  useEffect(() => {
    if (reducedMotion || !preloaderDone) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion, preloaderDone]);

  // Continuous scroll-scrubbed Hero front tub flight down into the Flavors marquee center catch
  useEffect(() => {
    if (reducedMotion || !preloaderDone) return;
    const heroEl = document.getElementById('hero');
    const marqueeEl = document.getElementById('flavors-marquee');
    if (!heroEl || !marqueeEl) return;

    const updateFlyPosition = (progress: number) => {
      const flyEl = flyingTubRef.current;
      const frontEl = frontTubRef.current;
      if (!flyEl || !frontEl) return;

      const startRect = frontEl.getBoundingClientRect();
      const startX = startRect.left + startRect.width / 2;
      const startY = startRect.top + startRect.height / 2;
      const startSize = Math.max(120, startRect.width);

      // Measure real caught cup slot inside Flavors marquee (with marquee center fallback)
      const targetSlotEl = document.querySelector(
        '[data-caught-cup-slot="true"]'
      ) as HTMLElement | null;
      const marqueeRect = marqueeEl.getBoundingClientRect();

      let endX = marqueeRect.left + marqueeRect.width / 2;
      let endY = marqueeRect.top + marqueeRect.height * 0.36;
      let endSize = 144;

      if (targetSlotEl) {
        const slotRect = targetSlotEl.getBoundingClientRect();
        endX = slotRect.left + slotRect.width / 2;
        endY = slotRect.top + slotRect.height / 2;
        endSize = 144;
      }

      // Smooth cubic ease for flight interpolation + gentle arc
      const t = Math.max(0, Math.min(1, (progress - 0.02) / 0.94));
      const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const arcX = Math.sin(t * Math.PI) * 32;
      const arcY = -Math.sin(t * Math.PI) * 28;

      const curX = startX + (endX - startX) * easeT + arcX;
      const curY = startY + (endY - startY) * easeT + arcY;
      const curScale = (startSize + (endSize - startSize) * easeT) / 176;
      const curRotation = Math.sin(t * Math.PI) * -10;

      flyEl.style.transform = `translate3d(${curX - 88}px, ${curY - 88}px, 0) scale(${curScale}) rotate(${curRotation}deg)`;
    };

    const trigger = ScrollTrigger.create({
      trigger: heroEl,
      start: 'top top',
      endTrigger: marqueeEl,
      end: 'center 58%',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        if (p <= 0.02) {
          if (flyPhaseRef.current !== 'idle') {
            flyPhaseRef.current = 'idle';
            setFlyPhase('idle');
            setCaughtFlavor(null);
            setJustLanded(false);
          }
          return;
        }

        if (p >= 0.96) {
          if (flyPhaseRef.current === 'idle') {
            setCaughtFlavor(activeHeroFlavorRef.current);
          }
          if (flyPhaseRef.current !== 'landed') {
            flyPhaseRef.current = 'landed';
            setFlyPhase('landed');
            setJustLanded(true);
            if (landedTimerRef.current) {
              window.clearTimeout(landedTimerRef.current);
            }
            landedTimerRef.current = window.setTimeout(() => {
              setJustLanded(false);
            }, 520);
          }
          return;
        }

        // Actively flying between Hero front tub and Flavors marquee cup
        if (flyPhaseRef.current === 'idle') {
          setCaughtFlavor(activeHeroFlavorRef.current);
        }
        if (flyPhaseRef.current !== 'flying') {
          flyPhaseRef.current = 'flying';
          setFlyPhase('flying');
          setJustLanded(false);
        }

        updateFlyPosition(p);
      },
    });

    return () => {
      trigger.kill();
      if (landedTimerRef.current) {
        window.clearTimeout(landedTimerRef.current);
      }
    };
  }, [reducedMotion, preloaderDone]);

  const handleNavigate = useCallback(
    (sectionId: string) => {
      const target = document.getElementById(sectionId);
      if (!target) return;
      if (lenisRef.current && !reducedMotion) {
        lenisRef.current.scrollTo(target, { offset: 0 });
      } else {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    },
    [reducedMotion]
  );

  const displayFlyFlavor = caughtFlavor ?? activeHeroFlavor;
  const isFlying = flyPhase === 'flying';

  return (
    <div className="relative min-h-screen bg-[#fcecf0] text-[#3d0f1f]">
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* Flying Tub Overlay for Hero -> Flavors Scroll-Scrubbed Catch Transition */}
      <div
        ref={flyingTubRef}
        data-testid="flying-tub-overlay"
        data-fly-phase={flyPhase}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[45] w-44 h-44 will-change-transform"
        style={{
          opacity: isFlying ? 1 : 0,
          visibility: isFlying ? 'visible' : 'hidden',
        }}
      >
        <CutoutImage
          src={displayFlyFlavor.image}
          alt=""
          accentColor={displayFlyFlavor.swatchColor}
          className="w-full h-full drop-shadow-2xl"
        />
      </div>

      <main>
        <HeroSection
          onNavigate={handleNavigate}
          onActiveFlavorChange={setActiveHeroFlavor}
          frontTubRef={frontTubRef}
          hideFrontTub={flyPhase !== 'idle'}
          pauseConveyor={flyPhase !== 'idle'}
        />

        <FlavorsSection
          activeHeroFlavor={activeHeroFlavor}
          caughtFlavorId={caughtFlavor?.id ?? null}
          isCatching={isFlying}
          hideCaughtCupImage={isFlying}
          justLanded={justLanded}
        />

        <OurStorySection />

        <BestSellersSection />

        <DiwaliOffersSection />

        <ReviewsSection />
      </main>

      <ContactFooter onNavigate={handleNavigate} />

      <FloatingCartButton />
      <CartDrawer />
      <ToastBanner />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <SwirlCreameryPage />
    </CartProvider>
  );
}
