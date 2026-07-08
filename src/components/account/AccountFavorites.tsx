import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useUserFavorites } from "../../hooks/useFavorites";
import { useRecommendations } from "../../hooks/useRecommendations";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../ui/Button";
import { useCart } from "../../hooks/useCart";
import { useUIStore } from "../../hooks/useUIStore";
import { RecommendedForYou } from "./RecommendedForYou";
import { assetUrl } from "../../utils/withBase";

export function AccountFavorites() {
  const { user } = useAuth();
  const { productIds, removeFavorite } = useUserFavorites(user?.id ?? null);
  const { favoriteProducts } = useRecommendations();
  const { addItem, openCart } = useCart();
  const { openProductModal } = useUIStore();

  if (productIds.length === 0) {
    return (
      <div className="space-y-8">
        <h2 className="font-serif text-2xl font-semibold text-elegant-black">
          Favoritos
        </h2>
        <div className="rounded-2xl bg-white p-12 text-center premium-shadow">
          <Heart className="h-16 w-16 text-gold/30 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-elegant-black mb-2">
            Nenhum favorito ainda
          </h3>
          <p className="text-graphite mb-6 max-w-md mx-auto">
            Clique no coração nos produtos da loja para salvar suas peças
            preferidas aqui.
          </p>
          <Link to={{ pathname: "/", hash: "produtos" }}>
            <Button variant="gold" size="lg">
              Explorar coleção
            </Button>
          </Link>
        </div>
        <RecommendedForYou />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold text-elegant-black">
          Favoritos
        </h2>
        <span className="text-sm text-graphite">
          {productIds.length} peça{productIds.length !== 1 ? "s" : ""} salva
          {productIds.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl bg-white premium-shadow overflow-hidden"
          >
            <div className="relative aspect-[3/4]">
              <img
                src={assetUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeFavorite(product.id)}
                className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-red-400 hover:text-red-500 transition-colors"
                aria-label="Remover dos favoritos"
              >
                <Heart className="h-5 w-5 fill-current" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs text-gold uppercase tracking-wider mb-1">
                {product.category}
              </p>
              <h3 className="font-serif text-lg font-semibold text-elegant-black mb-2">
                {product.name}
              </h3>
              <p className="font-serif text-xl font-semibold text-elegant-black mb-4">
                {formatCurrency(product.price)}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addItem(product, product.sizes[0], product.colors[0]);
                    openCart();
                  }}
                >
                  Adicionar
                </Button>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => openProductModal(product)}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Comprar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RecommendedForYou />
    </div>
  );
}
