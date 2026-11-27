export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  accentColor: string;
  subtitle?: string;
  isBundle?: boolean;
}

export interface CartTotals {
  totalCount: number;
  subtotal: number;
}

export const CART_STORAGE_KEY = 'swirl_creamery_cart_v1';

export function addToCartState(
  items: CartItem[],
  product: Omit<CartItem, 'quantity'>,
  quantityToAdd = 1
): CartItem[] {
  if (quantityToAdd <= 0) return items;
  const existingIndex = items.findIndex((item) => item.id === product.id);
  if (existingIndex === -1) {
    return [...items, { ...product, quantity: quantityToAdd }];
  }
  return items.map((item, idx) =>
    idx === existingIndex
      ? { ...item, quantity: item.quantity + quantityToAdd }
      : item
  );
}

export function setItemQuantityState(
  items: CartItem[],
  itemId: string,
  nextQuantity: number
): CartItem[] {
  if (nextQuantity <= 0) {
    return items.filter((item) => item.id !== itemId);
  }
  return items.map((item) =>
    item.id === itemId ? { ...item, quantity: Math.floor(nextQuantity) } : item
  );
}

export function clearCartState(): CartItem[] {
  return [];
}

export function getCartTotals(items: CartItem[]): CartTotals {
  return items.reduce<CartTotals>(
    (acc, item) => ({
      totalCount: acc.totalCount + item.quantity,
      subtotal: Math.round((acc.subtotal + item.price * item.quantity) * 100) / 100,
    }),
    { totalCount: 0, subtotal: 0 }
  );
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function safeParseCartStorage(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        Number.isFinite(item.price) &&
        typeof item.quantity === 'number' &&
        item.quantity > 0 &&
        typeof item.image === 'string' &&
        typeof item.accentColor === 'string'
    );
  } catch {
    return [];
  }
}
