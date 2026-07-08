import { useMemo } from "react";
import { useAuthStore } from "../stores/authStore";
import { useAdminCustomerStore } from "../stores/adminCustomerStore";
import { useAdminOrders } from "./useAdminOrders";
import type { StoredUser } from "../types/customer";

export interface AdminCustomerView {
  user: StoredUser;
  isActive: boolean;
  internalNotes: string;
  orderCount: number;
  totalSpent: number;
  lastPurchase: string | null;
  averageTicket: number;
}

export function useAdminCustomers() {
  const users = useAuthStore((s) => s.users);
  const meta = useAdminCustomerStore((s) => s.meta);
  const getMeta = useAdminCustomerStore((s) => s.getMeta);
  const updateMeta = useAdminCustomerStore((s) => s.updateMeta);
  const { orders } = useAdminOrders();

  const customers = useMemo<AdminCustomerView[]>(() => {
    return users.map((user) => {
      const userOrders = orders.filter(
        (o) =>
          o.customerId === user.id ||
          o.customerEmail.toLowerCase() === user.email.toLowerCase()
      );
      const paidOrders = userOrders.filter((o) => o.status !== "cancelled");
      const totalSpent = paidOrders.reduce((s, o) => s + o.total, 0);
      const lastPurchase = paidOrders[0]?.date ?? null;
      const customerMeta = meta[user.id] ?? getMeta(user.id);

      return {
        user,
        isActive: customerMeta.isActive,
        internalNotes: customerMeta.internalNotes,
        orderCount: paidOrders.length,
        totalSpent,
        lastPurchase,
        averageTicket: paidOrders.length > 0 ? totalSpent / paidOrders.length : 0,
      };
    });
  }, [users, orders, meta, getMeta]);

  const searchCustomers = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.user.customer.fullName.toLowerCase().includes(q) ||
        c.user.email.toLowerCase().includes(q) ||
        c.user.customer.phone.includes(q)
    );
  };

  const getCustomerById = (id: string) =>
    customers.find((c) => c.user.id === id);

  const getCustomerOrders = (userId: string, email: string) =>
    orders.filter(
      (o) => o.customerId === userId || o.customerEmail.toLowerCase() === email.toLowerCase()
    );

  const getTopProductsForCustomer = (userId: string, email: string) => {
    const userOrders = getCustomerOrders(userId, email).filter(
      (o) => o.status !== "cancelled"
    );
    const map = new Map<string, { name: string; qty: number }>();
    userOrders.forEach((order) => {
      order.items.forEach((item) => {
        const cur = map.get(item.productId) ?? { name: item.name, qty: 0 };
        map.set(item.productId, { name: item.name, qty: cur.qty + item.quantity });
      });
    });
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  };

  return {
    customers,
    totalCustomers: customers.length,
    activeCustomers: customers.filter((c) => c.isActive).length,
    searchCustomers,
    getCustomerById,
    getCustomerOrders,
    getTopProductsForCustomer,
    updateMeta,
  };
}
