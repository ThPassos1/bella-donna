import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoUser } from "../data/demoCustomer";

const GUEST_KEY = "guest";
const DEMO_FAVORITES = ["1", "2", "6", "10"];
const EMPTY_FAVORITES: string[] = [];

interface FavoritesStore {
  byUser: Record<string, string[]>;
  getProductIds: (userId: string | null) => string[];
  toggleFavorite: (userId: string | null, productId: string) => void;
  isFavorite: (userId: string | null, productId: string) => boolean;
  removeFavorite: (userId: string | null, productId: string) => void;
  setFavorites: (userId: string, productIds: string[]) => void;
  ensureDemoFavorites: (userId: string) => void;
}

function storageKey(userId: string | null) {
  return userId ?? GUEST_KEY;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      byUser: {},

      getProductIds: (userId) => get().byUser?.[storageKey(userId)] ?? [],

      toggleFavorite: (userId, productId) => {
        const key = storageKey(userId);
        const byUser = get().byUser ?? {};
        const current = byUser[key] ?? [];
        const updated = current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId];
        set({ byUser: { ...byUser, [key]: updated } });
      },

      isFavorite: (userId, productId) => {
        const ids = get().byUser?.[storageKey(userId)] ?? [];
        return ids.includes(productId);
      },

      removeFavorite: (userId, productId) => {
        const key = storageKey(userId);
        const byUser = get().byUser ?? {};
        const current = byUser[key] ?? [];
        set({
          byUser: {
            ...byUser,
            [key]: current.filter((id) => id !== productId),
          },
        });
      },

      setFavorites: (userId, productIds) => {
        const byUser = get().byUser ?? {};
        set({ byUser: { ...byUser, [userId]: productIds } });
      },

      ensureDemoFavorites: (userId) => {
        if (userId !== demoUser.id) return;
        const byUser = get().byUser ?? {};
        const current = byUser[userId] ?? [];
        if (current.length === 0) {
          set({ byUser: { ...byUser, [userId]: DEMO_FAVORITES } });
        }
      },
    }),
    {
      name: "bd-favorites-v2",
      migrate: (persisted: unknown) => {
        if (!persisted || typeof persisted !== "object") {
          return { byUser: {} };
        }
        const state = persisted as { byUser?: Record<string, string[]>; productIds?: string[] };
        if (state.byUser && typeof state.byUser === "object") return { byUser: state.byUser };
        if (Array.isArray(state.productIds) && state.productIds.length) {
          return { byUser: { [GUEST_KEY]: state.productIds } };
        }
        return { byUser: {} };
      },
      version: 2,
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as object),
        byUser: (persisted as { byUser?: Record<string, string[]> })?.byUser ?? {},
      }),
    }
  )
);

export function useFavorites() {
  const store = useFavoritesStore();
  return store;
}

export function useUserFavorites(userId: string | null) {
  const productIds = useFavoritesStore(
    (s) => s.byUser?.[storageKey(userId)] ?? EMPTY_FAVORITES
  );
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);

  return {
    productIds,
    toggleFavorite: (productId: string) => toggleFavorite(userId, productId),
    isFavorite: (productId: string) => isFavorite(userId, productId),
    removeFavorite: (productId: string) => removeFavorite(userId, productId),
  };
}
