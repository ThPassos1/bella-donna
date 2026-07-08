import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 bg-elegant-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-elegant-black via-graphite to-warm-brown/30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex rounded-full bg-gold/10 p-3 mb-6">
            <Mail className="h-6 w-6 text-gold" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white mb-4">
            Receba novidades em primeira mão
          </h2>
          <p className="text-white/70 mb-8">
            Cadastre-se e seja a primeira a conhecer nossas novas coleções e
            promoções exclusivas.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 rounded-2xl bg-white/10 p-8 backdrop-blur-sm"
              >
                <CheckCircle className="h-12 w-12 text-gold" />
                <p className="text-lg font-medium text-white">
                  Obrigada, {name}! Você está inscrita em nossa newsletter.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row sm:flex-wrap gap-3 max-w-lg mx-auto"
              >
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1 min-w-0"
                />
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1 min-w-0"
                />
                <Button
                  variant="gold"
                  size="md"
                  type="submit"
                  className="w-full sm:w-auto shrink-0"
                >
                  Quero receber novidades
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
