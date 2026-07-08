import { useState } from "react";
import { Headphones, MessageCircle, CheckCircle } from "lucide-react";
import { useCustomer } from "../../hooks/useCustomer";
import { useAuth } from "../../hooks/useAuth";
import { useCustomerOrders } from "../../hooks/useOrders";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

const subjectOptions = [
  { value: "pedido", label: "Dúvidas sobre pedido" },
  { value: "pagamento", label: "Pagamento" },
  { value: "entrega", label: "Entrega" },
  { value: "trocas", label: "Trocas" },
  { value: "produtos", label: "Produtos" },
  { value: "outros", label: "Outros" },
];

const ticketStatusLabel: Record<string, string> = {
  open: "Aberto",
  in_review: "Em análise",
  answered: "Respondido",
  closed: "Finalizado",
};

export function AccountSupport() {
  const { tickets, addTicket } = useCustomer();
  const { user } = useAuth();
  const orders = useCustomerOrders(user?.id ?? null, user?.email ?? null);
  const [subject, setSubject] = useState("pedido");
  const [message, setMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [sent, setSent] = useState(false);

  const orderOptions = [
    { value: "", label: "Nenhum pedido" },
    ...orders.map((o) => ({
      value: o.orderNumber,
      label: o.orderNumber,
    })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectLabel =
      subjectOptions.find((s) => s.value === subject)?.label ?? subject;
    addTicket({
      subject: subjectLabel,
      message,
      orderNumber: orderNumber || undefined,
    });
    setMessage("");
    setOrderNumber("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-2xl font-semibold text-elegant-black">
        Atendimento
      </h2>

      <div className="rounded-2xl bg-white p-6 premium-shadow">
        <h3 className="font-medium text-elegant-black mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-gold" />
          Enviar mensagem
        </h3>
        {sent && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-green-700 mb-4">
            <CheckCircle className="h-5 w-5" />
            Mensagem enviada com sucesso!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Assunto"
            value={subject}
            onValueChange={setSubject}
            options={subjectOptions}
          />
          <Select
            label="Pedido relacionado (opcional)"
            value={orderNumber}
            onValueChange={setOrderNumber}
            options={orderOptions}
          />
          <div>
            <label className="text-sm font-medium text-graphite block mb-1.5">
              Mensagem
            </label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-elegant-black/10 px-4 py-3 min-h-[120px] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              placeholder="Como podemos ajudar?"
            />
          </div>
          <Button variant="gold" size="lg" type="submit" className="w-full">
            Enviar mensagem
          </Button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 premium-shadow">
        <h3 className="font-medium text-elegant-black mb-4 flex items-center gap-2">
          <Headphones className="h-5 w-5 text-gold" />
          Histórico de chamados
        </h3>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-xl border border-elegant-black/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <p className="font-medium text-elegant-black">
                  Ticket #{ticket.id} — {ticket.subject}
                </p>
                <p className="text-sm text-graphite line-clamp-1">{ticket.message}</p>
              </div>
              <span
                className={`text-xs font-semibold rounded-full px-3 py-1 w-fit ${
                  ticket.status === "in_review"
                    ? "bg-amber-100 text-amber-700"
                    : ticket.status === "answered"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {ticketStatusLabel[ticket.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
