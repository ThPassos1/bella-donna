import type { Product } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
