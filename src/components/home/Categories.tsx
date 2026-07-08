import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "../../data/categories";
import { Button } from "../ui/Button";
import { assetUrl } from "../../utils/withBase";

export function Categories() {
  const scrollToProducts = () => {
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="colecoes" className="py-20 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-gold uppercase tracking-[0.2em] mb-3">
            Nossas Coleções
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-elegant-black">
            Explore por categoria
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden premium-shadow hover:premium-shadow-lg transition-all duration-500"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={assetUrl(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.gradient} via-elegant-black/40 to-elegant-black/60`}
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="font-serif text-2xl font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-white/80 mb-4">{category.description}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-fit bg-white/90 hover:bg-white"
                  onClick={scrollToProducts}
                >
                  Ver peças
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
