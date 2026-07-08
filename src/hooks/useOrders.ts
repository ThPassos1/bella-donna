import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMemo } from "react";
import type { CustomerOrder, CustomerOrderStatus } from "../types/account";
import type { Order } from "../types/checkout";
import { demoCustomerOrders } from "../data/demoOrders";
import { getAllOrders as getStoredOrders, saveOrders } from "../utils/generateOrderNumber";

const CUSTOMER_ORDERS_KEY = "bd-customer-orders";

const paymentLabels: Record<string, string> = {
  pix: "Pix",
  credit: "Cartão de crédito",
  debit: "Cartão de débito",
  cash: "Dinheiro na entrega",
};

interface OrdersStore {
  customerOrders: CustomerOrder[];
  addCustomerOrder: (order: CustomerOrder) => void;
  getOrdersForUser: (userId: string, email: string) => CustomerOrder[];
  getAllOrders: () => CustomerOrder[];
  updateOrderStatus: (orderNumber: string, status: CustomerOrderStatus, note?: string) => void;
  convertCheckoutOrder: (order: Order, userId?: string) => CustomerOrder;
}

function loadOrders(): CustomerOrder[] {
  try {
    const raw = localStorage.getItem(CUSTOMER_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function convertStoredOrder(order: Order): CustomerOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerId: `guest-${order.customer.email}`,
    customerEmail: order.customer.email,
    customerName: order.customer.fullName,
    customerPhone: order.customer.phone,
    date: order.createdAt,
    status: mapCheckoutStatus(order.status),
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    paymentMethod: paymentLabels[order.payment.method] ?? order.payment.method,
    deliveryMethod: order.deliveryMethod,
    deliveryAddress:
      order.deliveryMethod === "pickup"
        ? undefined
        : `${order.address.street}, ${order.address.number} — ${order.address.neighborhood}, ${order.address.city}/${order.address.state}`,
    items: order.items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      image: item.product.image,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.product.price,
    })),
    statusHistory: [{ status: mapCheckoutStatus(order.status), date: order.createdAt }],
  };
}

function mapCheckoutStatus(status: Order["status"]): CustomerOrderStatus {
  if (status === "payment_review") return "payment_review";
  if (status === "preparing") return "preparing";
  if (status === "shipped") return "shipped";
  if (status === "delivered") return "delivered";
  return "received";
}

function mapToCheckoutStatus(status: CustomerOrderStatus): Order["status"] {
  if (status === "payment_review") return "payment_review";
  if (status === "preparing" || status === "payment_approved") return "preparing";
  if (status === "shipped") return "shipped";
  if (status === "delivered") return "delivered";
  return "received";
}

function mergeAllOrders(customerOrders: CustomerOrder[]): CustomerOrder[] {
  const numbers = new Set(customerOrders.map((o) => o.orderNumber));
  const storedCheckout = (getStoredOrders() as Order[])
    .filter((o) => !numbers.has(o.orderNumber))
    .map(convertStoredOrder);

  const demo =
    demoCustomerOrders.filter(
      (o) => !customerOrders.some((s) => s.orderNumber === o.orderNumber)
    );

  return [...customerOrders, ...storedCheckout, ...demo].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      customerOrders: loadOrders(),

      addCustomerOrder: (order) => {
        const orders = [order, ...get().customerOrders];
        localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(orders));
        set({ customerOrders: orders });
      },

      getOrdersForUser: (userId, email) => {
        const all = mergeAllOrders(get().customerOrders);
        return all.filter(
          (o) => o.customerId === userId || o.customerEmail === email
        );
      },

      getAllOrders: () => mergeAllOrders(get().customerOrders),

      updateOrderStatus: (orderNumber, status, note) => {
        const now = new Date().toISOString();
        let customerOrders = [...get().customerOrders];

        if (!customerOrders.some((o) => o.orderNumber === orderNumber)) {
          const existing = mergeAllOrders(customerOrders).find(
            (o) => o.orderNumber === orderNumber
          );
          if (existing) customerOrders = [existing, ...customerOrders];
        }

        customerOrders = customerOrders.map((order) => {
          if (order.orderNumber !== orderNumber) return order;
          const history = order.statusHistory ?? [
            { status: order.status, date: order.date },
          ];
          return {
            ...order,
            status,
            statusHistory: [...history, { status, date: now, note }],
          };
        });

        localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(customerOrders));

        const mbdOrders = getStoredOrders() as Order[];
        const updatedMbd = mbdOrders.map((order) =>
          order.orderNumber === orderNumber
            ? { ...order, status: mapToCheckoutStatus(status) }
            : order
        );
        saveOrders(updatedMbd);

        set({ customerOrders });
      },

      convertCheckoutOrder: (order, userId) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerId: userId ?? `guest-${order.customer.email}`,
        customerEmail: order.customer.email,
        customerName: order.customer.fullName,
        customerPhone: order.customer.phone,
        date: order.createdAt,
        status: "received",
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        total: order.total,
        paymentMethod: paymentLabels[order.payment.method] ?? order.payment.method,
        deliveryMethod: order.deliveryMethod,
        deliveryAddress:
          order.deliveryMethod === "pickup"
            ? undefined
            : `${order.address.street}, ${order.address.number} — ${order.address.neighborhood}, ${order.address.city}/${order.address.state}`,
        items: order.items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          image: item.product.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.product.price,
        })),
        statusHistory: [{ status: "received", date: order.createdAt }],
      }),
    }),
    {
      name: "bd-orders-store",
      partialize: (state) => ({ customerOrders: state.customerOrders }),
    }
  )
);

const EMPTY_ORDERS: CustomerOrder[] = [];

export function useOrders() {
  return useOrdersStore();
}

export function useCustomerOrders(userId: string | null, email: string | null) {
  const customerOrders = useOrdersStore((s) => s.customerOrders);
  const getOrdersForUser = useOrdersStore((s) => s.getOrdersForUser);

  return useMemo(() => {
    if (!userId || !email) return EMPTY_ORDERS;
    return getOrdersForUser(userId, email);
  }, [userId, email, customerOrders, getOrdersForUser]);
}
