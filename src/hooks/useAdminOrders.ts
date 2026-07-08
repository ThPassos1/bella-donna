import { useMemo } from "react";
import { useOrdersStore } from "./useOrders";
import type { CustomerOrder, CustomerOrderStatus } from "../types/account";
import type { AdminOrderFilters } from "../types/admin";

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function isThisMonth(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function inLastDays(dateStr: string, days: number) {
  const d = new Date(dateStr).getTime();
  const limit = Date.now() - days * 24 * 60 * 60 * 1000;
  return d >= limit;
}

function filterByPeriod(order: CustomerOrder, period: AdminOrderFilters["period"]) {
  switch (period) {
    case "today":
      return isToday(order.date);
    case "7d":
      return inLastDays(order.date, 7);
    case "30d":
      return inLastDays(order.date, 30);
    case "month":
      return isThisMonth(order.date);
    default:
      return true;
  }
}

export function useAdminOrders() {
  const customerOrders = useOrdersStore((s) => s.customerOrders);
  const getAllOrders = useOrdersStore((s) => s.getAllOrders);
  const updateOrderStatus = useOrdersStore((s) => s.updateOrderStatus);

  const orders = useMemo(() => getAllOrders(), [customerOrders, getAllOrders]);

  const filterOrders = (filters: AdminOrderFilters) => {
    const q = filters.search.toLowerCase().trim();
    return orders.filter((order) => {
      const matchSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        (order.customerName ?? "").toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q);
      const matchStatus =
        filters.status === "all" || order.status === filters.status;
      const matchPayment =
        filters.payment === "all" ||
        order.paymentMethod.toLowerCase().includes(filters.payment.toLowerCase());
      const matchPeriod = filterByPeriod(order, filters.period);
      return matchSearch && matchStatus && matchPayment && matchPeriod;
    });
  };

  const stats = useMemo(() => {
    const paidStatuses: CustomerOrderStatus[] = [
      "payment_approved",
      "preparing",
      "shipped",
      "delivered",
    ];
    const pendingStatuses: CustomerOrderStatus[] = [
      "received",
      "payment_review",
    ];
    const paid = orders.filter(
      (o) => paidStatuses.includes(o.status) || o.status === "delivered"
    );
    const cancelled = orders.filter((o) => o.status === "cancelled");
    const pending = orders.filter((o) => pendingStatuses.includes(o.status));
    const monthOrders = orders.filter((o) => isThisMonth(o.date));
    const todayOrders = orders.filter((o) => isToday(o.date));
    const monthRevenue = monthOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0);
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0);
    const validOrders = orders.filter((o) => o.status !== "cancelled");
    const averageTicket =
      validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

    return {
      totalRevenue,
      monthRevenue,
      weekRevenue: orders
        .filter((o) => inLastDays(o.date, 7) && o.status !== "cancelled")
        .reduce((s, o) => s + o.total, 0),
      todayRevenue: todayOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + o.total, 0),
      todayOrders: todayOrders.length,
      monthOrders: monthOrders.length,
      averageTicket,
      paidCount: paid.length,
      cancelledCount: cancelled.length,
      pendingValue: pending.reduce((s, o) => s + o.total, 0),
      pendingCount: pending.length,
      byStatus: orders.reduce(
        (acc, o) => {
          acc[o.status] = (acc[o.status] ?? 0) + 1;
          return acc;
        },
        {} as Record<CustomerOrderStatus, number>
      ),
      byPayment: orders.reduce(
        (acc, o) => {
          const key = o.paymentMethod;
          acc[key] = (acc[key] ?? 0) + o.total;
          return acc;
        },
        {} as Record<string, number>
      ),
      last7Days: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const key = date.toISOString().slice(0, 10);
        const dayOrders = orders.filter(
          (o) => o.date.slice(0, 10) === key && o.status !== "cancelled"
        );
        return {
          label: date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" }),
          revenue: dayOrders.reduce((s, o) => s + o.total, 0),
          orders: dayOrders.length,
        };
      }),
    };
  }, [orders]);

  const bestSellersFromOrders = useMemo(() => {
    const map = new Map<string, { qty: number; revenue: number; name: string }>();
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((order) => {
        order.items.forEach((item) => {
          const current = map.get(item.productId) ?? {
            qty: 0,
            revenue: 0,
            name: item.name,
          };
          map.set(item.productId, {
            name: item.name,
            qty: current.qty + item.quantity,
            revenue: current.revenue + item.price * item.quantity,
          });
        });
      });
    return [...map.entries()]
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.qty - a.qty);
  }, [orders]);

  return {
    orders,
    stats,
    filterOrders,
    updateOrderStatus,
    bestSellersFromOrders,
  };
}
