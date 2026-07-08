import { useState } from "react";
import { Package, Eye, RefreshCw, ShoppingBag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCustomerOrders } from "../../hooks/useOrders";
import { formatCurrency } from "../../utils/formatCurrency";
import { ORDER_STATUS_LABELS } from "../../types/account";
import type { CustomerOrder } from "../../types/account";
import { Button } from "../ui/Button";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { withBase } from "../../utils/withBase";

export function AccountOrders() {
  const { user } = useAuth();
  const { getProductById } = useProducts();
  const orders = useCustomerOrders(user?.id ?? null, user?.email ?? null);
  const [selected, setSelected] = useState<CustomerOrder | null>(null);
  const { addItem, openCart } = useCart();

  const handleBuyAgain = (order: CustomerOrder) => {
    order.items.forEach((item) => {
      const product = getProductById(item.productId);
      if (product) {
        addItem(product, item.size, item.color, item.quantity);
      }
    });
    openCart();
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center premium-shadow">
        <Package className="h-16 w-16 text-gold/30 mx-auto mb-4" />
        <h3 className="font-serif text-xl text-elegant-black mb-2">
          Nenhum pedido ainda
        </h3>
        <p className="text-graphite mb-6">
          Quando você fizer uma compra, seus pedidos aparecerão aqui.
        </p>
        <Button variant="gold" size="lg" onClick={() => (window.location.href = withBase("/#produtos"))}>
          Ver produtos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-elegant-black">
        Meus pedidos
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl bg-white p-6 premium-shadow hover:premium-shadow-lg transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                <p className="font-semibold text-elegant-black text-lg">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-graphite">
                  {new Date(order.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold">
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.productId + item.size} className="flex items-center gap-2 rounded-xl bg-cream-dark/50 px-3 py-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span className="text-sm text-graphite">{item.name}</span>
                </div>
              ))}
              {order.items.length > 3 && (
                <span className="text-sm text-graphite self-center">
                  +{order.items.length - 3} itens
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-elegant-black/5">
              <div className="text-sm text-graphite space-y-1">
                <p>
                  <strong>Total:</strong> {formatCurrency(order.total)}
                </p>
                <p>
                  <strong>Pagamento:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Entrega:</strong>{" "}
                  {order.deliveryMethod === "pickup"
                    ? "Retirada na loja"
                    : "Entrega local"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => setSelected(order)}>
                  <Eye className="h-4 w-4" />
                  Ver detalhes
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBuyAgain(order)}>
                  <ShoppingBag className="h-4 w-4" />
                  Comprar novamente
                </Button>
                {order.status === "delivered" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelected(order)}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Solicitar troca
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <OrderDetailsModal
        order={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
