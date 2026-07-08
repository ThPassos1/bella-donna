import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ADMIN_CREDENTIALS, type AdminUser } from "../types/admin";

interface AdminAuthStore {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (email, password) => {
        if (
          email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
          password === ADMIN_CREDENTIALS.password
        ) {
          const user: AdminUser = {
            email: ADMIN_CREDENTIALS.email,
            name: "Administradora",
          };
          set({ isAuthenticated: true, user });
          return { success: true };
        }
        return { success: false, error: "E-mail ou senha incorretos." };
      },

      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: "bd-admin-session" }
  )
);

export function useAdminAuth() {
  return useAdminAuthStore();
}

export function isAdminCredentials(email: string, password: string): boolean {
  return (
    email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
    password === ADMIN_CREDENTIALS.password
  );
}
