import React, { useState } from 'react';
import { Check, Copy, ShoppingBag } from 'lucide-react';
import { DIWALI_OFFERS, type DiwaliOffer } from '../data/offers';
import { FLAVOR_BY_ID } from '../data/flavors';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/cartLogic';
import { CutoutImage } from './CutoutImage';
import { SectionHeading } from './SectionHeading';

function DiyaLamp({ delay = '0s' }: { delay?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-11 h-11 sm:w-12 sm:h-12"
      aria-hidden="true"
      fill="none"
    >
      {/* Flame */}
      <g
        className="animate-diya"
        style={{ animationDelay: delay, transformOrigin: '32px 34px' }}
      >
        <path
          d="M32 8 C38 17, 42 24, 38 31 C36 34, 28 34, 26 31 C22 24, 26 17, 32 8 Z"
          fill="#f2b544"
        />
        <path
          d="M32 16 C35 21, 36 25, 34 29 C33 31, 31 31, 30 29 C28 25, 29 21, 32 16 Z"
          fill="#fff5cf"
        />
      </g>
      {/* Clay Diya Bowl */}
      <path
        d="M12 36 C12 48, 22 54, 32 54 C42 54, 52 48, 52 36 C44 40, 20 40, 12 36 Z"
        fill="#a3472a"
        stroke="#f2b544"
        strokeWidth="1.5"
      />
      <ellipse cx="32" cy="36" rx="20" ry="4" fill="#6f2818" />
    </svg>
  );
}

const SPARKLES = [
  { top: '12%', left: '8%', size: 16, delay: '0s' },
  { top: '20%', right: '10%', size: 20, delay: '0.7s' },
  { top: '48%', left: '5%', size: 14, delay: '1.2s' },
  { bottom: '16%', right: '7%', size: 18, delay: '0.4s' },
  { bottom: '10%', left: '16%', size: 14, delay: '1.5s' },
];

export function DiwaliOffersSection() {
  const { addItem, showToast } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      }
    } catch {
      // Clipboard fallback silently handled
    }
    setCopiedCode(code);
    showToast(`Code ${code} copied!`);
    window.setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2200);
  };

  const handleAddBundle = (offer: DiwaliOffer) => {
    const leadFlavor = FLAVOR_BY_ID[offer.flavorIds[0]];
    addItem(
      {
        id: `bundle-${offer.id}`,
        name: offer.bundleItemName,
        price: offer.bundlePrice,
        image: leadFlavor?.image ?? '',
        accentColor: '#f2b544',
        subtitle: `Promo code: ${offer.code}`,
        isBundle: true,
      },
      true
    );
  };

  return (
    <section id="offers" className="relative py-12 sm:py-16 bg-[#fcecf0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#3d0f1f] px-6 py-14 sm:px-10 sm:py-20 text-[#fcecf0] shadow-burgundy-lg">
          {/* Warm Gold Ambient Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-80 w-[680px] rounded-full opacity-30 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, #f2b544 0%, rgba(242,181,68,0) 70%)',
            }}
          />

          {/* Twinkling Gold Sparkles */}
          {SPARKLES.map((sp, i) => (
            <svg
              key={i}
              aria-hidden="true"
              viewBox="0 0 24 24"
              width={sp.size}
              height={sp.size}
              className="pointer-events-none absolute text-[#f2b544] animate-sparkle"
              style={{
                top: sp.top,
                left: sp.left,
                right: sp.right,
                bottom: sp.bottom,
                animationDelay: sp.delay,
              }}
              fill="currentColor"
            >
              <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
            </svg>
          ))}

          {/* Three Flickering Diya Lamps */}
          <div className="relative z-10 mb-6 flex items-center justify-center gap-6 sm:gap-10">
            <DiyaLamp delay="0s" />
            <DiyaLamp delay="0.45s" />
            <DiyaLamp delay="0.9s" />
          </div>

          {/* Heading */}
          <div className="relative z-10 mb-12 flex flex-col items-center">
            <SectionHeading
              eyebrow="Limited Festive Bundles"
              outlinedLine="DIWALI"
              solidLine="OFFERS"
              align="center"
              theme="dark"
            />
            <p className="mt-4 max-w-lg text-center text-sm sm:text-base text-[#fcecf0]/80">
              Share warm spice and cool cream with family. Add any bundle to unlock instant festive pricing.
            </p>
          </div>

          {/* 3 Offer Cards */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
            {DIWALI_OFFERS.map((offer) => {
              const bundleFlavors = offer.flavorIds
                .map((id) => FLAVOR_BY_ID[id])
                .filter(Boolean);
              const isCopied = copiedCode === offer.code;

              return (
                <article
                  key={offer.id}
                  data-offer-id={offer.id}
                  className="flex flex-col justify-between rounded-[2rem] bg-[#5a1a2e]/85 border border-[#f2b544]/25 p-6 sm:p-7 shadow-burgundy"
                >
                  <div>
                    {/* Discount Tag + Price Comparison */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-block rounded-full bg-[#f2b544] px-3.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#3d0f1f]">
                        {offer.discountBadge}
                      </span>
                      <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-xs text-[#fcecf0]/60 line-through">
                          {formatCurrency(offer.originalPrice)}
                        </span>
                        <span className="font-display text-xl font-bold text-[#f2b544]">
                          {formatCurrency(offer.bundlePrice)}
                        </span>
                      </div>
                    </div>

                    {/* Fanned Transparent Cups */}
                    <div className="relative my-6 h-36 flex items-center justify-center">
                      {bundleFlavors.map((flavor, idx) => {
                        const mid = (bundleFlavors.length - 1) / 2;
                        const offset = idx - mid;
                        const rotate = offset * 11;
                        const translateX = offset * 34;
                        const translateY = Math.abs(offset) * 6;
                        return (
                          <div
                            key={`${offer.id}-${flavor.id}`}
                            className="absolute w-28 h-28 sm:w-32 sm:h-32 transition-transform duration-300"
                            style={{
                              transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
                              zIndex: 10 + idx,
                            }}
                          >
                            <CutoutImage
                              src={flavor.image}
                              alt={flavor.name}
                              accentColor={flavor.swatchColor}
                              loading="lazy"
                              className="w-full h-full drop-shadow-lg"
                            />
                          </div>
                        );
                      })}
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[#fcecf0]">
                      {offer.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#fcecf0]/80">
                      {offer.description}
                    </p>
                  </div>

                  {/* Dashed Code Copy Button + Add Bundle to Cart */}
                  <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-[#fcecf0]/15">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(offer.code)}
                      aria-label={`Copy promo code ${offer.code}`}
                      className="flex items-center justify-between rounded-xl border border-dashed border-[#f2b544]/65 bg-[#3d0f1f]/60 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-[#f2b544] hover:bg-[#3d0f1f] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b544]"
                    >
                      <span>{isCopied ? 'COPIED TO CLIPBOARD' : `CODE: ${offer.code}`}</span>
                      {isCopied ? (
                        <Check className="h-4 w-4 text-[#f2b544]" />
                      ) : (
                        <Copy className="h-4 w-4 text-[#f2b544]/85" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBundle(offer)}
                      aria-label={`Add ${offer.title} bundle to cart`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f2b544] px-5 py-3 text-sm font-bold text-[#3d0f1f] hover:bg-[#f6c76d] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fcecf0]"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to cart</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
