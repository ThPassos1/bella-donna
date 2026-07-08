import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../hooks/useCart";

interface CartSummaryProps {
  deliveryMethod?: "delivery" | "pickup";
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

export function CartSummary({
  deliveryMethod = "delivery",
  showCheckoutButton = false,
  onCheckout,
}: CartSummaryProps) {
  const { getSubtotal, getDiscount, getShipping, getTotal } = useCart();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping(deliveryMethod);
  const total = getTotal(deliveryMethod);

  return (
    <div className="space-y-3 pt-4 border-t border-elegant-black/10">
      <div className="flex justify-between text-sm">
        <span className="text-graphite">Subtotal</span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-graphite">Desconto (5%)</span>
          <span className="font-medium text-green-600">
            -{formatCurrency(discount)}
          </span>
        </div>
      )}
      <div className="flex justify-between text-sm">
        <span className="text-graphite">Frete</span>
        <span className="font-medium">
          {shipping === 0 ? "Grátis" : formatCurrency(shipping)}
        </span>
      </div>
      <div className="flex justify-between text-lg font-semibold pt-2 border-t border-elegant-black/5">
        <span>Total</span>
        <span className="font-serif text-elegant-black">
          {formatCurrency(total)}
        </span>
      </div>
      {showCheckoutButton && onCheckout && (
        <button
          onClick={onCheckout}
          className="w-full mt-2 rounded-full bg-gradient-to-r from-gold to-gold-light py-3.5 text-white font-medium hover:from-gold-dark hover:to-gold transition-all shadow-md"
        >
          Finalizar compra
        </button>
      )}
    </div>
  );
}
