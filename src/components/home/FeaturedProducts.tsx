import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../product/ProductCard";
import { Select } from "../ui/Select";
import { useUIStore } from "../../hooks/useUIStore";
type SortOption = "bestseller" | "price-asc" | "price-desc" | "new";

const categoryOptions = [
  { value: "all", label: "Todas as categorias" },
  { value: "Vestidos", label: "Vestidos" },
  { value: "Blusas", label: "Blusas" },
  { value: "Conjuntos", label: "Conjuntos" },
  { value: "Moda casual", label: "Moda casual" },
  { value: "Moda elegante", label: "Moda elegante" },
  { value: "Acessórios", label: "Acessórios" },
];

const priceOptions = [
  { value: "all", label: "Todos os preços" },
  { value: "0-200", label: "Até R$ 200" },
  { value: "200-350", label: "R$ 200 - R$ 350" },
  { value: "350-500", label: "R$ 350 - R$ 500" },
  { value: "500+", label: "Acima de R$ 500" },
];

const sortOptions = [
  { value: "bestseller", label: "Mais vendidos" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "new", label: "Novidades" },
];

function filterByPrice(price: number, range: string): boolean {
  switch (range) {
    case "0-200":
      return price <= 200;
    case "200-350":
      return price > 200 && price <= 350;
    case "350-500":
      return price > 350 && price <= 500;
    case "500+":
      return price > 500;
    default:
      return true;
  }
}

export function FeaturedProducts() {
  const { products } = useProducts();
  const { searchQuery } = useUIStore();
  const [localSearch, setLocalSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState<SortOption>("bestseller");
  const [showFilters, setShowFilters] = useState(false);

  const query = searchQuery || localSearch;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (priceRange !== "all") {
      result = result.filter((p) => filterByPrice(p.price, priceRange));
    }

    switch (sort) {
      case "bestseller":
        result.sort((a, b) => (a.bestsellerRank ?? 99) - (b.bestsellerRank ?? 99));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "new":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [query, category, priceRange, sort]);

  return (
    <section id="produtos" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm font-semibold text-gold uppercase tracking-[0.2em] mb-3">
            Vitrine
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-elegant-black">
            Produtos em destaque
          </h2>
        </motion.div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Buscar por nome, categoria ou tag..."
                className="w-full rounded-xl border border-elegant-black/10 bg-cream/50 py-3 pl-12 pr-4 text-base focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 rounded-xl border border-elegant-black/10 bg-cream/50 px-5 py-3 text-sm font-medium text-graphite hover:border-gold/40 transition-colors sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </button>
          </div>

          <div
            className={`${showFilters ? "grid" : "hidden sm:grid"} grid-cols-1 sm:grid-cols-3 gap-3`}
          >
            <Select
              value={category}
              onValueChange={setCategory}
              options={categoryOptions}
              placeholder="Categoria"
            />
            <Select
              value={priceRange}
              onValueChange={setPriceRange}
              options={priceOptions}
              placeholder="Faixa de preço"
            />
            <Select
              value={sort}
              onValueChange={(v) => setSort(v as SortOption)}
              options={sortOptions}
              placeholder="Ordenar por"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-graphite">
              Nenhum produto encontrado. Tente outros filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
