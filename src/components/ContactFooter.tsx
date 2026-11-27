import React from 'react';
import { ArrowUpRight, Instagram, Mail, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BrandLogo } from './BrandLogo';
import { SectionHeading } from './SectionHeading';

interface ContactFooterProps {
  onNavigate: (sectionId: string) => void;
}

export function ContactFooter({ onNavigate }: ContactFooterProps) {
  const { showToast } = useCart();

  const handleEmailClick = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText('hello@swirlcreamery.com');
      }
    } catch {
      // Ignore clipboard failure
    }
    showToast('Email hello@swirlcreamery.com copied!');
  };

  return (
    <footer id="contact" className="relative pt-8 pb-12 bg-[#fcecf0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] bg-[#3d0f1f] px-6 py-14 sm:px-12 sm:py-16 text-[#fcecf0] shadow-burgundy-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-start lg:items-end justify-between gap-10 pb-12 border-b border-[#fcecf0]/15">
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow="Say Hello Or Book Catering"
                outlinedLine="GOT A"
                solidLine="CRAVING?"
                align="left"
                theme="dark"
              />
              <p className="mt-4 max-w-md text-sm sm:text-base text-[#fcecf0]/80 leading-relaxed">
                Questions about custom Diwali gift boxes, allergen notes, or neighborhood scoop pop-ups? Drop our kitchen a note anytime.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-4">
              <button
                type="button"
                onClick={handleEmailClick}
                aria-label="Copy email address hello@swirlcreamery.com"
                className="inline-flex items-center gap-3 rounded-full bg-[#fcecf0] px-6 py-3.5 text-sm font-semibold text-[#3d0f1f] hover:bg-[#f3c9d4] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b544]"
              >
                <Mail className="h-4 w-4 text-[#5a1a2e]" />
                <span>hello@swirlcreamery.com</span>
              </button>

              <a
                href="#offers"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('offers');
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#f2b544] hover:text-[#fcecf0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b544] rounded-md px-1 py-0.5"
              >
                <span>Explore Diwali offers</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Copyright & Social Links Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <BrandLogo variant="light" size="sm" />

            <p className="text-xs text-[#fcecf0]/65">
              © {new Date().getFullYear()} Swirl Creamery. Small-batch ice cream, just the way you like it.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('hero');
                }}
                aria-label="Swirl Creamery on Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#fcecf0]/20 text-[#fcecf0] hover:bg-[#fcecf0] hover:text-[#3d0f1f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b544]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#flavors"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('flavors');
                }}
                aria-label="Share Swirl Creamery"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#fcecf0]/20 text-[#fcecf0] hover:bg-[#fcecf0] hover:text-[#3d0f1f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b544]"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
