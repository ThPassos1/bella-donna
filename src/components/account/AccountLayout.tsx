import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth, getCustomerInitials } from "../../hooks/useAuth";
import { AccountSidebar, accountMenuItems } from "./AccountSidebar";
import { cn } from "../../utils/cn";

export function AccountLayout() {
  const { isLoggedIn, user, logout, openLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) openLogin();
  }, [isLoggedIn, openLogin]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const initials = user ? getCustomerInitials(user.customer.fullName) : "";

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm text-graphite hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar à loja
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light text-white font-semibold">
              {initials}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold text-elegant-black">
                Minha Conta
              </h1>
              <p className="text-sm text-graphite truncate max-w-[180px] sm:max-w-xs">{user?.customer.fullName}</p>
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto overscroll-x-contain">
          <div className="flex gap-2 pb-2 min-w-max">
            {accountMenuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all",
                    isActive
                      ? "bg-gold text-white shadow-md"
                      : "bg-white text-graphite hover:bg-cream-dark"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <AccountSidebar className="sticky top-28" />
            <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-2"
              >
                <LogOut className="h-5 w-5" />
                Sair da conta
              </button>
          </aside>

          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}
