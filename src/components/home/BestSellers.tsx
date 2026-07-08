import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../ui/Button";
import { useCart } from "../../hooks/useCart";
import { assetUrl } from "../../utils/withBase";

export function BestSellers() {
  const { bestSellers } = useProducts();
  const { addItem, openCart } = useCart();

  const handleBuy = (product: (typeof bestSellers)[0]) => {
    addItem(product, product.sizes[0], product.colors[0]);
    openCart();
  };

  return (
    <section id="mais-vendidos" className="py-20 bg-cream texture-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-gold uppercase tracking-[0.2em] mb-3">
            Favoritas da Semana
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-elegant-black">
            Peças escolhidas pelas nossas clientes
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative rounded-3xl bg-white premium-shadow-lg overflow-hidden hover:premium-shadow-gold transition-all duration-500"
            >
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-light px-4 py-1.5 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                <Crown className="h-3.5 w-3.5" />
                Top {index + 1}
              </div>

              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={assetUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6 text-center">
                <p className="text-xs text-gold font-medium uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h3 className="font-serif text-xl font-semibold text-elegant-black mb-3">
                  {product.name}
                </h3>
                <p className="font-serif text-2xl font-semibold text-elegant-black mb-5">
                  {formatCurrency(product.price)}
                </p>
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={() => handleBuy(product)}
                >
                  Comprar agora
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
