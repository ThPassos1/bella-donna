import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { ProductFormModal } from "./ProductFormModal";
import { AdminConfirmDialog } from "./shared/AdminConfirmDialog";
import { AdminEmptyState } from "./shared/AdminEmptyState";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { formatCurrency } from "../../utils/formatCurrency";
import type { Product } from "../../types/product";
import { PRODUCT_CATEGORIES } from "../../types/product";
import { productToForm } from "../../hooks/useAdminProducts";
import { Badge } from "../ui/Badge";

export function AdminProducts() {
  const { filterProducts, deleteProduct, updateProduct } = useAdminProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const filtered = filterProducts(
    search,
    category as "all" | import("../../types/product").ProductCategory,
    status
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleToggleActive = (product: Product) => {
    updateProduct(product.id, { isActive: product.isActive === false });
    showToast(product.isActive === false ? "Produto ativado!" : "Produto desativado.");
  };

  const handleToggleFeatured = (product: Product) => {
    updateProduct(product.id, { isFeatured: !product.isFeatured });
    showToast("Destaque atualizado!");
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-4 z-50 rounded-xl bg-elegant-black text-white px-5 py-3 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="pl-11"
            />
          </div>
          <Select
            value={category}
            onValueChange={setCategory}
            options={[
              { value: "all", label: "Todas categorias" },
              ...PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c })),
            ]}
          />
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as typeof status)}
            options={[
              { value: "all", label: "Todos status" },
              { value: "active", label: "Ativos" },
              { value: "inactive", label: "Inativos" },
            ]}
          />
        </div>
        <Button
          variant="gold"
          size="lg"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo produto
        </Button>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={Plus}
          title="Nenhum produto encontrado"
          description="Cadastre seu primeiro produto ou ajuste os filtros de busca."
          action={
            <Button variant="gold" size="lg" onClick={() => setFormOpen(true)}>
              Cadastrar produto
            </Button>
          }
        />
      ) : (
        <div className="rounded-2xl bg-white premium-shadow border border-elegant-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="bg-cream-dark/50 text-sm text-graphite">
                  <th className="px-4 py-4 font-medium">Produto</th>
                  <th className="px-4 py-4 font-medium hidden md:table-cell">Categoria</th>
                  <th className="px-4 py-4 font-medium">Preço</th>
                  <th className="px-4 py-4 font-medium hidden sm:table-cell">Estoque</th>
                  <th className="px-4 py-4 font-medium hidden lg:table-cell">Status</th>
                  <th className="px-4 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-elegant-black/5 hover:bg-cream/50"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-medium text-elegant-black text-sm">{product.name}</p>
                          <p className="text-xs text-graphite">{product.tag}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-graphite hidden md:table-cell">
                      {product.category}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-elegant-black">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span
                        className={`text-sm font-medium ${
                          product.stock <= 5 ? "text-red-500" : "text-graphite"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {product.isActive === false ? (
                          <Badge variant="default">Inativo</Badge>
                        ) : (
                          <Badge variant="gold">Ativo</Badge>
                        )}
                        {product.isFeatured && <Badge variant="new">Destaque</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className="p-2 rounded-lg hover:bg-cream-dark text-graphite"
                          title={product.isActive === false ? "Ativar" : "Desativar"}
                        >
                          {product.isActive === false ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className="p-2 rounded-lg hover:bg-cream-dark text-graphite"
                          title="Destaque"
                        >
                          <Star
                            className={`h-4 w-4 ${product.isFeatured ? "fill-gold text-gold" : ""}`}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(product);
                            setFormOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-cream-dark text-graphite"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProductFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        initialData={editing ? productToForm(editing) : undefined}
        productId={editing?.id}
        onSaved={() => showToast(editing ? "Produto atualizado!" : "Produto cadastrado!")}
      />

      <AdminConfirmDialog
        open={!!deleteId}
        title="Excluir produto"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteProduct(deleteId);
            setDeleteId(null);
            showToast("Produto excluído.");
          }
        }}
      />
    </div>
  );
}
