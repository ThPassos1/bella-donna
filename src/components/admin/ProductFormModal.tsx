import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import type { ProductFormData } from "../../types/admin";
import { PRODUCT_CATEGORIES, PRODUCT_TAGS } from "../../types/product";
import {
  emptyProductForm,
  useAdminProducts,
} from "../../hooks/useAdminProducts";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: ProductFormData;
  productId?: string;
  onSaved: () => void;
}

export function ProductFormModal({
  open,
  onClose,
  initialData,
  productId,
  onSaved,
}: ProductFormModalProps) {
  const { saveProduct } = useAdminProducts();
  const [form, setForm] = useState<ProductFormData>(emptyProductForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialData ?? emptyProductForm());
      setErrors({});
    }
  }, [open, initialData]);

  const update = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    if (!form.category) e.category = "Categoria é obrigatória";
    if (!form.price || form.price <= 0) e.price = "Preço deve ser maior que zero";
    if (form.stock < 0) e.stock = "Estoque não pode ser negativo";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      saveProduct(form, productId);
      setSaving(false);
      onSaved();
      onClose();
    }, 500);
  };

  const sizesStr = form.sizes.join(", ");
  const colorsStr = form.colors.join(", ");
  const extraImagesStr = form.additionalImages.join("\n");

  return (
    <Modal
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={productId ? "Editar produto" : "Novo produto"}
      size="lg"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        <section>
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
            Dados principais
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-elegant-black">Nome *</label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="mt-1"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-elegant-black">Categoria *</label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  update("category", v as ProductFormData["category"])
                }
                options={PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-elegant-black">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl border border-elegant-black/10 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
            Preço
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-elegant-black">Preço *</label>
              <Input
                type="number"
                step="0.01"
                value={form.price || ""}
                onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-elegant-black">Preço promocional</label>
              <Input
                type="number"
                step="0.01"
                value={form.oldPrice ?? ""}
                onChange={(e) =>
                  update("oldPrice", parseFloat(e.target.value) || undefined)
                }
                className="mt-1"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
            Variações
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-elegant-black">
                Tamanhos (separados por vírgula)
              </label>
              <Input
                value={sizesStr}
                onChange={(e) =>
                  update(
                    "sizes",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="P, M, G, GG"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-elegant-black">
                Cores (separadas por vírgula)
              </label>
              <Input
                value={colorsStr}
                onChange={(e) =>
                  update(
                    "colors",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="Preto, Nude, Champagne"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-elegant-black">Estoque total</label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => update("stock", parseInt(e.target.value) || 0)}
                className="mt-1"
              />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
            Imagens
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-elegant-black">URL imagem principal</label>
              <Input
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                placeholder="/images/products/product-1.jpg"
                className="mt-1"
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="mt-2 h-24 w-24 rounded-xl object-cover"
                />
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-elegant-black">
                URLs adicionais (uma por linha)
              </label>
              <textarea
                value={extraImagesStr}
                onChange={(e) =>
                  update(
                    "additionalImages",
                    e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                  )
                }
                rows={2}
                className="mt-1 w-full rounded-xl border border-elegant-black/10 px-4 py-3 text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
            Exibição
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={form.tag}
              onValueChange={(v) => update("tag", v as ProductFormData["tag"])}
              options={PRODUCT_TAGS.map((t) => ({ value: t, label: t }))}
            />
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              { key: "isActive" as const, label: "Produto ativo" },
              { key: "isFeatured" as const, label: "Destaque na vitrine" },
              { key: "isNew" as const, label: "Novidade" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => update(key, e.target.checked)}
                  className="h-4 w-4 rounded border-gold text-gold focus:ring-gold"
                />
                <span className="text-sm text-elegant-black">{label}</span>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.tag === "Mais vendido"}
                onChange={(e) => {
                  update("tag", e.target.checked ? "Mais vendido" : "Novidade");
                  if (e.target.checked) update("bestsellerRank", 10);
                }}
                className="h-4 w-4 rounded border-gold text-gold focus:ring-gold"
              />
              <span className="text-sm text-elegant-black">Mais vendido</span>
            </label>
          </div>
        </section>
      </div>

      <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-elegant-black/5">
        <Button variant="outline" size="lg" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="gold" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar produto"}
        </Button>
      </div>
    </Modal>
  );
}
