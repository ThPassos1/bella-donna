import type { CartItem } from "./cart";

export type DeliveryMethod = "delivery" | "pickup";
export type PaymentMethod = "pix" | "credit" | "debit" | "cash";

export interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  cpf?: string;
}

export interface AddressData {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface PaymentData {
  method: PaymentMethod;
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  installments?: string;
  changeFor?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerData;
  address: AddressData;
  deliveryMethod: DeliveryMethod;
  payment: PaymentData;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type OrderStatus =
  | "received"
  | "payment_review"
  | "preparing"
  | "shipped"
  | "delivered";

export interface CheckoutStep {
  step: 1 | 2 | 3 | 4;
}
