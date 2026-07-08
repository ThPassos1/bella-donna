import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { AdminStatusBadge } from "./shared/AdminStatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import type { CustomerOrder, CustomerOrderStatus } from "../../types/account";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from "../../types/account";
import { AdminConfirmDialog } from "./shared/AdminConfirmDialog";
import { useState } from "react";
import { CheckCircle, Printer, XCircle } from "lucide-react";
import { assetUrl } from "../../utils/withBase";

interface OrderAdminDetailsModalProps {
  order: CustomerOrder | null;
  onClose: () => void;
  onStatusChange: (orderNumber: string, status: CustomerOrderStatus) => void;
  onPrint: (order: CustomerOrder) => void;
}

export function OrderAdminDetailsModal({
  order,
  onClose,
  onStatusChange,
  onPrint,
}: OrderAdminDetailsModalProps) {
  const [newStatus, setNewStatus] = useState<CustomerOrderStatus>("received");
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!order) return null;

  const timeline = order.statusHistory ?? [{ status: order.status, date: order.date }];

  return (
    <>
      <Modal
        open={!!order}
        onOpenChange={(v) => !v && onClose()}
        title={`Pedido ${order.orderNumber}`}
        size="lg"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-wrap items-center gap-3">
            <AdminStatusBadge status={order.status} />
            <span className="text-sm text-graphite">
              {new Date(order.date).toLocaleString("pt-BR")}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-cream-dark/50 p-4">
              <h4 className="text-sm font-semibold text-elegant-black mb-2">Cliente</h4>
              <p className="text-sm text-graphite">{order.customerName ?? "—"}</p>
              <p className="text-sm text-graphite">{order.customerEmail}</p>
              {order.customerPhone && (
                <p className="text-sm text-graphite">{order.customerPhone}</p>
              )}
            </div>
            <div className="rounded-xl bg-cream-dark/50 p-4">
              <h4 className="text-sm font-semibold text-elegant-black mb-2">Entrega</h4>
              <p className="text-sm text-graphite">
                {order.deliveryMethod === "pickup" ? "Retirada na loja" : "Entrega"}
              </p>
              {order.deliveryAddress && (
                <p className="text-sm text-graphite">{order.deliveryAddress}</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-elegant-black mb-3">Produtos</h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center gap-3 rounded-xl bg-white border border-elegant-black/5 p-3"
                >
                  <img
                    src={assetUrl(item.image)}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-elegant-black">{item.name}</p>
                    <p className="text-xs text-graphite">
                      {item.size} / {item.color} — {item.quantity}x{" "}
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-elegant-black">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-cream-dark/50 p-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-graphite">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite">Desconto</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite">Frete</span>
              <span>{formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold text-elegant-black pt-2 border-t border-elegant-black/10">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <p className="text-graphite pt-2">Pagamento: {order.paymentMethod}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-elegant-black mb-3">
              Timeline do pedido
            </h4>
            <div className="space-y-2">
              {timeline.map((event, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-gold shrink-0" />
                  <AdminStatusBadge status={event.status} />
                  <span className="text-graphite">
                    {new Date(event.date).toLocaleString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-elegant-black/5 pt-4">
            <h4 className="text-sm font-semibold text-elegant-black mb-3">
              Alterar status
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={newStatus}
                onValueChange={(v) => setNewStatus(v as CustomerOrderStatus)}
                options={ORDER_STATUS_FLOW.map((s) => ({
                  value: s,
                  label: ORDER_STATUS_LABELS[s],
                }))}
              />
              <Button
                variant="gold"
                size="lg"
                onClick={() => onStatusChange(order.orderNumber, newStatus)}
              >
                Atualizar status
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange(order.orderNumber, "delivered")}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Marcar entregue
              </Button>
              <Button variant="outline" size="sm" onClick={() => onPrint(order)}>
                <Printer className="h-4 w-4 mr-1" />
                Imprimir
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => setConfirmCancel(true)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancelar pedido
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <AdminConfirmDialog
        open={confirmCancel}
        title="Cancelar pedido"
        message="Tem certeza que deseja cancelar este pedido?"
        confirmLabel="Cancelar pedido"
        danger
        onCancel={() => setConfirmCancel(false)}
        onConfirm={() => {
          onStatusChange(order.orderNumber, "cancelled");
          setConfirmCancel(false);
        }}
      />
    </>
  );
}
