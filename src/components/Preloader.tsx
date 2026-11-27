import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<'bounce' | 'zoom' | 'done'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return 'done';
    }
    return 'bounce';
  });

  useEffect(() => {
    if (reducedMotion) {
      setPhase('done');
      onComplete();
      return;
    }
    if (phase === 'done') {
      onComplete();
      return;
    }

    // Lock scrolling while preloader plays
    const prevOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const zoomTimer = window.setTimeout(() => {
      setPhase('zoom');
    }, 850);

    const doneTimer = window.setTimeout(() => {
      setPhase('done');
      document.documentElement.style.overflow = prevOverflow;
      document.body.style.overflow = prevBodyOverflow;
      onComplete();
    }, 1600);

    return () => {
      window.clearTimeout(zoomTimer);
      window.clearTimeout(doneTimer);
      document.documentElement.style.overflow = prevOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [reducedMotion, phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="swirl-preloader"
        aria-hidden="true"
        className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'zoom' ? 0 : 1 }}
        transition={{ duration: phase === 'zoom' ? 0.55 : 0.2, delay: phase === 'zoom' ? 0.2 : 0, ease: 'easeOut' }}
      >
        {/* Full-screen deep burgundy sheet with SVG cutout mask so hero shines through the logo */}
        <svg
          className="w-full h-full block"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <mask id="swirl-cutout-mask">
              <rect x="0" y="0" width="1440" height="900" fill="white" />
              <motion.g
                style={{ transformOrigin: '720px 450px' }}
                initial={{ scale: 0.14 }}
                animate={
                  phase === 'bounce'
                    ? { scale: [0.14, 1.08, 0.98, 1] }
                    : { scale: 26 }
                }
                transition={
                  phase === 'bounce'
                    ? { duration: 0.72, times: [0, 0.58, 0.82, 1], ease: [0.22, 1, 0.36, 1] }
                    : { duration: 0.72, ease: [0.65, 0, 0.35, 1] }
                }
              >
                {/* Cone icon cutout */}
                <path
                  d="M720 302C725 318 746 322 744 338C756 341 762 352 754 362C764 366 766 380 755 388H685C674 380 676 366 686 362C678 352 684 341 696 338C694 322 715 318 720 302Z"
                  fill="black"
                />
                <path d="M689 392H751L720 444L689 392Z" fill="black" />
                {/* Cutout Brand Letters */}
                <text
                  x="720"
                  y="526"
                  textAnchor="middle"
                  fill="black"
                  fontFamily="Fraunces, Georgia, serif"
                  fontStyle="italic"
                  fontWeight="800"
                  fontSize="108"
                  letterSpacing="-2"
                >
                  Swirl
                </text>
                <text
                  x="720"
                  y="560"
                  textAnchor="middle"
                  fill="black"
                  fontFamily="Poppins, sans-serif"
                  fontWeight="700"
                  fontSize="21"
                  letterSpacing="14"
                >
                  CREAMERY
                </text>
              </motion.g>
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="1440"
            height="900"
            fill="#3d0f1f"
            mask="url(#swirl-cutout-mask)"
          />
        </svg>
      </motion.div>
    </AnimatePresence>
  );
}
