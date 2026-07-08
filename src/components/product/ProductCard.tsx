import { Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import type { Product } from "../../types/product";
import { useUIStore } from "../../hooks/useUIStore";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useUserFavorites } from "../../hooks/useFavorites";
import { cn } from "../../utils/cn";
import { assetUrl } from "../../utils/withBase";

interface ProductCardProps {
  product: Product;
  index?: number;
}

function getBadgeVariant(tag: string): "gold" | "new" | "default" | "sale" {
  switch (tag) {
    case "Mais vendido":
      return "gold";
    case "Novidade":
      return "new";
    case "Elegante":
      return "default";
    default:
      return "default";
  }
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { openProductModal } = useUIStore();
  const { addItem, openCart } = useCart();
  const { user, openLogin } = useAuth();
  const { isFavorite, toggleFavorite } = useUserFavorites(user?.id ?? null);
  const favorited = isFavorite(product.id);

  const handleFavorite = () => {
    if (!user) {
      openLogin();
      return;
    }
    toggleFavorite(product.id);
  };

  const handleAddToCart = () => {
    addItem(product, product.sizes[0], product.colors[0]);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product, product.sizes[0], product.colors[0]);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group rounded-2xl bg-white premium-shadow hover:premium-shadow-lg transition-all duration-500 overflow-hidden"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={assetUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={getBadgeVariant(product.tag)}>{product.tag}</Badge>
        </div>
        {product.oldPrice && (
          <div className="absolute top-3 right-3">
            <Badge variant="sale">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </Badge>
          </div>
        )}
        <button
          onClick={handleFavorite}
          className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2.5 shadow-md hover:scale-110 transition-transform"
          aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              favorited ? "fill-red-400 text-red-400" : "text-graphite"
            )}
          />
        </button>
      </div>

      <div className="p-5">
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-lg font-semibold text-elegant-black mb-2 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.floor(product.rating)
                  ? "fill-gold text-gold"
                  : "text-gray-200"
              }`}
            />
          ))}
          <span className="text-xs text-graphite ml-1">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-serif text-xl font-semibold text-elegant-black">
            {formatCurrency(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-graphite line-through">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => openProductModal(product)}
          >
            Ver detalhes
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={handleAddToCart}>
              Adicionar
            </Button>
            <Button variant="gold" size="sm" onClick={handleBuyNow}>
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
