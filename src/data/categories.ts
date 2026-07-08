export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  gradient: string;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Vestidos",
    slug: "vestidos",
    description: "Elegância em cada curva para ocasiões especiais",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop",
    gradient: "from-rose-nude/80 to-champagne",
  },
  {
    id: "2",
    name: "Blusas",
    slug: "blusas",
    description: "Peças versáteis para compor looks sofisticados",
    image:
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop",
    gradient: "from-champagne to-cream-dark",
  },
  {
    id: "3",
    name: "Conjuntos",
    slug: "conjuntos",
    description: "Harmonia e praticidade em um só look",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
    gradient: "from-gold/20 to-rose-nude/60",
  },
  {
    id: "4",
    name: "Moda casual",
    slug: "moda-casual",
    description: "Conforto e estilo para o dia a dia",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop",
    gradient: "from-cream-dark to-warm-brown/20",
  },
  {
    id: "5",
    name: "Moda elegante",
    slug: "moda-elegante",
    description: "Sofisticação para momentos marcantes",
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop",
    gradient: "from-elegant-black/10 to-gold/30",
  },
  {
    id: "6",
    name: "Acessórios",
    slug: "acessorios",
    description: "Detalhes que completam seu visual",
    image: "/images/categories/acessorios.jpg",
    gradient: "from-champagne to-gold/20",
  },
];
