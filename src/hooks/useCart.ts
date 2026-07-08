import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

import { useSettingsStore } from "../stores/settingsStore";

const DISCOUNT_THRESHOLD = 300;

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: (deliveryMethod?: "delivery" | "pickup") => number;
  getTotal: (deliveryMethod?: "delivery" | "pickup") => number;
}

function makeCartItemId(productId: string, size: string, color: string) {
  return `${productId}-${size}-${color}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, size, color, quantity = 1) => {
        const id = makeCartItemId(product.id, size, color);
        set((state) => {
          const existing = state.items.find((item) => item.id === id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { id, product, size, color, quantity },
            ],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= DISCOUNT_THRESHOLD ? subtotal * 0.05 : 0;
      },

      getShipping: (deliveryMethod = "delivery") => {
        if (deliveryMethod === "pickup") return 0;
        const settings = useSettingsStore.getState().settings;
        return get().items.length > 0 ? settings.fixedShipping : 0;
      },

      getTotal: (deliveryMethod = "delivery") => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping(deliveryMethod);
        return subtotal - discount + shipping;
      },
    }),
    {
      name: "bd-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function useCart() {
  return useCartStore();
}
