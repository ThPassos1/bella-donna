import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useUserFavorites } from "../../hooks/useFavorites";
import { useRecommendations } from "../../hooks/useRecommendations";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../ui/Button";
import { useCart } from "../../hooks/useCart";
import { useUIStore } from "../../hooks/useUIStore";

interface FavoritesPreviewProps {
  limit?: number;
  showTitle?: boolean;
}

export function FavoritesPreview({ limit = 4, showTitle = true }: FavoritesPreviewProps) {
  const { user } = useAuth();
  const { removeFavorite } = useUserFavorites(user?.id ?? null);
  const { favoriteProducts } = useRecommendations();
  const { addItem, openCart } = useCart();
  const { openProductModal } = useUIStore();

  const items = favoriteProducts.slice(0, limit);

  if (favoriteProducts.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 premium-shadow text-center">
        {showTitle && (
          <h3 className="font-serif text-xl font-semibold text-elegant-black mb-2">
            Seus favoritos
          </h3>
        )}
        <Heart className="h-12 w-12 text-gold/30 mx-auto mb-3" />
        <p className="text-graphite mb-4">
          Clique no coração nos produtos para salvá-los aqui.
        </p>
        <Link to={{ pathname: "/", hash: "produtos" }}>
          <Button variant="outline" size="md">
            Ver produtos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 premium-shadow">
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-gold fill-gold" />
            <h3 className="font-serif text-xl font-semibold text-elegant-black">
              Seus favoritos
            </h3>
            <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold">
              {favoriteProducts.length}
            </span>
          </div>
          <Link
            to="/minha-conta/favoritos"
            className="flex items-center gap-1 text-sm text-gold font-medium hover:underline"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group rounded-xl border border-elegant-black/5 overflow-hidden hover:premium-shadow transition-all"
          >
            <div className="relative aspect-[3/4]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => removeFavorite(product.id)}
                className="absolute top-2 right-2 rounded-full bg-white/90 p-2 shadow-md"
                aria-label="Remover dos favoritos"
              >
                <Heart className="h-4 w-4 fill-red-400 text-red-400" />
              </button>
            </div>
            <div className="p-4">
              <p className="font-medium text-sm text-elegant-black line-clamp-1">
                {product.name}
              </p>
              <p className="font-serif font-semibold text-elegant-black mb-3">
                {formatCurrency(product.price)}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => openProductModal(product)}
                >
                  Ver
                </Button>
                <Button
                  variant="gold"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    addItem(product, product.sizes[0], product.colors[0]);
                    openCart();
                  }}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Comprar
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
