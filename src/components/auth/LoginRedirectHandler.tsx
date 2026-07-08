import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

/** Abre o modal de login quando redirecionado (ex.: área admin sem sessão). */
export function LoginRedirectHandler() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { openLogin?: boolean } | null;
    if (state?.openLogin) {
      useAuthStore.getState().openLogin();
      window.history.replaceState({}, document.title, location.pathname + location.hash);
    }
  }, [location]);

  return null;
}
