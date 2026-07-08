import { useMemo } from "react";
import { useProductStore } from "../stores/productStore";
import type { Product, ProductCategory } from "../types/product";
import type { ProductFormData } from "../types/admin";

export function emptyProductForm(): ProductFormData {
  return {
    name: "",
    description: "",
    category: "Vestidos",
    price: 0,
    oldPrice: undefined,
    sizes: ["P", "M", "G"],
    colors: ["Único"],
    stock: 0,
    image: "/images/products/product-1.jpg",
    additionalImages: [],
    tag: "Novidade",
    isActive: true,
    isFeatured: false,
    isNew: true,
    bestsellerRank: undefined,
    stockByVariant: [],
  };
}

export function productToForm(product: Product): ProductFormData {
  return {
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    oldPrice: product.oldPrice,
    sizes: [...product.sizes],
    colors: [...product.colors],
    stock: product.stock,
    image: product.image,
    additionalImages: product.additionalImages ?? [],
    tag: product.tag,
    isActive: product.isActive !== false,
    isFeatured: product.isFeatured ?? false,
    isNew: product.isNew ?? false,
    bestsellerRank: product.bestsellerRank,
    stockByVariant: product.stockByVariant ?? [],
  };
}

export function formToProduct(form: ProductFormData, id?: string): Product {
  const productId = id ?? crypto.randomUUID();
  return {
    id: productId,
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    price: form.price,
    oldPrice: form.oldPrice && form.oldPrice > 0 ? form.oldPrice : undefined,
    sizes: form.sizes.filter(Boolean),
    colors: form.colors.filter(Boolean),
    stock: form.stock,
    image: form.image.trim() || "/images/products/product-1.jpg",
    additionalImages: form.additionalImages.filter(Boolean),
    tag: form.tag,
    rating: 4.8,
    reviewCount: 0,
    isActive: form.isActive,
    isFeatured: form.isFeatured,
    isNew: form.isNew,
    bestsellerRank:
      form.tag === "Mais vendido" ? form.bestsellerRank ?? 10 : form.bestsellerRank,
    stockByVariant: form.stockByVariant,
  };
}

export function useAdminProducts() {
  const products = useProductStore((s) => s.products);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.isActive !== false).length,
      inactive: products.filter((p) => p.isActive === false).length,
      lowStock: products.filter((p) => p.stock <= 5 && p.isActive !== false).length,
      featured: products.filter((p) => p.isFeatured).length,
    }),
    [products]
  );

  const filterProducts = (
    search: string,
    category: ProductCategory | "all",
    status: "all" | "active" | "inactive"
  ) => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchCategory = category === "all" || p.category === category;
      const matchStatus =
        status === "all" ||
        (status === "active" && p.isActive !== false) ||
        (status === "inactive" && p.isActive === false);
      return matchSearch && matchCategory && matchStatus;
    });
  };

  return {
    products,
    stats,
    addProduct,
    updateProduct,
    deleteProduct,
    filterProducts,
    saveProduct: (form: ProductFormData, id?: string) => {
      const product = formToProduct(form, id);
      if (id) {
        updateProduct(id, product);
      } else {
        addProduct(product);
      }
      return product;
    },
  };
}
