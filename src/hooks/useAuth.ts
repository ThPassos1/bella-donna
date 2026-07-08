import { useAuthStore } from "../stores/authStore";

export function getCustomerInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export { useAuthStore };

export function useAuth() {
  const store = useAuthStore();
  return {
    ...store,
    user: store.getCurrentUser(),
    isLoggedIn: !!store.sessionUserId,
    firstName: store.getCurrentUser()?.customer.fullName.split(" ")[0] ?? "",
  };
}
