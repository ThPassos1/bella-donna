import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Info } from "lucide-react";
import { useRecommendations } from "../../hooks/useRecommendations";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../ui/Button";
import { useCart } from "../../hooks/useCart";
import { useUIStore } from "../../hooks/useUIStore";
import { assetUrl } from "../../utils/withBase";

interface RecommendedForYouProps {
  compact?: boolean;
}

export function RecommendedForYou({ compact = false }: RecommendedForYouProps) {
  const { recommendations, preferences, hasPersonalizationData } =
    useRecommendations();
  const { addItem, openCart } = useCart();
  const { openProductModal } = useUIStore();

  if (recommendations.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white p-6 premium-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <h3 className="font-serif text-xl font-semibold text-elegant-black">
              Recomendado para você
            </h3>
          </div>
          {hasPersonalizationData ? (
            <p className="text-sm text-graphite">
              Analisamos seus favoritos e compras para sugerir peças do seu
              estilo:{" "}
              <span className="font-medium text-gold-dark">
                {preferences.styleLabel}
              </span>
            </p>
          ) : (
            <p className="text-sm text-graphite">
              Confira os destaques selecionados para você.
            </p>
          )}
        </div>

        {hasPersonalizationData && !compact && (
          <div className="rounded-xl bg-champagne/60 border border-gold/20 px-4 py-3 text-sm shrink-0">
            <div className="flex items-center gap-2 text-gold-dark font-medium mb-2">
              <Info className="h-4 w-4" />
              Seu perfil de estilo
            </div>
            {preferences.topCategories.length > 0 && (
              <p className="text-graphite text-xs mb-1">
                <strong>Categorias:</strong>{" "}
                {preferences.topCategories.map((c) => c.name).join(", ")}
              </p>
            )}
            {preferences.topTags.length > 0 && (
              <p className="text-graphite text-xs">
                <strong>Preferências:</strong>{" "}
                {preferences.topTags.map((t) => t.name).join(", ")}
              </p>
            )}
          </div>
        )}
      </div>

      <div
        className={`grid gap-4 ${
          compact
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {recommendations.slice(0, compact ? 3 : 6).map((item, index) => (
          <motion.div
            key={item.product.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-xl border border-elegant-black/5 overflow-hidden hover:border-gold/30 hover:premium-shadow transition-all group"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={assetUrl(item.product.image)}
                alt={item.product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-semibold text-white uppercase tracking-wide">
                Para você
              </span>
            </div>
            <div className="p-4">
              <p className="text-xs text-graphite italic mb-2 line-clamp-2">
                {item.reason}
              </p>
              <p className="font-medium text-sm text-elegant-black line-clamp-1">
                {item.product.name}
              </p>
              <p className="text-gold font-semibold mt-1 mb-3">
                {formatCurrency(item.product.price)}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => openProductModal(item.product)}
                >
                  Detalhes
                </Button>
                <Button
                  variant="gold"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    addItem(
                      item.product,
                      item.product.sizes[0],
                      item.product.colors[0]
                    );
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
