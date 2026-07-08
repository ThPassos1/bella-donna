import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Heart, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCustomerOrders } from "../../hooks/useOrders";
import { useUserFavorites } from "../../hooks/useFavorites";
import { formatCurrency } from "../../utils/formatCurrency";
import { ORDER_STATUS_LABELS } from "../../types/account";
import { Button } from "../ui/Button";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { demoCoupons } from "../../data/demoCoupons";
import { FavoritesPreview } from "./FavoritesPreview";
import { RecommendedForYou } from "./RecommendedForYou";

export function AccountOverview() {
  const { user, firstName } = useAuth();
  const { getProductById } = useProducts();
  const orders = useCustomerOrders(user?.id ?? null, user?.email ?? null);
  const { productIds } = useUserFavorites(user?.id ?? null);
  const { addItem, openCart } = useCart();

  const lastOrder = orders[0];
  const recentProducts = orders
    .flatMap((o) => o.items)
    .slice(0, 4)
    .map((item) => getProductById(item.productId))
    .filter(Boolean);

  const handleBuyAgain = (productId: string) => {
    const product = getProductById(productId);
    if (product) {
      addItem(product, product.sizes[0], product.colors[0]);
      openCart();
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-elegant-black via-graphite to-warm-brown p-8 text-white premium-shadow-lg">
        <p className="text-gold text-sm font-semibold uppercase tracking-wider mb-2">
          Área do Cliente
        </p>
        <h2 className="font-serif text-3xl font-semibold mb-2">
          Olá, {firstName}! Que bom ter você de volta.
        </h2>
        <p className="text-white/70">
          Acompanhe seus pedidos, favoritos e compre com mais praticidade.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Package,
            label: "Total de pedidos",
            value: String(orders.length),
            link: "/minha-conta/pedidos",
          },
          {
            icon: Heart,
            label: "Favoritos salvos",
            value: String(productIds.length),
            link: "/minha-conta/favoritos",
          },
          {
            icon: Tag,
            label: "Cupons disponíveis",
            value: String(demoCoupons.length),
            link: "/minha-conta/cupons",
          },
          {
            icon: ShoppingBag,
            label: "Último pedido",
            value: lastOrder ? lastOrder.orderNumber : "—",
            link: "/minha-conta/pedidos",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={card.link}
              className="block rounded-2xl bg-white p-6 premium-shadow hover:premium-shadow-lg transition-all group"
            >
              <card.icon className="h-6 w-6 text-gold mb-3" />
              <p className="text-2xl font-serif font-semibold text-elegant-black">
                {card.value}
              </p>
              <p className="text-sm text-graphite mt-1">{card.label}</p>
              <ArrowRight className="h-4 w-4 text-gold mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        ))}
      </div>

      <FavoritesPreview />

      <RecommendedForYou />

      {lastOrder && (
        <div className="rounded-2xl bg-white p-6 premium-shadow">
          <h3 className="font-serif text-xl font-semibold text-elegant-black mb-4">
            Status do pedido mais recente
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-elegant-black">{lastOrder.orderNumber}</p>
              <p className="text-sm text-graphite">
                {new Date(lastOrder.date).toLocaleDateString("pt-BR")} ·{" "}
                {formatCurrency(lastOrder.total)}
              </p>
              <span className="inline-block mt-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                {ORDER_STATUS_LABELS[lastOrder.status]}
              </span>
            </div>
            <Link to="/minha-conta/pedidos">
              <Button variant="outline" size="md">
                Ver detalhes
              </Button>
            </Link>
          </div>
        </div>
      )}

      {recentProducts.length > 0 && (
        <div className="rounded-2xl bg-white p-6 premium-shadow">
          <h3 className="font-serif text-xl font-semibold text-elegant-black mb-6">
            Comprar novamente
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProducts.map((product) =>
              product ? (
                <div
                  key={product.id}
                  className="rounded-xl border border-elegant-black/5 overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-medium text-sm text-elegant-black line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-gold font-semibold text-sm mt-1">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="gold"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleBuyAgain(product.id)}
                      >
                        Comprar novamente
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
