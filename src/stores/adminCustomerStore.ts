import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminCustomerMeta } from "../types/admin";

interface AdminCustomerStore {
  meta: Record<string, AdminCustomerMeta>;
  getMeta: (userId: string) => AdminCustomerMeta;
  updateMeta: (userId: string, data: Partial<AdminCustomerMeta>) => void;
}

const defaultMeta = (userId: string): AdminCustomerMeta => ({
  userId,
  isActive: true,
  internalNotes: "",
});

export const useAdminCustomerStore = create<AdminCustomerStore>()(
  persist(
    (set, get) => ({
      meta: {},

      getMeta: (userId) => get().meta[userId] ?? defaultMeta(userId),

      updateMeta: (userId, data) =>
        set((state) => ({
          meta: {
            ...state.meta,
            [userId]: { ...defaultMeta(userId), ...state.meta[userId], ...data, userId },
          },
        })),
    }),
    { name: "bd-admin-customers" }
  )
);
