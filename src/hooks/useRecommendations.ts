import { useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { useUserFavorites } from "./useFavorites";
import { useAuth } from "./useAuth";
import { useCustomerOrders } from "./useOrders";
import {
  analyzePreferences,
  getRecommendations,
  type CustomerPreferences,
  type RecommendedProduct,
} from "../utils/getRecommendations";
import type { Product } from "../types/product";

export function useRecommendations() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { productIds } = useUserFavorites(user?.id ?? null);
  const orders = useCustomerOrders(user?.id ?? null, user?.email ?? null);

  const orderProductIds = useMemo(
    () => orders.flatMap((o) => o.items.map((i) => i.productId)),
    [orders]
  );

  const favoriteProducts = useMemo(
    () =>
      productIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => !!p),
    [productIds]
  );

  const preferences = useMemo(
    () => analyzePreferences(productIds, orderProductIds, products),
    [productIds, orderProductIds]
  );

  const recommendations = useMemo(
    () => getRecommendations(productIds, orderProductIds, products, 6),
    [productIds, orderProductIds]
  );

  return {
    favoriteProducts,
    favoriteIds: productIds,
    orderProductIds,
    preferences,
    recommendations,
    hasPersonalizationData: productIds.length > 0 || orderProductIds.length > 0,
  };
}

export type { CustomerPreferences, RecommendedProduct };
