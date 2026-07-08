import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "../components/admin/AdminLayout";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { AdminProducts } from "../components/admin/AdminProducts";
import { AdminOrders } from "../components/admin/AdminOrders";
import { AdminCustomers } from "../components/admin/AdminCustomers";
import { AdminRevenue } from "../components/admin/AdminRevenue";
import { AdminBestSellers } from "../components/admin/AdminBestSellers";
import { AdminSettings } from "../components/admin/AdminSettings";
import { useAdminAuth } from "../hooks/useAdminAuth";

function AdminLoginRoute() {
  const { isAuthenticated } = useAdminAuth();
  if (isAuthenticated) return <Navigate to="/admin" replace />;
  return <Navigate to="/" replace state={{ openLogin: true }} />;
}

export function AdminPage() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginRoute />} />
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="produtos" element={<AdminProducts />} />
        <Route path="pedidos" element={<AdminOrders />} />
        <Route path="clientes" element={<AdminCustomers />} />
        <Route path="faturamento" element={<AdminRevenue />} />
        <Route path="mais-vendidos" element={<AdminBestSellers />} />
        <Route path="configuracoes" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
