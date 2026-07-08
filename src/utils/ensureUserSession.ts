import { useAuthStore } from "../stores/authStore";
import { useFavoritesStore } from "../hooks/useFavorites";
import { demoUser, demoPaymentMethods } from "../data/demoCustomer";
import type { SupportTicket } from "../types/account";

const PAYMENTS_KEY = "bd-payments";
const TICKETS_KEY = "bd-tickets";

const DEMO_TICKETS: SupportTicket[] = [
  {
    id: "1023",
    userId: demoUser.id,
    subject: "Dúvida sobre prazo de entrega",
    message: "Gostaria de saber quando meu pedido chegará.",
    orderNumber: "MBD-2026-0002",
    status: "in_review",
    createdAt: "2026-06-29T10:00:00.000Z",
  },
  {
    id: "1018",
    userId: demoUser.id,
    subject: "Troca de tamanho",
    message: "Preciso trocar o vestido por um tamanho maior.",
    orderNumber: "MBD-2026-0003",
    status: "answered",
    createdAt: "2026-06-20T14:00:00.000Z",
  },
];

/** Prepara dados do usuário ao entrar (favoritos, pagamentos, tickets demo). */
export function ensureUserSessionData(userId: string) {
  useFavoritesStore.getState().ensureDemoFavorites(userId);

  if (userId !== demoUser.id) return;

  const auth = useAuthStore.getState();

  const payments = auth.paymentMethods[userId];
  if (!payments?.length) {
    const all = { ...auth.paymentMethods, [userId]: demoPaymentMethods };
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(all));
    useAuthStore.setState({ paymentMethods: all });
  }

  const hasUserTickets = auth.tickets.some((t) => t.userId === userId);
  if (!hasUserTickets) {
    const tickets = [...DEMO_TICKETS, ...auth.tickets];
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    useAuthStore.setState({ tickets });
  }
}
