import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Home,
  XCircle,
  Download,
  HelpCircle,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import type { CustomerOrder, CustomerOrderStatus } from "../../types/account";
import { assetUrl } from "../../utils/withBase";

const timelineSteps: {
  key: CustomerOrderStatus;
  label: string;
  icon: typeof CheckCircle2;
}[] = [
  { key: "received", label: "Pedido recebido", icon: CheckCircle2 },
  { key: "payment_approved", label: "Pagamento aprovado", icon: Clock },
  { key: "preparing", label: "Em separação", icon: Package },
  { key: "shipped", label: "Saiu para entrega", icon: Truck },
  { key: "delivered", label: "Entregue", icon: Home },
];

const statusOrder: CustomerOrderStatus[] = [
  "received",
  "payment_approved",
  "preparing",
  "shipped",
  "delivered",
];

interface OrderDetailsModalProps {
  order: CustomerOrder | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  const currentIndex =
    order.status === "cancelled"
      ? -1
      : statusOrder.indexOf(order.status);

  return (
    <Modal open={!!order} onOpenChange={(open) => !open && onClose()} size="lg" title={`Pedido ${order.orderNumber}`}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {order.status === "cancelled" ? (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Pedido cancelado</span>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium text-elegant-black">Acompanhe seu pedido</h4>
            {timelineSteps.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isCompleted
                        ? "bg-gradient-to-br from-gold to-gold-light text-white"
                        : "bg-cream-dark text-graphite"
                    } ${isCurrent ? "ring-4 ring-gold/20" : ""}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`font-medium ${isCompleted ? "text-elegant-black" : "text-graphite"}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="text-xs text-gold font-semibold">Status atual</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="rounded-xl bg-cream-dark/50 p-4 space-y-2 text-sm">
          <p className="font-medium text-elegant-black">Entrega</p>
          <p className="text-graphite">
            {order.deliveryMethod === "pickup"
              ? "Retirada na loja"
              : order.deliveryAddress ?? "Endereço de entrega"}
          </p>
          <p className="font-medium text-elegant-black pt-2">Pagamento</p>
          <p className="text-graphite">{order.paymentMethod}</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-elegant-black">Produtos</h4>
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="flex gap-4 items-center">
              <img
                src={assetUrl(item.image)}
                alt={item.name}
                className="h-16 w-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-graphite">
                  {item.size} · {item.color} · x{item.quantity}
                </p>
              </div>
              <p className="font-semibold text-sm">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-elegant-black/10 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-graphite">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-graphite">Desconto</span>
              <span className="text-green-600">-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-graphite">Frete</span>
            <span>
              {order.shipping === 0 ? "Grátis" : formatCurrency(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2">
            <span>Total</span>
            <span className="font-serif">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" size="md" className="flex-1" onClick={() => alert("Comprovante gerado com sucesso.")}>
            <Download className="h-4 w-4" />
            Baixar comprovante
          </Button>
          <Button variant="outline" size="md" className="flex-1" onClick={() => alert("Nossa equipe entrará em contato em breve.")}>
            <HelpCircle className="h-4 w-4" />
            Preciso de ajuda
          </Button>
        </div>
      </div>
    </Modal>
  );
}
