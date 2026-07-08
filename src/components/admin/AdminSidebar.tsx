import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { cn } from "../../utils/cn";

export const adminMenuItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/faturamento", label: "Faturamento", icon: DollarSign },
  { to: "/admin/mais-vendidos", label: "Mais vendidos", icon: TrendingUp },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const content = (
    <>
      <div className="px-5 py-6 border-b border-elegant-black/5">
        <p className="font-serif text-xl font-semibold text-elegant-black">Bella Donna</p>
        <p className="text-xs text-gold tracking-widest uppercase mt-1">Painel Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminMenuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-all",
                isActive
                  ? "bg-gold text-white shadow-md"
                  : "text-graphite hover:bg-cream-dark hover:text-elegant-black"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-elegant-black/5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-elegant-black/5 min-h-screen sticky top-0">
        {content}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl">
            <button
              onClick={onClose}
              className="absolute right-4 top-5 p-2 rounded-full hover:bg-cream-dark"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
