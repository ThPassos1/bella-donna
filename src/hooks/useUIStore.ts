import { create } from "zustand";
import type { Product } from "../types/product";
import type { Order } from "../types/checkout";

interface UIStore {
  selectedProduct: Product | null;
  isProductModalOpen: boolean;
  isCheckoutOpen: boolean;
  isOrderSuccessOpen: boolean;
  isOrderStatusOpen: boolean;
  currentOrder: Order | null;
  searchQuery: string;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openOrderSuccess: (order: Order) => void;
  closeOrderSuccess: () => void;
  openOrderStatus: () => void;
  closeOrderStatus: () => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedProduct: null,
  isProductModalOpen: false,
  isCheckoutOpen: false,
  isOrderSuccessOpen: false,
  isOrderStatusOpen: false,
  currentOrder: null,
  searchQuery: "",

  openProductModal: (product) =>
    set({ selectedProduct: product, isProductModalOpen: true }),
  closeProductModal: () =>
    set({ selectedProduct: null, isProductModalOpen: false }),

  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  openOrderSuccess: (order) =>
    set({ currentOrder: order, isOrderSuccessOpen: true, isCheckoutOpen: false }),
  closeOrderSuccess: () =>
    set({ isOrderSuccessOpen: false }),

  openOrderStatus: () => set({ isOrderStatusOpen: true }),
  closeOrderStatus: () => set({ isOrderStatusOpen: false }),

  setSearchQuery: (query) => set({ searchQuery: query }),
}));
