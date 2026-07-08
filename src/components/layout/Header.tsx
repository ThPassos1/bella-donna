import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useUIStore } from "../../hooks/useUIStore";
import { useUserFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../../hooks/useAuth";
import { UserDropdown } from "../auth/UserDropdown";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";
import { withBase } from "../../utils/withBase";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Coleções", href: "#colecoes" },
  { label: "Mais Vendidos", href: "#mais-vendidos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Atendimento", href: "#atendimento" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getItemCount, openCart } = useCart();
  const { searchQuery, setSearchQuery } = useUIStore();
  const { user, isLoggedIn, openLogin } = useAuth();
  const { productIds } = useUserFavorites(user?.id ?? null);
  const location = useLocation();
  const itemCount = getItemCount();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isHome) {
      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = withBase("/#produtos");
    }
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const scrollToProducts = () => {
    if (isHome) {
      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = withBase("/#produtos");
    }
  };

  const navHref = (hash: string) => (isHome ? hash : withBase(`/${hash}`));

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled ? "glass premium-shadow py-3" : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 sm:gap-x-4 lg:gap-x-6">
          <Link to="/" className="flex flex-col shrink-0">
            <span className="font-serif text-xl sm:text-2xl font-semibold text-elegant-black tracking-wide leading-tight">
              Bella Donna
            </span>
            <span className="hidden min-[380px]:block text-[10px] sm:text-xs text-gold tracking-[0.2em] sm:tracking-[0.3em] uppercase leading-tight">
              Elegância & Sofisticação
            </span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-x-4 xl:gap-x-6 min-w-0">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={navHref(link.href)}
                className="whitespace-nowrap text-sm font-medium text-graphite hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-full p-2.5 text-graphite hover:bg-cream-dark hover:text-elegant-black transition-all"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to={isLoggedIn ? "/minha-conta/favoritos" : "#"}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  openLogin();
                }
              }}
              className="relative hidden sm:flex rounded-full p-2.5 text-graphite hover:bg-cream-dark hover:text-elegant-black transition-all"
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5" />
              {productIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">
                  {productIds.length}
                </span>
              )}
            </Link>
            <UserDropdown />
            <button
              onClick={openCart}
              className="relative rounded-full p-2.5 text-graphite hover:bg-cream-dark hover:text-elegant-black transition-all"
              aria-label="Carrinho"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
            <Button
              variant="gold"
              size="sm"
              className={cn(
                "hidden md:inline-flex shrink-0",
                isLoggedIn && "lg:hidden 2xl:inline-flex"
              )}
              onClick={scrollToProducts}
            >
              Comprar agora
            </Button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden rounded-full p-2.5 text-graphite hover:bg-cream-dark"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSearch}
              className="mt-4 overflow-hidden"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome, categoria ou tag..."
                  className="w-full rounded-full border border-elegant-black/10 bg-white py-3 pl-12 pr-4 text-base focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  autoFocus
                />
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden glass border-t border-white/40 mt-3"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={navHref(link.href)}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-graphite hover:bg-cream-dark hover:text-elegant-black transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {isLoggedIn && (
                <>
                  <Link
                    to="/minha-conta"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-base font-medium text-graphite hover:bg-cream-dark hover:text-elegant-black transition-colors"
                  >
                    Minha conta
                  </Link>
                  <Link
                    to="/minha-conta/favoritos"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-base font-medium text-graphite hover:bg-cream-dark hover:text-elegant-black transition-colors"
                  >
                    Favoritos
                  </Link>
                </>
              )}
              <Button
                variant="gold"
                size="md"
                className="mt-2 w-full"
                onClick={() => {
                  setMobileOpen(false);
                  scrollToProducts();
                }}
              >
                Comprar agora
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
