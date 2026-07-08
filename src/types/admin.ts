import type { CustomerOrderStatus } from "./account";
import type { Product, ProductCategory, ProductTag } from "./product";

export interface AdminUser {
  email: string;
  name: string;
}

export interface AdminCustomerMeta {
  userId: string;
  isActive: boolean;
  internalNotes: string;
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  fixedShipping: number;
  pickupEnabled: boolean;
  deliveryDays: string;
  pixEnabled: boolean;
  cardEnabled: boolean;
  cashEnabled: boolean;
  primaryColor: string;
  heroBannerText: string;
  footerText: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  sizes: string[];
  colors: string[];
  stock: number;
  image: string;
  additionalImages: string[];
  tag: ProductTag;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  bestsellerRank?: number;
  stockByVariant: { size: string; color: string; stock: number }[];
}

export interface AdminOrderFilters {
  search: string;
  status: CustomerOrderStatus | "all";
  payment: string;
  period: "all" | "today" | "7d" | "30d" | "month";
}

export interface RevenuePeriod {
  label: string;
  value: "today" | "7d" | "30d" | "month" | "all";
}

export interface BestSellerRow {
  product: Product;
  quantitySold: number;
  revenue: number;
  rank: number;
}

export interface DashboardStats {
  monthRevenue: number;
  todayOrders: number;
  monthOrders: number;
  totalCustomers: number;
  activeProducts: number;
  averageTicket: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export const ADMIN_CREDENTIALS = {
  email: "admin@belladonna.com",
  password: "123456",
};
