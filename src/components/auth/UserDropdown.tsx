import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Package,
  Heart,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { useAuth, getCustomerInitials } from "../../hooks/useAuth";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { cn } from "../../utils/cn";

export function UserDropdown() {
  const { user, isLoggedIn, logout, openLogin } = useAuth();
  const { isAuthenticated: isAdmin, user: adminUser, logout: adminLogout } =
    useAdminAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isAdmin && (!isLoggedIn || !user)) {
    return (
      <button
        onClick={openLogin}
        className="rounded-full p-2.5 text-graphite hover:bg-cream-dark hover:text-elegant-black transition-all shrink-0"
        aria-label="Entrar na conta"
      >
        <User className="h-5 w-5" />
      </button>
    );
  }

  if (isAdmin && adminUser) {
    return (
      <div ref={ref} className="relative shrink-0">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 rounded-full p-1 lg:py-1 lg:pl-1 lg:pr-2 xl:py-1.5 xl:pl-1.5 xl:pr-3 hover:bg-cream-dark transition-all"
          aria-label="Menu administrativo"
        >
          <div className="flex h-8 w-8 xl:h-9 xl:w-9 items-center justify-center rounded-full bg-gradient-to-br from-elegant-black to-graphite text-white text-xs xl:text-sm font-semibold shrink-0">
            A
          </div>
          <span className="hidden 2xl:block text-sm font-medium text-elegant-black max-w-[80px] truncate">
            Admin
          </span>
          <ChevronDown
            className={cn(
              "hidden xl:block h-4 w-4 text-graphite transition-transform shrink-0",
              open && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white premium-shadow-lg border border-elegant-black/5 py-2 z-50"
            >
              <div className="px-4 py-3 border-b border-elegant-black/5">
                <p className="font-medium text-elegant-black text-sm truncate">
                  {adminUser.name}
                </p>
                <p className="text-xs text-graphite truncate">{adminUser.email}</p>
                <p className="text-[10px] text-gold uppercase tracking-wider mt-1">
                  Administradora
                </p>
              </div>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-graphite hover:bg-cream-dark hover:text-elegant-black transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-gold" />
                Painel administrativo
              </Link>
              <button
                onClick={() => {
                  adminLogout();
                  setOpen(false);
                  navigate("/");
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const initials = getCustomerInitials(user!.customer.fullName);
  const firstName = user!.customer.fullName.split(" ")[0];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full p-1 lg:py-1 lg:pl-1 lg:pr-2 xl:py-1.5 xl:pl-1.5 xl:pr-3 hover:bg-cream-dark transition-all"
        aria-label="Menu da conta"
      >
        <div className="flex h-8 w-8 xl:h-9 xl:w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light text-white text-xs xl:text-sm font-semibold shrink-0">
          {initials}
        </div>
        <span className="hidden 2xl:block text-sm font-medium text-elegant-black max-w-[80px] truncate">
          {firstName}
        </span>
        <ChevronDown
          className={cn(
            "hidden xl:block h-4 w-4 text-graphite transition-transform shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white premium-shadow-lg border border-elegant-black/5 py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-elegant-black/5">
              <p className="font-medium text-elegant-black text-sm truncate">
                {user!.customer.fullName}
              </p>
              <p className="text-xs text-graphite truncate">{user!.email}</p>
            </div>
            <Link
              to="/minha-conta"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-graphite hover:bg-cream-dark hover:text-elegant-black transition-colors"
            >
              <User className="h-4 w-4 text-gold" />
              Minha conta
            </Link>
            <Link
              to="/minha-conta/pedidos"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-graphite hover:bg-cream-dark hover:text-elegant-black transition-colors"
            >
              <Package className="h-4 w-4 text-gold" />
              Meus pedidos
            </Link>
            <Link
              to="/minha-conta/favoritos"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-graphite hover:bg-cream-dark hover:text-elegant-black transition-colors"
            >
              <Heart className="h-4 w-4 text-gold" />
              Favoritos
            </Link>
            <button
              onClick={() => {
                logout();
                setOpen(false);
                navigate("/");
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
