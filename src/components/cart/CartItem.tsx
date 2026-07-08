import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import type { CartItem as CartItemType } from "../../types/cart";
import { useCart } from "../../hooks/useCart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const lineTotal = item.product.price * item.quantity;

  return (
    <div className="flex gap-3 sm:gap-4 py-4 border-b border-elegant-black/5">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="h-24 w-20 rounded-xl object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-elegant-black text-sm line-clamp-1">
          {item.product.name}
        </h4>
        <p className="text-xs text-graphite mt-0.5">
          {item.size} · {item.color}
        </p>
        <p className="text-sm font-semibold text-elegant-black mt-2">
          {formatCurrency(item.product.price)}
        </p>

        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="rounded-lg border border-elegant-black/10 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-cream-dark transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="rounded-lg border border-elegant-black/10 p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-cream-dark transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm font-semibold text-elegant-black">
              {formatCurrency(lineTotal)}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-graphite hover:text-red-500 transition-colors"
              aria-label="Remover item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
