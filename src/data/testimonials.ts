export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Maria Helena S.",
    text: "Comprei pelo site e achei tudo muito fácil. As peças chegaram lindas e bem embaladas.",
    rating: 5,
    avatar: "MH",
  },
  {
    id: "2",
    name: "Ana Cláudia R.",
    text: "As roupas são elegantes, confortáveis e vestem muito bem.",
    rating: 5,
    avatar: "AC",
  },
  {
    id: "3",
    name: "Rosa Aparecida M.",
    text: "Agora consigo acompanhar as novidades da loja sem precisar sair de casa.",
    rating: 5,
    avatar: "RA",
  },
];
