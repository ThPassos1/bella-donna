import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useRecommendations } from "../../hooks/useRecommendations";
import { FavoritesPreview } from "../account/FavoritesPreview";
import { RecommendedForYou } from "../account/RecommendedForYou";
import { Button } from "../ui/Button";

export function PersonalizedHomeSection() {
  const { isLoggedIn, firstName } = useAuth();
  const { favoriteProducts, hasPersonalizationData } = useRecommendations();

  if (!isLoggedIn) return null;

  return (
    <section className="py-16 bg-cream texture-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold text-gold uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Sua experiência personalizada
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-elegant-black mb-3">
            Olá, {firstName}! Separamos peças para você
          </h2>
          <p className="text-graphite max-w-2xl mx-auto">
            {hasPersonalizationData
              ? "Com base nos seus favoritos e compras, encontramos peças que combinam com o seu estilo."
              : "Favorite produtos e faça compras para receber sugestões cada vez mais personalizadas."}
          </p>
          <Link to="/minha-conta" className="inline-block mt-4">
            <Button variant="outline" size="md">
              Ir para minha conta
            </Button>
          </Link>
        </motion.div>

        {favoriteProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-gold fill-gold" />
              <h3 className="font-serif text-xl font-semibold text-elegant-black">
                Seus favoritos
              </h3>
            </div>
            <FavoritesPreview limit={4} showTitle={false} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <RecommendedForYou compact />
        </motion.div>
      </div>
    </section>
  );
}
