import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "../../data/testimonials";

export function Testimonials() {
  return (
    <section className="py-20 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-gold uppercase tracking-[0.2em] mb-3">
            Depoimentos
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-elegant-black">
            O que nossas clientes dizem
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl bg-white p-8 premium-shadow hover:premium-shadow-lg transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gold/20" />

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-graphite leading-relaxed mb-6 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <p className="font-medium text-elegant-black">{testimonial.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
