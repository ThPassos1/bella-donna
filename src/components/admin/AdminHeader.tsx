import { Menu, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const { user } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-elegant-black/5 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden rounded-xl p-2.5 hover:bg-cream-dark text-graphite"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold text-elegant-black">
              {title}
            </h1>
            <p className="text-xs text-graphite hidden sm:block">
              Gerencie sua loja com facilidade
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-sm text-gold hover:underline"
          >
            <Store className="h-4 w-4" />
            Ver loja
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-cream-dark px-3 sm:px-4 py-2 min-w-0 max-w-[50vw] sm:max-w-none">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold to-gold-light text-white flex items-center justify-center text-sm font-semibold">
              {user?.name?.[0] ?? "A"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-elegant-black">{user?.name}</p>
              <p className="text-xs text-graphite">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
