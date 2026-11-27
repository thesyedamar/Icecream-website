import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addToCartState,
  CART_STORAGE_KEY,
  clearCartState,
  getCartTotals,
  safeParseCartStorage,
  setItemQuantityState,
  type CartItem,
} from '../utils/cartLogic';

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isOpen: boolean;
  toastMessage: string | null;
  openCart: (opener?: HTMLElement | null) => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>, openAfterAdd?: boolean) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => void;
  showToast: (message: string) => void;
  lastOpenerRef: React.MutableRefObject<HTMLElement | null>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    return safeParseCartStorage(window.localStorage.getItem(CART_STORAGE_KEY));
  });
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const lastOpenerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const openCart = useCallback((opener?: HTMLElement | null) => {
    if (opener) {
      lastOpenerRef.current = opener;
    } else if (document.activeElement instanceof HTMLElement) {
      lastOpenerRef.current = document.activeElement;
    }
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      lastOpenerRef.current?.focus();
    });
  }, []);

  const addItem = useCallback(
    (product: Omit<CartItem, 'quantity'>, openAfterAdd = false) => {
      setItems((prev) => addToCartState(prev, product, 1));
      if (openAfterAdd) {
        if (document.activeElement instanceof HTMLElement) {
          lastOpenerRef.current = document.activeElement;
        }
        setIsOpen(true);
      } else {
        showToast(`${product.name} added to cart`);
      }
    },
    [showToast]
  );

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((prev) => setItemQuantityState(prev, itemId, quantity));
  }, []);

  const clearCart = useCallback(() => {
    setItems(clearCartState());
  }, []);

  const checkout = useCallback(() => {
    setItems(clearCartState());
    setIsOpen(false);
    showToast('Order placed!');
    requestAnimationFrame(() => {
      lastOpenerRef.current?.focus();
    });
  }, [showToast]);

  const totals = useMemo(() => getCartTotals(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalCount: totals.totalCount,
      subtotal: totals.subtotal,
      isOpen,
      toastMessage,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      clearCart,
      checkout,
      showToast,
      lastOpenerRef,
    }),
    [
      items,
      totals.totalCount,
      totals.subtotal,
      isOpen,
      toastMessage,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      clearCart,
      checkout,
      showToast,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
