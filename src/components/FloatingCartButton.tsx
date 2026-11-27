import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/cartLogic';

export function FloatingCartButton() {
  const { totalCount, subtotal, openCart, isOpen } = useCart();

  if (totalCount === 0 || isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        type="button"
        onClick={(e) => openCart(e.currentTarget)}
        aria-label={`Open shopping cart with ${totalCount} items, subtotal ${formatCurrency(subtotal)}`}
        className="inline-flex items-center gap-3 rounded-full bg-[#3d0f1f] px-5 py-3 text-sm font-semibold text-[#fcecf0] shadow-burgundy-lg border border-[#f2b544]/35 hover:bg-[#5a1a2e] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b544] focus-visible:ring-offset-2"
      >
        <span className="relative inline-flex items-center justify-center">
          <ShoppingBag className="h-4 w-4 text-[#f2b544]" />
          <span
            data-testid="cart-badge-count"
            className="ml-1.5 inline-flex min-w-[22px] h-[22px] items-center justify-center rounded-full bg-[#f2b544] px-1.5 text-xs font-bold text-[#3d0f1f] tabular-nums"
          >
            {totalCount}
          </span>
        </span>
        <span aria-hidden="true" className="text-[#fcecf0]/35">
          ·
        </span>
        <span data-testid="cart-floating-subtotal" className="tabular-nums font-bold">
          {formatCurrency(subtotal)}
        </span>
      </button>
    </div>
  );
}
