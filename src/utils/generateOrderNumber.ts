const ORDERS_KEY = "bd-orders";

export function generateOrderNumber(): string {
  const stored = localStorage.getItem(ORDERS_KEY);
  const orders = stored ? JSON.parse(stored) : [];
  const nextNumber = orders.length + 1;
  return `MBD-2026-${String(nextNumber).padStart(4, "0")}`;
}

export function saveOrder(order: unknown): void {
  const stored = localStorage.getItem(ORDERS_KEY);
  const orders = stored ? JSON.parse(stored) : [];
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function saveOrders(orders: unknown[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getLatestOrder(): unknown | null {
  const stored = localStorage.getItem(ORDERS_KEY);
  if (!stored) return null;
  const orders = JSON.parse(stored);
  return orders.length > 0 ? orders[orders.length - 1] : null;
}

export function getAllOrders(): unknown[] {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
}
