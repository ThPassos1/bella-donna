import type { Product, ProductCategory, ProductTag } from "../types/product";

export interface RecommendedProduct {
  product: Product;
  reason: string;
  score: number;
}

export interface CustomerPreferences {
  topCategories: { name: ProductCategory; score: number }[];
  topTags: { name: ProductTag; score: number }[];
  styleLabel: string;
  totalSignals: number;
}

export function analyzePreferences(
  favoriteIds: string[],
  orderProductIds: string[],
  catalog: Product[]
): CustomerPreferences {
  const categoryScores: Record<string, number> = {};
  const tagScores: Record<string, number> = {};

  const addSignal = (productId: string, weight: number) => {
    const product = catalog.find((p) => p.id === productId);
    if (!product) return;
    categoryScores[product.category] = (categoryScores[product.category] ?? 0) + weight;
    tagScores[product.tag] = (tagScores[product.tag] ?? 0) + weight;
  };

  favoriteIds.forEach((id) => addSignal(id, 3));
  orderProductIds.forEach((id) => addSignal(id, 2));

  const topCategories = Object.entries(categoryScores)
    .map(([name, score]) => ({ name: name as ProductCategory, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const topTags = Object.entries(tagScores)
    .map(([name, score]) => ({ name: name as ProductTag, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const totalSignals = favoriteIds.length + orderProductIds.length;

  let styleLabel = "Elegância atemporal";
  if (topCategories.length > 0 && topTags.length > 0) {
    styleLabel = `${topCategories[0].name} · ${topTags[0].name}`;
  } else if (topCategories.length > 0) {
    styleLabel = topCategories[0].name;
  } else if (topTags.length > 0) {
    styleLabel = `Estilo ${topTags[0].name.toLowerCase()}`;
  }

  return { topCategories, topTags, styleLabel, totalSignals };
}

export function getRecommendations(
  favoriteIds: string[],
  orderProductIds: string[],
  catalog: Product[],
  limit = 6
): RecommendedProduct[] {
  const alreadyKnown = new Set([...favoriteIds, ...orderProductIds]);
  const prefs = analyzePreferences(favoriteIds, orderProductIds, catalog);

  const categoryMap = Object.fromEntries(
    prefs.topCategories.map((c) => [c.name, c.score])
  );
  const tagMap = Object.fromEntries(prefs.topTags.map((t) => [t.name, t.score]));

  const scored = catalog
    .filter((p) => !alreadyKnown.has(p.id))
    .map((product) => {
      let score = 0;
      const reasons: string[] = [];

      const catScore = categoryMap[product.category] ?? 0;
      if (catScore > 0) {
        score += catScore * 2;
        reasons.push(`você adora ${product.category.toLowerCase()}`);
      }

      const tagScore = tagMap[product.tag] ?? 0;
      if (tagScore > 0) {
        score += tagScore * 1.5;
        reasons.push(`peças ${product.tag.toLowerCase()} combinam com você`);
      }

      if (product.bestsellerRank) score += 1;
      if (product.isNew) score += 0.5;

      const reason =
        reasons.length > 0
          ? `Porque ${reasons[0]}`
          : "Selecionado especialmente para você";

      return { product, reason, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    return scored.slice(0, limit);
  }

  return catalog
    .filter((p) => !alreadyKnown.has(p.id))
    .sort((a, b) => (a.bestsellerRank ?? 99) - (b.bestsellerRank ?? 99))
    .slice(0, limit)
    .map((product) => ({
      product,
      reason: "Destaque da nossa coleção",
      score: 0,
    }));
}
