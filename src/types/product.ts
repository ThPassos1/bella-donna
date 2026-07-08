export type ProductTag = "Mais vendido" | "Novidade" | "Elegante" | "Confortável";

export type ProductCategory =
  | "Vestidos"
  | "Blusas"
  | "Conjuntos"
  | "Moda casual"
  | "Moda elegante"
  | "Acessórios";

export interface StockVariant {
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  description: string;
  sizes: string[];
  colors: string[];
  stock: number;
  image: string;
  additionalImages?: string[];
  tag: ProductTag;
  rating: number;
  reviewCount: number;
  bestsellerRank?: number;
  isNew?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  stockByVariant?: StockVariant[];
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Vestidos",
  "Blusas",
  "Conjuntos",
  "Moda casual",
  "Moda elegante",
  "Acessórios",
];

export const PRODUCT_TAGS: ProductTag[] = [
  "Mais vendido",
  "Novidade",
  "Elegante",
  "Confortável",
];
