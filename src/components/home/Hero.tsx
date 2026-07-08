import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

import { useSettingsStore } from "../../stores/settingsStore";
import { assetUrl } from "../../utils/withBase";

export function Hero() {
  const settings = useSettingsStore((s) => s.settings);
  const scrollToProducts = () => {
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCollections = () => {
    document.getElementById("colecoes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-champagne via-cream to-rose-nude/40" />
      <div className="absolute inset-0 texture-subtle opacity-50" />

      <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose-nude/30 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge variant="gold" className="mb-6">
              <Sparkles className="h-3 w-3 mr-1 inline" />
              Nova Coleção 2026
            </Badge>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-elegant-black leading-tight mb-6">
              {settings.heroBannerText.includes("momentos") ? (
                <>
                  Elegância para{" "}
                  <span className="text-gradient-gold">todos os momentos</span>
                </>
              ) : (
                <span className="text-gradient-gold">{settings.heroBannerText}</span>
              )}
            </h1>

            <p className="text-lg text-graphite leading-relaxed mb-8 max-w-lg">
              Moda feminina selecionada para mulheres que valorizam conforto,
              beleza e sofisticação em cada detalhe.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" onClick={scrollToCollections}>
                Ver coleção
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToProducts}>
                Comprar agora
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-4 sm:gap-8">
              <div>
                <p className="font-serif text-3xl font-semibold text-gold">12+</p>
                <p className="text-sm text-graphite">Anos de experiência</p>
              </div>
              <div className="h-10 w-px bg-gold/30" />
              <div>
                <p className="font-serif text-3xl font-semibold text-gold">2.500+</p>
                <p className="text-sm text-graphite">Clientes atendidas</p>
              </div>
              <div className="h-10 w-px bg-gold/30 hidden sm:block" />
              <div className="hidden sm:block">
                <p className="font-serif text-3xl font-semibold text-gold">98%</p>
                <p className="text-sm text-graphite">Satisfação</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 rounded-3xl overflow-hidden premium-shadow-lg"
                style={{ perspective: "1000px" }}
              >
                <img
                  src={assetUrl("/images/hero.jpg")}
                  alt="Moda feminina elegante"
                  className="w-full h-[380px] sm:h-[500px] lg:h-[600px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-elegant-black/30 via-transparent to-transparent" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute left-2 sm:-left-4 top-16 glass rounded-2xl p-3 sm:p-4 premium-shadow z-20 hidden sm:block"
              >
                <p className="text-xs text-gold font-semibold uppercase tracking-wider">Destaque</p>
                <p className="font-serif text-lg font-semibold text-elegant-black">Vestido Midi</p>
                <p className="text-sm text-graphite">A partir de R$ 329</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-2 sm:-right-4 bottom-24 glass rounded-2xl p-3 sm:p-4 premium-shadow z-20 hidden sm:block"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full bg-gradient-to-br from-gold to-gold-light border-2 border-white"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-elegant-black">+500 avaliações</p>
                    <p className="text-xs text-gold">★★★★★ 4.9</p>
                  </div>
                </div>
              </motion.div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-elegant-black/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
