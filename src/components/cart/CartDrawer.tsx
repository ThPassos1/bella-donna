import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useUIStore } from "../../hooks/useUIStore";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { Button } from "../ui/Button";

export function CartDrawer() {
  const { items, isOpen, closeCart } = useCart();
  const { openCheckout } = useUIStore();

  const handleCheckout = () => {
    closeCart();
    openCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-elegant-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white premium-shadow-lg flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-elegant-black/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <h2 className="font-serif text-xl font-semibold text-elegant-black">
                  Seu Carrinho
                </h2>
                {items.length > 0 && (
                  <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold">
                    {items.reduce((s, i) => s + i.quantity, 0)} itens
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="rounded-full p-2 hover:bg-cream-dark transition-colors"
                aria-label="Fechar carrinho"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag className="h-16 w-16 text-gold/30 mb-4" />
                <p className="font-serif text-xl text-elegant-black mb-2">
                  Seu carrinho está vazio
                </p>
                <p className="text-sm text-graphite mb-6">
                  Explore nossa coleção e encontre peças incríveis
                </p>
                <Button variant="gold" onClick={closeCart}>
                  Continuar comprando
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                <div className="p-6 border-t border-elegant-black/5 bg-cream/30">
                  <CartSummary
                    showCheckoutButton
                    onCheckout={handleCheckout}
                  />
                  <Button
                    variant="ghost"
                    size="md"
                    className="w-full mt-3"
                    onClick={closeCart}
                  >
                    Continuar comprando
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
