import { useState } from "react";
import { Search, Eye, Printer } from "lucide-react";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { AdminStatusBadge } from "./shared/AdminStatusBadge";
import { AdminEmptyState } from "./shared/AdminEmptyState";
import { OrderAdminDetailsModal } from "./OrderAdminDetailsModal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { formatCurrency } from "../../utils/formatCurrency";
import type { CustomerOrder, CustomerOrderStatus } from "../../types/account";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from "../../types/account";
import type { AdminOrderFilters } from "../../types/admin";

export function AdminOrders() {
  const { filterOrders, updateOrderStatus } = useAdminOrders();
  const [filters, setFilters] = useState<AdminOrderFilters>({
    search: "",
    status: "all",
    payment: "all",
    period: "all",
  });
  const [selected, setSelected] = useState<CustomerOrder | null>(null);
  const [toast, setToast] = useState("");

  const filtered = filterOrders(filters);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleStatusChange = (orderNumber: string, status: CustomerOrderStatus) => {
    updateOrderStatus(orderNumber, status);
    showToast(`Status atualizado: ${ORDER_STATUS_LABELS[status]}`);
    if (selected?.orderNumber === orderNumber) {
      setSelected((prev) =>
        prev ? { ...prev, status } : null
      );
    }
  };

  const handlePrint = (order: CustomerOrder) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Pedido ${order.orderNumber}</title>
      <style>body{font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto}
      h1{color:#c9a962}table{width:100%;border-collapse:collapse;margin:16px 0}
      td,th{padding:8px;border-bottom:1px solid #eee;text-align:left}</style></head>
      <body>
      <h1>Bella Donna</h1>
      <h2>Pedido ${order.orderNumber}</h2>
      <p><strong>Cliente:</strong> ${order.customerName ?? order.customerEmail}</p>
      <p><strong>Data:</strong> ${new Date(order.date).toLocaleString("pt-BR")}</p>
      <p><strong>Status:</strong> ${ORDER_STATUS_LABELS[order.status]}</p>
      <table><tr><th>Produto</th><th>Qtd</th><th>Valor</th></tr>
      ${order.items.map((i) => `<tr><td>${i.name} (${i.size}/${i.color})</td><td>${i.quantity}</td><td>R$ ${(i.price * i.quantity).toFixed(2)}</td></tr>`).join("")}
      </table>
      <p><strong>Total:</strong> R$ ${order.total.toFixed(2)}</p>
      </body></html>
    `);
    win.print();
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-4 z-50 rounded-xl bg-elegant-black text-white px-5 py-3 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Buscar pedido ou cliente..."
            className="pl-11"
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(v) =>
            setFilters({ ...filters, status: v as AdminOrderFilters["status"] })
          }
          options={[
            { value: "all", label: "Todos status" },
            ...ORDER_STATUS_FLOW.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] })),
          ]}
        />
        <Select
          value={filters.payment}
          onValueChange={(v) => setFilters({ ...filters, payment: v })}
          options={[
            { value: "all", label: "Todos pagamentos" },
            { value: "Pix", label: "Pix" },
            { value: "Cartão", label: "Cartão" },
            { value: "Dinheiro", label: "Dinheiro" },
          ]}
        />
        <Select
          value={filters.period}
          onValueChange={(v) =>
            setFilters({ ...filters, period: v as AdminOrderFilters["period"] })
          }
          options={[
            { value: "all", label: "Todo período" },
            { value: "today", label: "Hoje" },
            { value: "7d", label: "Últimos 7 dias" },
            { value: "30d", label: "Últimos 30 dias" },
            { value: "month", label: "Este mês" },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={Search}
          title="Nenhum pedido encontrado"
          description="Os pedidos feitos na loja aparecerão aqui automaticamente."
        />
      ) : (
        <div className="rounded-2xl bg-white premium-shadow border border-elegant-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="bg-cream-dark/50 text-sm text-graphite">
                  <th className="px-4 py-4 font-medium">Pedido</th>
                  <th className="px-4 py-4 font-medium">Cliente</th>
                  <th className="px-4 py-4 font-medium hidden md:table-cell">Data</th>
                  <th className="px-4 py-4 font-medium hidden sm:table-cell">Itens</th>
                  <th className="px-4 py-4 font-medium">Total</th>
                  <th className="px-4 py-4 font-medium hidden lg:table-cell">Pagamento</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-elegant-black/5 hover:bg-cream/50"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-elegant-black">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-4 text-sm text-graphite">
                      {order.customerName ?? order.customerEmail}
                    </td>
                    <td className="px-4 py-4 text-sm text-graphite hidden md:table-cell">
                      {new Date(order.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-4 text-sm text-graphite hidden sm:table-cell">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-elegant-black">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-4 text-sm text-graphite hidden lg:table-cell">
                      {order.paymentMethod}
                    </td>
                    <td className="px-4 py-4">
                      <AdminStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setSelected(order)}
                          className="p-2 rounded-lg hover:bg-cream-dark text-graphite"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePrint(order)}
                          className="p-2 rounded-lg hover:bg-cream-dark text-graphite"
                          title="Imprimir"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <OrderAdminDetailsModal
        order={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
        onPrint={handlePrint}
      />
    </div>
  );
}
