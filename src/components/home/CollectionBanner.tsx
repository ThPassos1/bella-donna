import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export function CollectionBanner() {
  const scrollToProducts = () => {
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden premium-shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-elegant-black via-graphite to-warm-brown" />
          <div className="absolute inset-0 texture-subtle opacity-30" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 sm:p-12 lg:p-16">
            <div>
              <p className="text-sm font-semibold text-gold uppercase tracking-[0.2em] mb-4">
                Nova Coleção
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6">
                Beleza que acompanha sua rotina
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg">
                Peças versáteis para mulheres que querem se sentir elegantes no
                dia a dia, no trabalho e em ocasiões especiais.
              </p>
              <Button variant="gold" size="lg" onClick={scrollToProducts}>
                Conhecer coleção
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative mx-auto w-80">
                <img
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=650&fit=crop"
                  alt="Nova coleção"
                  className="rounded-2xl premium-shadow-lg w-full h-[420px] object-cover"
                  style={{ transform: "rotate(3deg)" }}
                />
                <div className="absolute -bottom-4 -left-8 w-48 h-64 rounded-2xl overflow-hidden premium-shadow border-4 border-white/20"
                  style={{ transform: "rotate(-6deg)" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop"
                    alt="Detalhe da coleção"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
