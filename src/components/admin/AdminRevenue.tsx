import { useState } from "react";
import { DollarSign } from "lucide-react";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { AdminStatCard } from "./shared/AdminStatCard";
import { AdminStatusBadge } from "./shared/AdminStatusBadge";
import { Select } from "../ui/Select";
import { formatCurrency } from "../../utils/formatCurrency";
import type { AdminOrderFilters } from "../../types/admin";

export function AdminRevenue() {
  const { stats, filterOrders } = useAdminOrders();
  const [period, setPeriod] = useState<AdminOrderFilters["period"]>("month");

  const filtered = filterOrders({
    search: "",
    status: "all",
    payment: "all",
    period,
  });

  const paymentMethods = ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro na entrega"];

  return (
    <div className="space-y-8">
      <Select
        value={period}
        onValueChange={(v) => setPeriod(v as AdminOrderFilters["period"])}
        options={[
          { value: "today", label: "Hoje" },
          { value: "7d", label: "Últimos 7 dias" },
          { value: "30d", label: "Últimos 30 dias" },
          { value: "month", label: "Este mês" },
          { value: "all", label: "Todo período" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          title="Faturamento total"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
        />
        <AdminStatCard
          title="Faturamento do mês"
          value={formatCurrency(stats.monthRevenue)}
          icon={DollarSign}
        />
        <AdminStatCard
          title="Faturamento da semana"
          value={formatCurrency(stats.weekRevenue)}
          icon={DollarSign}
        />
        <AdminStatCard
          title="Faturamento de hoje"
          value={formatCurrency(stats.todayRevenue)}
          icon={DollarSign}
        />
        <AdminStatCard
          title="Ticket médio"
          value={formatCurrency(stats.averageTicket)}
          icon={DollarSign}
        />
        <AdminStatCard
          title="Pedidos pagos"
          value={stats.paidCount}
          icon={DollarSign}
          accent="green"
        />
        <AdminStatCard
          title="Pedidos cancelados"
          value={stats.cancelledCount}
          icon={DollarSign}
          accent="red"
        />
        <AdminStatCard
          title="Valor pendente"
          value={formatCurrency(stats.pendingValue)}
          subtitle={`${stats.pendingCount} pedidos`}
          icon={DollarSign}
          accent="red"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white p-6 premium-shadow border border-elegant-black/5">
          <h2 className="font-serif text-lg font-semibold text-elegant-black mb-4">
            Por forma de pagamento
          </h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const total = Object.entries(stats.byPayment)
                .filter(([k]) => k.toLowerCase().includes(method.split(" ")[0].toLowerCase()))
                .reduce((s, [, v]) => s + v, 0);
              const maxPay = Math.max(...Object.values(stats.byPayment), 1);
              return (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-graphite">{method}</span>
                    <span className="font-medium">{formatCurrency(total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-cream-dark">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${(total / maxPay) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 premium-shadow border border-elegant-black/5">
          <h2 className="font-serif text-lg font-semibold text-elegant-black mb-4">
            Vendas recentes
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filtered.slice(0, 15).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-2 py-2 border-b border-elegant-black/5 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-elegant-black truncate">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-graphite truncate">
                    {order.customerName ?? order.customerEmail}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">{formatCurrency(order.total)}</p>
                  <AdminStatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
