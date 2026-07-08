import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Heart,
  User,
  MapPin,
  CreditCard,
  Tag,
  RefreshCw,
  Headphones,
  Settings,
} from "lucide-react";
import { cn } from "../../utils/cn";

export const accountMenuItems = [
  { to: "/minha-conta", label: "Visão geral", icon: LayoutDashboard, end: true },
  { to: "/minha-conta/pedidos", label: "Meus pedidos", icon: Package },
  { to: "/minha-conta/favoritos", label: "Favoritos", icon: Heart },
  { to: "/minha-conta/dados", label: "Meus dados", icon: User },
  { to: "/minha-conta/enderecos", label: "Endereços", icon: MapPin },
  { to: "/minha-conta/pagamentos", label: "Pagamentos", icon: CreditCard },
  { to: "/minha-conta/cupons", label: "Cupons", icon: Tag },
  { to: "/minha-conta/trocas", label: "Trocas e devoluções", icon: RefreshCw },
  { to: "/minha-conta/atendimento", label: "Atendimento", icon: Headphones },
  { to: "/minha-conta/configuracoes", label: "Configurações", icon: Settings },
];

interface AccountSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function AccountSidebar({ className, onNavigate }: AccountSidebarProps) {
  return (
    <nav className={cn("rounded-2xl bg-white premium-shadow p-3", className)}>
      {accountMenuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all mb-1",
              isActive
                ? "bg-gold/10 text-gold-dark"
                : "text-graphite hover:bg-cream-dark hover:text-elegant-black"
            )
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
