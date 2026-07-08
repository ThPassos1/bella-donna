import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/produtos": "Produtos",
  "/admin/pedidos": "Pedidos",
  "/admin/clientes": "Clientes",
  "/admin/faturamento": "Faturamento",
  "/admin/mais-vendidos": "Mais vendidos",
  "/admin/configuracoes": "Configurações",
};

export function AdminLayout() {
  const { isAuthenticated } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ openLogin: true }} />;
  }

  const title = pageTitles[location.pathname] ?? "Painel Admin";

  return (
    <div className="min-h-screen bg-cream flex">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0">
        <AdminHeader title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
