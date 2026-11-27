import React, { useEffect, useRef } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/cartLogic';
import { CutoutImage } from './CutoutImage';

export function CartDrawer() {
  const {
    items,
    subtotal,
    totalCount,
    isOpen,
    closeCart,
    setQuantity,
    clearCart,
    checkout,
  } = useCart();

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Focus management & Escape key handling
  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCart();
        return;
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#3d0f1f]/45 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#fcecf0] text-[#3d0f1f] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3d0f1f]/10 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#5a1a2e]" />
            <h2 className="font-display text-2xl font-bold text-[#3d0f1f]">
              Your Swirl Bag
            </h2>
            <span className="text-xs font-semibold text-[#5a1a2e] tabular-nums">
              ({totalCount})
            </span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={closeCart}
            aria-label="Close shopping cart"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f6d5df] text-[#3d0f1f] hover:bg-[#f3c9d4] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Line Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="h-16 w-16 rounded-full bg-[#f6d5df] flex items-center justify-center mb-4">
                <ShoppingBag className="h-7 w-7 text-[#5a1a2e]" />
              </div>
              <p className="font-display text-xl font-bold text-[#3d0f1f]">
                Your bag is empty
              </p>
              <p className="mt-1.5 text-sm text-[#3d0f1f]/70 max-w-xs">
                Pick a small-batch cup or Diwali bundle to start swirling.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  data-cart-item={item.id}
                  className="flex items-center gap-4 rounded-[1.5rem] bg-[#f6d5df]/55 p-4"
                >
                  <div
                    className="h-16 w-16 shrink-0 rounded-2xl p-1 flex items-center justify-center"
                    style={{ backgroundColor: '#fcecf0' }}
                  >
                    <CutoutImage
                      src={item.image}
                      alt={item.name}
                      accentColor={item.accentColor}
                      className="w-14 h-14"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-bold text-[#3d0f1f] truncate">
                      {item.name}
                    </h3>
                    {item.subtitle && (
                      <p className="text-[11px] text-[#5a1a2e]/80 truncate">
                        {item.subtitle}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-[#3d0f1f] tabular-nums">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Stepper Controls */}
                  <div className="flex items-center gap-1.5 rounded-full bg-[#fcecf0] p-1 border border-[#3d0f1f]/10 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#3d0f1f] hover:bg-[#f6d5df] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e]"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span
                      data-testid={`qty-${item.id}`}
                      className="min-w-[20px] text-center text-xs font-bold text-[#3d0f1f] tabular-nums"
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#3d0f1f] hover:bg-[#f6d5df] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Totals & Actions */}
        {items.length > 0 && (
          <div className="border-t border-[#3d0f1f]/10 bg-[#f6d5df]/40 px-6 py-5">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-sm font-medium text-[#5a1a2e]">Subtotal</span>
              <span
                data-testid="drawer-subtotal"
                className="font-display text-2xl font-bold text-[#3d0f1f] tabular-nums"
              >
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearCart}
                aria-label="Clear cart"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#3d0f1f]/20 px-4 py-3 text-xs font-semibold text-[#3d0f1f] hover:bg-[#f3c9d4] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>

              <button
                type="button"
                onClick={checkout}
                className="flex-1 rounded-full bg-[#3d0f1f] px-6 py-3.5 text-sm font-semibold text-[#fcecf0] hover:bg-[#5a1a2e] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a1a2e]"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
