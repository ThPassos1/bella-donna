import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";
import { products as seedProducts } from "../data/products";

const PRODUCTS_KEY = "bd-products";

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    isActive: product.isActive ?? true,
    isFeatured: product.isFeatured ?? !!product.bestsellerRank,
    additionalImages: product.additionalImages ?? [],
    stockByVariant: product.stockByVariant ?? [],
  };
}

function seedCatalog(): Product[] {
  return seedProducts.map(normalizeProduct);
}

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProduct);
      }
    }
  } catch {
    /* use seed */
  }
  const seeded = seedCatalog();
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seeded));
  return seeded;
}

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getActiveProducts: () => Product[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: loadProducts(),

      addProduct: (product) => {
        const products = [...get().products, normalizeProduct(product)];
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        set({ products });
      },

      updateProduct: (id, data) => {
        const products = get().products.map((p) =>
          p.id === id ? normalizeProduct({ ...p, ...data }) : p
        );
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        set({ products });
      },

      deleteProduct: (id) => {
        const products = get().products.filter((p) => p.id !== id);
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        set({ products });
      },

      getProductById: (id) => get().products.find((p) => p.id === id),

      getActiveProducts: () =>
        get().products.filter((p) => p.isActive !== false),
    }),
    {
      name: "bd-products-store",
      partialize: (state) => ({ products: state.products }),
    }
  )
);
