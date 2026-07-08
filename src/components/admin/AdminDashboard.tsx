import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { AdminStatCard } from "./shared/AdminStatCard";
import { AdminStatusBadge } from "./shared/AdminStatusBadge";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { useAdminCustomers } from "../../hooks/useAdminCustomers";
import { formatCurrency } from "../../utils/formatCurrency";
import { ORDER_STATUS_FLOW } from "../../types/account";

export function AdminDashboard() {
  const { stats, orders, bestSellersFromOrders } = useAdminOrders();
  const { stats: productStats } = useAdminProducts();
  const { totalCustomers } = useAdminCustomers();

  const maxRevenue = Math.max(...stats.last7Days.map((d) => d.revenue), 1);
  const maxStatus = Math.max(...ORDER_STATUS_FLOW.map((s) => stats.byStatus[s] ?? 0), 1);
  const topProducts = bestSellersFromOrders.slice(0, 5);
  const maxSold = Math.max(...topProducts.map((p) => p.qty), 1);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          title="Faturamento do mês"
          value={formatCurrency(stats.monthRevenue)}
          icon={DollarSign}
        />
        <AdminStatCard
          title="Pedidos hoje"
          value={stats.todayOrders}
          icon={ShoppingBag}
          accent="blue"
        />
        <AdminStatCard
          title="Pedidos do mês"
          value={stats.monthOrders}
          icon={Clock}
        />
        <AdminStatCard
          title="Clientes cadastrados"
          value={totalCustomers}
          icon={Users}
          accent="green"
        />
        <AdminStatCard
          title="Produtos ativos"
          value={productStats.active}
          icon={Package}
        />
        <AdminStatCard
          title="Ticket médio"
          value={formatCurrency(stats.averageTicket)}
          icon={TrendingUp}
        />
        <AdminStatCard
          title="Pedidos pendentes"
          value={stats.pendingCount}
          subtitle={formatCurrency(stats.pendingValue)}
          icon={AlertTriangle}
          accent="red"
        />
        <AdminStatCard
          title="Estoque baixo"
          value={productStats.lowStock}
          subtitle="5 unidades ou menos"
          icon={AlertTriangle}
          accent="red"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 premium-shadow border border-elegant-black/5"
        >
          <h2 className="font-serif text-lg font-semibold text-elegant-black mb-6">
            Faturamento — últimos 7 dias
          </h2>
          <div className="flex items-end gap-2 h-48">
            {stats.last7Days.map((day) => (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-graphite">
                  {day.revenue > 0 ? formatCurrency(day.revenue) : "—"}
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-gold to-gold-light transition-all"
                  style={{ height: `${(day.revenue / maxRevenue) * 100}%`, minHeight: day.revenue > 0 ? 8 : 4 }}
                />
                <span className="text-[10px] text-graphite capitalize">{day.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 premium-shadow border border-elegant-black/5"
        >
          <h2 className="font-serif text-lg font-semibold text-elegant-black mb-6">
            Pedidos por status
          </h2>
          <div className="space-y-3">
            {ORDER_STATUS_FLOW.filter((s) => s !== "cancelled").map((status) => {
              const count = stats.byStatus[status] ?? 0;
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1">
                    <AdminStatusBadge status={status} />
                    <span className="text-sm font-medium text-elegant-black">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-cream-dark overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold transition-all"
                      style={{ width: `${(count / maxStatus) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white p-6 premium-shadow border border-elegant-black/5">
          <h2 className="font-serif text-lg font-semibold text-elegant-black mb-4">
            Produtos mais vendidos
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-graphite text-sm">Nenhuma venda registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((item, i) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-gold text-sm font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-elegant-black truncate">
                        {item.name}
                      </p>
                      <div className="h-1.5 rounded-full bg-cream-dark mt-1">
                        <div
                          className="h-full rounded-full bg-gold"
                          style={{ width: `${(item.qty / maxSold) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-graphite whitespace-nowrap">
                      {item.qty} un.
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 premium-shadow border border-elegant-black/5">
          <h2 className="font-serif text-lg font-semibold text-elegant-black mb-4">
            Pedidos recentes
          </h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 py-2 border-b border-elegant-black/5 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-elegant-black truncate">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-graphite truncate">
                    {order.customerName ?? order.customerEmail}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-elegant-black">
                    {formatCurrency(order.total)}
                  </p>
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
