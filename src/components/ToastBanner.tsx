import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function ToastBanner() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="toast-banner"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] inline-flex items-center gap-2.5 rounded-full bg-[#3d0f1f] px-5 py-3 text-sm font-semibold text-[#fcecf0] shadow-burgundy-lg border border-[#f2b544]/40"
    >
      <CheckCircle2 className="h-4 w-4 text-[#f2b544] shrink-0" />
      <span className="whitespace-nowrap">{toastMessage}</span>
    </div>
  );
}
