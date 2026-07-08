import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Home,
} from "lucide-react";
import type { OrderStatus as OrderStatusType } from "../../types/checkout";
import { getLatestOrder } from "../../utils/generateOrderNumber";
import type { Order } from "../../types/checkout";

const steps: {
  key: OrderStatusType;
  label: string;
  description: string;
  icon: typeof CheckCircle2;
}[] = [
  {
    key: "received",
    label: "Pedido recebido",
    description: "Seu pedido foi registrado com sucesso",
    icon: CheckCircle2,
  },
  {
    key: "payment_review",
    label: "Pagamento em análise",
    description: "Estamos confirmando seu pagamento",
    icon: Clock,
  },
  {
    key: "preparing",
    label: "Pedido em separação",
    description: "Nossa equipe está preparando suas peças",
    icon: Package,
  },
  {
    key: "shipped",
    label: "Saiu para entrega",
    description: "Seu pedido está a caminho",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Entregue",
    description: "Pedido entregue com sucesso",
    icon: Home,
  },
];

const statusOrder: OrderStatusType[] = [
  "received",
  "payment_review",
  "preparing",
  "shipped",
  "delivered",
];

function getCurrentStepIndex(status: OrderStatusType): number {
  return statusOrder.indexOf(status);
}

interface OrderStatusProps {
  order?: Order | null;
}

export function OrderStatus({ order: propOrder }: OrderStatusProps) {
  const latestOrder = (propOrder || getLatestOrder()) as Order | null;

  if (!latestOrder) {
    return (
      <div className="text-center py-8">
        <p className="text-graphite">Nenhum pedido encontrado.</p>
      </div>
    );
  }

  const currentIndex = getCurrentStepIndex(latestOrder.status);

  return (
    <div className="py-4">
      <div className="text-center mb-8">
        <p className="text-sm text-gold font-semibold uppercase tracking-wider mb-2">
          Acompanhe seu pedido
        </p>
        <h3 className="font-serif text-2xl font-semibold text-elegant-black">
          {latestOrder.orderNumber}
        </h3>
      </div>

      <div className="relative max-w-md mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-5 top-10 w-0.5 h-[calc(100%-2rem)] ${
                    isCompleted ? "bg-gold" : "bg-elegant-black/10"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                  isCompleted
                    ? "bg-gradient-to-br from-gold to-gold-light text-white shadow-md"
                    : "bg-cream-dark text-graphite"
                } ${isCurrent ? "ring-4 ring-gold/20" : ""}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="pt-1.5">
                <p
                  className={`font-medium ${
                    isCompleted ? "text-elegant-black" : "text-graphite"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-sm text-graphite mt-0.5">{step.description}</p>
                {isCurrent && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-block mt-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold"
                  >
                    Status atual
                  </motion.span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
