import React from 'react';
import { Plus } from 'lucide-react';
import { BEST_SELLER_FLAVORS, type Flavor } from '../data/flavors';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/cartLogic';
import { CutoutImage } from './CutoutImage';
import { SectionHeading } from './SectionHeading';

export function BestSellersSection() {
  const { addItem } = useCart();

  const handleAdd = (flavor: Flavor) => {
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
    <section id="best-sellers" className="relative py-20 sm:py-28 bg-[#fcecf0]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-14 flex flex-col items-center">
          <SectionHeading
            eyebrow="Crowd Favorites"
            outlinedLine="BEST"
            solidLine="SELLERS"
            align="center"
          />
          <p className="mt-4 max-w-md text-center text-sm sm:text-base text-[#3d0f1f]/75">
            Our four highest-ordered small-batch cups across the counter this season.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {BEST_SELLER_FLAVORS.map((flavor) => (
            <article
              key={flavor.id}
              data-best-seller-rank={flavor.bestSellerRank}
              className="group relative flex flex-col justify-between rounded-[2rem] bg-[#f6d5df]/50 p-6 shadow-burgundy transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Top line: Rank + Quiet editorial tag */}
              <div className="flex items-baseline justify-between gap-2 mb-3">
                <span className="font-display text-3xl font-extrabold text-[#3d0f1f] tabular-nums">
                  #{flavor.bestSellerRank}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5a1a2e]">
                  {flavor.bestSellerTag}
                </span>
              </div>

              {/* Cup over colored flavor circle */}
              <div className="relative mx-auto my-2 w-44 h-44 flex items-center justify-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-3 rounded-full transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: flavor.circleBg }}
                />
                <CutoutImage
                  src={flavor.image}
                  alt={flavor.name}
                  accentColor={flavor.swatchColor}
                  loading="lazy"
                  className="relative z-10 w-40 h-40 transition-transform duration-300 group-hover:-translate-y-1"
                />
              </div>

              {/* Details + Add to cart */}
              <div className="mt-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#3d0f1f]">
                    {flavor.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#5a1a2e]/80 tabular-nums">
                    {flavor.soldCount.toLocaleString()} cups sold
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-[#3d0f1f]/10">
                  <span className="font-display text-lg font-bold text-[#3d0f1f] tabular-nums">
                    {formatCurrency(flavor.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdd(flavor)}
                    aria-label={`Add ${flavor.name} best seller to cart`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#3d0f1f] px-4 py-2 text-xs font-semibold text-[#fcecf0] hover:bg-[#5a1a2e] active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add to cart</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
