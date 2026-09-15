import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, DeliveryDetails } from '../types/cart';

interface CartState {
  items: CartItem[];
  deliveryDetails: DeliveryDetails | null;
  couponCode: string | null;
  discountAmount: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  toggleCart: (open?: boolean) => void;
  getSubtotal: () => number;
  getTotalCount: () => number;
  getEstimatedTax: () => number;
  getDeliveryFee: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryDetails: null,
      couponCode: null,
      discountAmount: 0,
      isOpen: false,

      addItem: (itemData) => {
        const id = `${itemData.productId}-${itemData.flavour}-${itemData.weight}-${itemData.isEggless ? 'eggless' : 'regular'}`;
        const existing = get().items.find((i) => i.id === id);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + (itemData.quantity || 1) } : i
            ),
          });
        } else {
          set({
            items: [...get().items, { ...itemData, id, quantity: itemData.quantity || 1 }],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        });
      },

      clearCart: () => set({ items: [], couponCode: null, discountAmount: 0 }),

      setDeliveryDetails: (details) => set({ deliveryDetails: details }),

      applyCoupon: (code, discount) => set({ couponCode: code, discountAmount: discount }),

      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),

      toggleCart: (open) => set((state) => ({ isOpen: open !== undefined ? open : !state.isOpen })),

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const itemBase = item.price * item.quantity;
          const addonsBase = (item.selectedAddons || []).reduce((acc, a) => acc + a.price, 0) * item.quantity;
          return total + itemBase + addonsBase;
        }, 0);
      },

      getTotalCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getEstimatedTax: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * 0.05); // 5% GST
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= 999) return 0;
        return 99;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getEstimatedTax();
        const delivery = get().getDeliveryFee();
        const discount = get().discountAmount;
        return Math.max(0, subtotal + tax + delivery - discount);
      },
    }),
    {
      name: 'letoile_bakery_cart_v1',
    }
  )
);
