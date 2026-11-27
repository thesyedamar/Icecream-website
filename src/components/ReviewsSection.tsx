import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import {
  CUSTOMER_REVIEWS,
  TOTAL_REVIEW_COUNT,
  type CustomerReview,
} from '../data/reviews';
import { FLAVOR_BY_ID } from '../data/flavors';
import { computeAverageRating } from '../utils/conveyorLogic';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';
import { CutoutImage } from './CutoutImage';
import { SectionHeading } from './SectionHeading';

export function ReviewsSection() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        setIsInView(entries[0]?.isIntersecting ?? true);
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const averageRating = useMemo(
    () => computeAverageRating(CUSTOMER_REVIEWS.map((r) => r.rating)),
    []
  );

  const row1 = useMemo(
    () => CUSTOMER_REVIEWS.filter((r) => r.row === 1),
    []
  );
  const row2 = useMemo(
    () => CUSTOMER_REVIEWS.filter((r) => r.row === 2),
    []
  );

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="relative py-20 sm:py-28 bg-[#fcecf0] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 mb-12 flex flex-col items-center">
        <SectionHeading
          eyebrow="Community Love"
          outlinedLine="LOVED BY OUR"
          solidLine="REGULARS"
          align="center"
        />

        {/* Average Rating Badge */}
        <div
          className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#f6d5df] px-5 py-2.5 text-sm font-semibold text-[#3d0f1f] shadow-burgundy"
          aria-label={`Average rating ${averageRating.toFixed(1)} out of 5 across ${TOTAL_REVIEW_COUNT} reviews`}
        >
          <span className="inline-flex items-center gap-1 text-[#5a1a2e]">
            <Star className="h-4 w-4 fill-[#f2b544] text-[#f2b544]" />
            <span className="font-bold tabular-nums">{averageRating.toFixed(1)}</span>
          </span>
          <span aria-hidden="true" className="text-[#3d0f1f]/35">
            ·
          </span>
          <span className="tabular-nums">
            {TOTAL_REVIEW_COUNT.toLocaleString()} verified scoop reviews
          </span>
        </div>
      </div>

      {reducedMotion ? (
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CUSTOMER_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Row 1: scrolls left, pauses on hover or offscreen */}
          <div className="marquee-pause-on-hover w-full overflow-hidden py-2">
            <div
              className={`flex w-max gap-5 animate-marquee-left ${
                !isInView ? 'pause-offscreen' : ''
              }`}
            >
              {[...row1, ...row1, ...row1].map((review, idx) => (
                <div key={`${review.id}-r1-${idx}`} className="w-[330px] sm:w-[360px] shrink-0">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: scrolls right, pauses on hover or offscreen */}
          <div className="marquee-pause-on-hover w-full overflow-hidden py-2">
            <div
              className={`flex w-max gap-5 animate-marquee-right ${
                !isInView ? 'pause-offscreen' : ''
              }`}
            >
              {[...row2, ...row2, ...row2].map((review, idx) => (
                <div key={`${review.id}-r2-${idx}`} className="w-[330px] sm:w-[360px] shrink-0">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ReviewCard({ review }: { review: CustomerReview }) {
  const flavor = FLAVOR_BY_ID[review.flavorId];

  return (
    <article className="flex h-full flex-col justify-between rounded-[2rem] bg-[#f6d5df]/55 p-6 shadow-burgundy">
      <div>
        {/* Star Rating */}
        <div
          className="flex items-center gap-1 mb-3"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-[#f2b544] text-[#f2b544]"
              aria-hidden="true"
            />
          ))}
        </div>

        <p className="text-sm leading-relaxed text-[#3d0f1f]/90">
          “{review.quote}”
        </p>
      </div>

      {/* Author + Flavor Chip */}
      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-[#3d0f1f]/10">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-[#3d0f1f]"
            style={{ backgroundColor: flavor?.circleBg ?? '#f3c9d4' }}
            aria-hidden="true"
          >
            {review.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#3d0f1f] truncate">
              {review.name}
            </p>
            <p className="text-xs text-[#5a1a2e]/75 truncate">{review.city}</p>
          </div>
        </div>

        {flavor && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fcecf0] pl-1.5 pr-3 py-1 shrink-0 border border-[#3d0f1f]/10">
            <CutoutImage
              src={flavor.image}
              alt={flavor.shortName}
              accentColor={flavor.swatchColor}
              loading="lazy"
              className="w-6 h-6"
            />
            <span className="text-[11px] font-semibold text-[#3d0f1f] whitespace-nowrap">
              {flavor.shortName}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
