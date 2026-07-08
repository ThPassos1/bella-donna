import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { assetUrl } from "../../utils/withBase";

const stats = [
  { value: "12", label: "Anos de experiência" },
  { value: "2.500", label: "Clientes atendidas" },
  { value: "98%", label: "De satisfação" },
];

export function AboutSection() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden premium-shadow-lg">
              <img
                src={assetUrl("/images/about-boutique.jpg")}
                alt="Boutique Bella Donna"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-6 premium-shadow hidden sm:block">
              <p className="font-serif text-4xl font-semibold text-gold">12</p>
              <p className="text-sm text-graphite">anos de tradição</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold text-gold uppercase tracking-[0.2em] mb-3">
              Nossa História
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-elegant-black mb-6">
              Sobre a Bella Donna
            </h2>
            <p className="text-graphite text-lg leading-relaxed mb-8">
              A Bella Donna nasceu para valorizar a beleza feminina em
              todas as fases da vida. Selecionamos peças confortáveis, elegantes
              e versáteis para mulheres que desejam se vestir bem todos os dias.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-2xl sm:text-3xl font-semibold text-gold">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-graphite mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <Button variant="outline" size="lg">
              Conheça nossa história
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
