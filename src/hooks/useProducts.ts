import { useMemo } from "react";
import { useProductStore } from "../stores/productStore";
import type { Product } from "../types/product";

export function useProducts() {
  const products = useProductStore((s) => s.products);

  const activeProducts = useMemo(
    () => products.filter((p) => p.isActive !== false),
    [products]
  );

  const bestSellers = useMemo(
    () =>
      activeProducts
        .filter((p) => p.bestsellerRank || p.tag === "Mais vendido")
        .sort((a, b) => (a.bestsellerRank ?? 99) - (b.bestsellerRank ?? 99))
        .slice(0, 6),
    [activeProducts]
  );

  const featuredProducts = useMemo(
    () =>
      activeProducts.filter(
        (p) => p.isFeatured || p.bestsellerRank || p.isNew
      ).length > 0
        ? activeProducts
        : activeProducts,
    [activeProducts]
  );

  const getProductById = (id: string) =>
    useProductStore.getState().getProductById(id);

  return {
    products: activeProducts,
    allProducts: products,
    bestSellers,
    featuredProducts,
    getProductById,
  };
}

export function useProductCatalog(): Product[] {
  return useProductStore((s) => s.products.filter((p) => p.isActive !== false));
}
