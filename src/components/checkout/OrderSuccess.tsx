import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import type { Order } from "../../types/checkout";
import { useUIStore } from "../../hooks/useUIStore";
import { useCart } from "../../hooks/useCart";

interface OrderSuccessProps {
  order: Order;
}

export function OrderSuccess({ order }: OrderSuccessProps) {
  const { closeOrderSuccess, openOrderStatus } = useUIStore();
  const { clearCart } = useCart();

  const handleContinue = () => {
    clearCart();
    closeOrderSuccess();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paymentLabels: Record<string, string> = {
    pix: "Pix",
    credit: "Cartão de crédito",
    debit: "Cartão de débito",
    cash: "Dinheiro na entrega",
  };

  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light"
      >
        <CheckCircle className="h-10 w-10 text-white" />
      </motion.div>

      <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-elegant-black mb-2">
        Pedido confirmado!
      </h2>
      <p className="text-gold font-semibold text-lg mb-4">{order.orderNumber}</p>
      <p className="text-graphite leading-relaxed mb-8 max-w-md mx-auto">
        Pedido recebido com sucesso! Você receberá a confirmação por e-mail e
        poderá acompanhar o status da sua compra.
      </p>

      <div className="rounded-2xl bg-cream-dark/50 p-6 text-left mb-8 max-w-md mx-auto">
        <h3 className="font-semibold text-elegant-black mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-gold" />
          Resumo da compra
        </h3>
        <div className="space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-graphite">
                {item.product.name} x{item.quantity}
              </span>
              <span className="font-medium">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t border-elegant-black/10 pt-2 mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          <p className="text-xs text-graphite pt-2">
            Pagamento: {paymentLabels[order.payment.method]}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="gold" size="lg" onClick={handleContinue}>
          Continuar comprando
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            closeOrderSuccess();
            openOrderStatus();
          }}
        >
          Ver status do pedido
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
