import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoreSettings } from "../types/admin";
import { defaultStoreSettings } from "../data/storeDefaults";

interface SettingsStore {
  settings: StoreSettings;
  updateSettings: (data: Partial<StoreSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultStoreSettings,

      updateSettings: (data) =>
        set((state) => ({
          settings: { ...state.settings, ...data },
        })),

      resetSettings: () => set({ settings: defaultStoreSettings }),
    }),
    { name: "bd-store-settings" }
  )
);
