import { useState } from "react";
import { Star, Truck, Minus, Plus, ShoppingBag } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { useUIStore } from "../../hooks/useUIStore";
import { useCart } from "../../hooks/useCart";
import { assetUrl } from "../../utils/withBase";

export function ProductModal() {
  const { selectedProduct, isProductModalOpen, closeProductModal, openCheckout } =
    useUIStore();
  const { addItem, openCart } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const size = selectedSize || product.sizes[0];
  const color = selectedColor || product.colors[0];

  const handleAddToCart = () => {
    addItem(product, size, color, quantity);
    closeProductModal();
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product, size, color, quantity);
    closeProductModal();
    openCheckout();
  };

  return (
    <Modal
      open={isProductModalOpen}
      onOpenChange={(open) => !open && closeProductModal()}
      size="xl"
      className="p-0 overflow-hidden"
    >
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5] sm:aspect-square md:aspect-auto md:min-h-[400px] lg:min-h-[500px] overflow-hidden">
          <img
            src={assetUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="gold">{product.tag}</Badge>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col">
          <p className="text-xs text-gold font-medium uppercase tracking-wider mb-2">
            {product.category}
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-elegant-black mb-3">
            {product.name}
          </h2>

          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-gold text-gold"
                    : "text-gray-200"
                }`}
              />
            ))}
            <span className="text-sm text-graphite ml-1">
              {product.rating} ({product.reviewCount} avaliações)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif text-3xl font-semibold text-elegant-black">
              {formatCurrency(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-graphite line-through">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="text-graphite leading-relaxed mb-6">{product.description}</p>

          <div className="mb-5">
            <p className="text-sm font-medium text-graphite mb-2">Tamanho</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    size === s
                      ? "border-gold bg-gold/10 text-gold-dark"
                      : "border-elegant-black/10 hover:border-gold/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-sm font-medium text-graphite mb-2">Cor</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    color === c
                      ? "border-gold bg-gold/10 text-gold-dark"
                      : "border-elegant-black/10 hover:border-gold/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-graphite mb-2">Quantidade</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-lg border border-elegant-black/10 p-2 hover:bg-cream-dark transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-lg border border-elegant-black/10 p-2 hover:bg-cream-dark transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-graphite mb-6 p-3 rounded-xl bg-cream-dark/50">
            <Truck className="h-4 w-4 text-gold shrink-0" />
            <span>Entrega em 1 a 3 dias úteis ou retirada em até 24h na loja</span>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <Button variant="gold" size="lg" onClick={handleBuyNow}>
              <ShoppingBag className="h-5 w-5" />
              Comprar agora
            </Button>
            <Button variant="outline" size="lg" onClick={handleAddToCart}>
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
