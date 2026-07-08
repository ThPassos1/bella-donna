import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { LoginRedirectHandler } from "./components/auth/LoginRedirectHandler";
import { Header } from "./components/layout/Header";
import { HomePage } from "./pages/HomePage";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { useAuthStore } from "./stores/authStore";
import { ensureUserSessionData } from "./utils/ensureUserSession";

function App() {
  const sessionUserId = useAuthStore((s) => s.sessionUserId);

  useEffect(() => {
    useAuthStore.getState().seedDemoIfNeeded();
  }, []);

  useEffect(() => {
    if (sessionUserId) {
      ensureUserSessionData(sessionUserId);
    }
  }, [sessionUserId]);

  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

  return (
    <BrowserRouter basename={basename}>
      <LoginRedirectHandler />
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-cream">
              <Header />
              <HomePage />
            </div>
          }
        />
        <Route
          path="/minha-conta/*"
          element={
            <div className="min-h-screen bg-cream">
              <AccountPage />
            </div>
          }
        />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
