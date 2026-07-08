export interface Favorite {
  productId: string;
  addedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: "credit" | "debit" | "pix";
  label: string;
  lastFour?: string;
  isDefault: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  expiresAt: string;
}

export type SupportTicketStatus = "open" | "in_review" | "answered" | "closed";

export interface SupportTicket {
  id: string;
  userId?: string;
  subject: string;
  message: string;
  orderNumber?: string;
  status: SupportTicketStatus;
  createdAt: string;
}

export type ReturnPreference =
  | "size_exchange"
  | "product_exchange"
  | "coupon"
  | "refund";

export interface ReturnRequest {
  id: string;
  userId?: string;
  orderNumber: string;
  productName: string;
  reason: string;
  notes?: string;
  preference: ReturnPreference;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface OrderItemView {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export type CustomerOrderStatus =
  | "received"
  | "payment_review"
  | "payment_approved"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderStatusEvent {
  status: CustomerOrderStatus;
  date: string;
  note?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  date: string;
  status: CustomerOrderStatus;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  paymentMethod: string;
  deliveryMethod: "delivery" | "pickup";
  deliveryAddress?: string;
  notes?: string;
  items: OrderItemView[];
  statusHistory?: OrderStatusEvent[];
}

export const ORDER_STATUS_LABELS: Record<CustomerOrderStatus, string> = {
  received: "Pedido recebido",
  payment_review: "Pagamento em análise",
  payment_approved: "Pagamento aprovado",
  preparing: "Em separação",
  shipped: "Saiu para entrega",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const ORDER_STATUS_FLOW: CustomerOrderStatus[] = [
  "received",
  "payment_review",
  "payment_approved",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

export type AccountSection =
  | "overview"
  | "orders"
  | "favorites"
  | "profile"
  | "addresses"
  | "payments"
  | "coupons"
  | "returns"
  | "support"
  | "settings";
